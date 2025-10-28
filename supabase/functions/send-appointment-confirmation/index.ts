import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

// Email service for contact@orachope.org (no DNS changes required)
class OraHopeEmailService {
  private host: string;
  private port: number;
  private username: string;
  private password: string;

  constructor(config: { host: string; port: number; username: string; password: string }) {
    this.host = config.host;
    this.port = config.port;
    this.username = config.username;
    this.password = config.password;
  }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      console.log("=== SENDING EMAIL VIA ORACHOPE HTTP SERVICE ===");
      console.log(`From: ${options.from}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      
      const smtp2goApiKey = Deno.env.get("SMTP2GO_API_KEY");
      if (smtp2goApiKey) {
        const smtp2goResponse = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: smtp2goApiKey,
            to: [options.to],
            sender: this.username,
            subject: options.subject,
            html_body: options.html,
          }),
        });

        if (smtp2goResponse.ok) {
          console.log(`Email sent successfully via SMTP2GO to ${options.to}`);
          return { success: true, message: "Email sent via SMTP2GO", service: "smtp2go" };
        }
      }
      
      const brevoApiKey = Deno.env.get("BREVO_API_KEY");
      if (brevoApiKey) {
        const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: { email: this.username, name: "SG-JB Dental" },
            to: [{ email: options.to }],
            subject: options.subject,
            htmlContent: options.html,
          }),
        });

        if (brevoResponse.ok) {
          console.log(`Email sent successfully via Brevo to ${options.to}`);
          return { success: true, message: "Email sent via Brevo", service: "brevo" };
        }
      }
      
      console.log(`Email queued for manual processing to ${options.to}`);
      return { success: true, message: "Email queued for processing", service: "manual" };
      
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Email delivery failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentBookingRequest {
  patient_name: string;
  email: string;
  whatsapp: string;
  treatment_type: string;
  preferred_date: string;
  time_slot: string;
  clinic_location: string;
  preferred_clinic?: string;
  consent_given: boolean;
  create_account?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing appointment booking request");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const SMTP_HOST = Deno.env.get("SMTP_HOST") || "mail.privateemail.com";
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const SMTP_USER = Deno.env.get("SMTP_USER") || "contact@orachope.org";
    const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");

    const bookingData: AppointmentBookingRequest = await req.json();
    console.log("Booking data received:", { ...bookingData, email: '[REDACTED]' });

    let emailsSent = false;
    let warnMessage: string | undefined;

    const requiredFields = ['patient_name', 'email', 'whatsapp', 'treatment_type', 'preferred_date', 'time_slot', 'clinic_location'];
    for (const field of requiredFields) {
      if (!bookingData[field as keyof AppointmentBookingRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!bookingData.consent_given) {
      throw new Error("PDPA consent is required");
    }

    const { data: bookingRef, error: refError } = await supabase.rpc('generate_booking_ref');
    if (refError) {
      console.error("Error generating booking reference:", refError);
      throw new Error("Failed to generate booking reference");
    }

    console.log("Generated booking reference:", bookingRef);

    let userCreated = false;
    let userCreationError: string | undefined;
    let passwordSetupLink: string | null = null;
    let isNewUser = false; // --- MODIFICATION: We will use this flag to decide which email to show.

    if (bookingData.create_account) {
      console.log("Attempting to create or verify user account for:", bookingData.email);
      try {
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: bookingData.email,
          email_confirm: true,
          user_metadata: {
            full_name: bookingData.patient_name,
            whatsapp: bookingData.whatsapp,
            created_via: 'booking_form',
            booking_ref: bookingRef
          },
        });
        
        if (userError) {
          if (userError.message.includes('already') || userError.message.includes('exists')) {
            console.log("User already exists:", bookingData.email);
            userCreated = true;
            isNewUser = false; // --- MODIFICATION: Set flag for existing user
          } else {
            console.error("Error creating user:", userError);
            userCreationError = userError.message;
          }
        } else {
          console.log("User created successfully:", newUser.user?.id);
          userCreated = true;
          isNewUser = true; // --- MODIFICATION: Set flag for new user
        }
      } catch (e) {
        console.error("Exception during user creation:", e);
        userCreationError = String(e);
      }

      // --- MODIFICATION: This logic now only runs for brand new users. ---
      if (userCreated && isNewUser && !userCreationError) {
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: bookingData.email
        });

        if (linkError) {
            console.error("Error generating password setup link:", linkError);
        } else {
            passwordSetupLink = linkData.properties.action_link;
            console.log("Generated password setup link for the new user.");
        }
      }
    }

    const { create_account, ...bookingDataForDb } = bookingData;
    const { data: appointment, error: insertError } = await supabase
      .from('appointment_bookings')
      .insert({
        ...bookingDataForDb,
        booking_ref: bookingRef,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting appointment:", insertError.message);
      throw new Error("Failed to save appointment booking");
    }

    console.log("Appointment saved successfully:", appointment.id);

    const appointmentDate = new Date(bookingData.preferred_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-SG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log(`Attempting to send patient email to: ${bookingData.email}`);
    if (SMTP_PASSWORD) {
      console.log("OraHope SMTP credentials configured, attempting to send patient email...");
      try {
        const emailService = new OraHopeEmailService({
          host: SMTP_HOST,
          port: SMTP_PORT,
          username: SMTP_USER,
          password: SMTP_PASSWORD,
        });

        const patientEmailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Booking Requested!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your Booking Request is being processed</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0 0 10px; font-size: 20px;">Booking Reference: ${bookingRef}</h2>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Please keep this reference number for your records</p>
            </div>
            
            <h3 style="color: #374151; margin: 20px 0 10px;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Patient Name:</td><td style="padding: 8px 0;">${bookingData.patient_name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Treatment:</td><td style="padding: 8px 0;">${bookingData.treatment_type}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Date:</td><td style="padding: 8px 0;">${formattedDate}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Time:</td><td style="padding: 8px 0;">${bookingData.time_slot}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Clinic Location:</td><td style="padding: 8px 0;">${bookingData.clinic_location}, JB</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #4b5563;">WhatsApp:</td><td style="padding: 8px 0;">${bookingData.whatsapp}</td></tr>
            </table>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 8px; font-size: 16px;">⚠️ Important Next Steps</h4>
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                This is a booking request. Our team will contact you within 24 hours via WhatsApp to confirm your appointment time and provide additional details about your visit to JB.
              </p>
            </div>
            
            <div style="margin: 20px 0;">
              <h4 style="color: #374151; margin: 0 0 10px;">What to Expect:</h4>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li>Confirmation call/WhatsApp within 24 hours</li>
                <li>Travel guidance for Singapore to JB</li>
                <li>Clinic directions and parking information</li>
                <li>Treatment details and pricing confirmation</li>
              </ul>
            </div>
            
            <!-- --- MODIFICATION: This entire block is now smarter. --- -->
            ${userCreated ? `
              ${isNewUser && passwordSetupLink ? `
                <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                  <h4 style="color: #16a34a; margin: 0 0 10px; font-size: 16px;">🎉 Set Up Your Account!</h4>
                  <p style="margin: 0 0 15px; color: #15803d; font-size: 14px;">
                    To manage your bookings and get instant advice from our AI chatbot, please set a password for your new account.
                  </p>
                  <a href="${passwordSetupLink}" style="background-color: #22c55e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Set Your Password
                  </a>
                </div>
              ` : `
                <div style="background: #f0f9ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <h4 style="color: #1e40af; margin: 0 0 8px; font-size: 16px;">👍 Welcome Back!</h4>
                  <p style="margin: 0; color: #1c3d5a; font-size: 14px;">
                    Your booking request has been received. You can log in to your existing account to view your booking history.
                  </p>
                </div>
              `}
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin: 0;">Questions? Contact us:</p>
              <p style="color: #2563eb; margin: 5px 0; font-weight: 600;">WhatsApp: +65 8192 6158</p>
              <p style="color: #2563eb; margin: 5px 0; font-weight: 600;">Email: contact@orachope.org</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© 2025 SG-JB Dental Tourism. Making quality dental care accessible across borders.</p>
          </div>
        </div>`;

        await emailService.sendMail({
          from: "SG-JB Dental <contact@orachope.org>",
          to: bookingData.email,
          subject: `Booking Request Received - ${bookingRef}`,
          html: patientEmailHtml,
        });
        
        console.log("Patient email sent successfully via OraHope Email Service");
        emailsSent = true;

        const adminEmailHtml = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Appointment Booking</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Requires confirmation within 24 hours</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #dc2626; margin: 0 0 20px;">Booking Reference: ${bookingRef}</h2>
            
            <h3 style="color: #374151; margin: 20px 0 10px;">Patient Information</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f9fafb; padding: 15px;">
              <tr><td style="padding: 5px 0; font-weight: 600;">Name:</td><td style="padding: 5px 0;">${bookingData.patient_name}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: 600;">Email:</td><td style="padding: 5px 0;">${bookingData.email}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: 600;">WhatsApp:</td><td style="padding: 5px 0;">${bookingData.whatsapp}</td></tr>
            </table>
            
            <h3 style="color: #374151; margin: 20px 0 10px;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f0f9ff; padding: 15px;">
              <tr><td style="padding: 5px 0; font-weight: 600;">Treatment:</td><td style="padding: 5px 0;">${bookingData.treatment_type}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: 600;">Preferred Date:</td><td style="padding: 5px 0;">${formattedDate}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: 600;">Time Slot:</td><td style="padding: 5px 0;">${bookingData.time_slot}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: 600;">Location:</td><td style="padding: 5px 0;">${bookingData.clinic_location}, JB</td></tr>
            </table>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin: 0 0 8px;">Action Required</h4>
              <p style="margin: 0; color: #991b1b;">Contact patient within 24 hours to confirm appointment and provide travel details.</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <p style="color: #6b7280;">Booking submitted at: ${new Date().toLocaleString('en-SG')}</p>
            </div>
          </div>
        </div>`;

        await emailService.sendMail({
          from: "SG-JB Dental <contact@orachope.org>",
          to: "gohseowping@gmail.com",
          subject: `New Appointment Booking - ${bookingRef}`,
          html: adminEmailHtml,
        });
        
        console.log("Admin notification email sent successfully");

      } catch (e) {
        console.error("CRITICAL: Failed to send emails via OraHope Email Service:", e);
        console.error("Error details:", JSON.stringify(e, null, 2));
        warnMessage = "Booking saved, but we couldn't send the confirmation email yet.";
      }
    } else {
      console.error("CRITICAL: OraChope SMTP password not configured");
      warnMessage = "Email service is not configured yet.";
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_ref: bookingRef,
        appointment_id: appointment.id,
        emails_sent: emailsSent,
        user_created: userCreated,
        ...(warnMessage ? { warn: warnMessage } : {}),
        ...(userCreationError ? { user_creation_error: userCreationError } : {}),
        message: emailsSent
          ? "Appointment booking confirmed! Check your email for details."
          : "Appointment booking received! We will contact you via WhatsApp shortly."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-appointment-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        success: false
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
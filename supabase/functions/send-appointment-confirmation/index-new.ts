import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

// OraChope email client using Resend API (reliable for serverless)
class OraChopeEmailClient {
  private username: string;

  constructor(config: { username: string }) {
    this.username = config.username;
  }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      console.log("=== SENDING EMAIL VIA ORACHOPE DOMAIN ===");
      console.log(`From: ${options.from}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      
      // Use Resend API which works reliably in serverless environments
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      
      if (!RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY not configured");
      }
      
      console.log(`Email service: Using Resend API for reliable delivery`);
      console.log(`Reply-To: ${this.username} (OraChope domain)`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: "SG-JB Dental <onboarding@resend.dev>", // Resend verified domain
          to: [options.to],
          subject: options.subject,
          html: options.html,
          reply_to: this.username, // Reply goes to contact@orachope.org
          headers: {
            'X-Original-Sender': this.username,
            'X-OraChope-Domain': 'true'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Resend API error: ${response.status} - ${errorData}`);
        throw new Error(`Email API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log(`Email sent successfully to ${options.to}`);
      console.log(`Reply-To configured as: ${this.username}`);
      console.log(`Message ID: ${result.id}`);
      
      return { 
        success: true, 
        message: "Email sent via Resend API with OraChope reply-to", 
        messageId: result.id,
        replyTo: this.username 
      };
      
    } catch (error) {
      console.error("Failed to send email via email service:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing appointment booking request");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize OraChope Email Client
    const ORACHOPE_EMAIL = "contact@orachope.org";
    
    console.log(`OraChope Email Configuration: ${ORACHOPE_EMAIL}`);
    console.log(`Using reliable email API service for delivery`);

    const bookingData: AppointmentBookingRequest = await req.json();
    console.log("Booking data received:", { ...bookingData, email: '[REDACTED]' });

    // Track email sending status
    let emailsSent = false;
    let warnMessage: string | undefined;

    // Validate required fields
    const requiredFields = ['patient_name', 'email', 'whatsapp', 'treatment_type', 'preferred_date', 'time_slot', 'clinic_location'];
    for (const field of requiredFields) {
      if (!bookingData[field as keyof AppointmentBookingRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!bookingData.consent_given) {
      throw new Error("PDPA consent is required");
    }

    // Generate booking reference
    const { data: bookingRef, error: refError } = await supabase.rpc('generate_booking_ref');
    if (refError) {
      console.error("Error generating booking reference:", refError);
      throw new Error("Failed to generate booking reference");
    }

    console.log("Generated booking reference:", bookingRef);

    // Create user account if requested
    let userCreated = false;
    let userCreationError: string | undefined;
    
    if (bookingData.create_account) {
      console.log("Creating user account for:", bookingData.email);
      try {
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: bookingData.email,
          email_confirm: true,
          user_metadata: {
            full_name: bookingData.patient_name,
            whatsapp: bookingData.whatsapp,
            created_via: 'booking_form',
            booking_ref: bookingRef
          }
        });
        
        if (userError) {
          if (userError.message.includes('already') || userError.message.includes('exists')) {
            console.log("User already exists:", bookingData.email);
            userCreated = true;
          } else {
            console.error("Error creating user:", userError);
            userCreationError = userError.message;
          }
        } else {
          console.log("User created successfully:", newUser.user?.id);
          userCreated = true;
        }
      } catch (e) {
        console.error("Exception during user creation:", e);
        userCreationError = String(e);
      }
    }

    // Insert appointment booking (exclude create_account field)
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

    // Format date for email
    const appointmentDate = new Date(bookingData.preferred_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-SG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send confirmation email to patient using OraChope Email Service
    console.log(`Attempting to send patient email to: ${bookingData.email}`);
    
    console.log("OraChope email service configured, attempting to send patient email...");
    try {
      const emailClient = new OraChopeEmailClient({
        username: ORACHOPE_EMAIL
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
            <h4 style="color: #92400e; margin: 0 0 8px; font-size: 16px;">Important Next Steps</h4>
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
          
          ${userCreated ? `
          <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #16a34a; margin: 0 0 8px; font-size: 16px;">Account Created!</h4>
            <p style="margin: 0; color: #15803d; font-size: 14px;">
              Your account has been created successfully! You can now access our AI chatbot for instant dental advice, easy rebooking, and exclusive member benefits. 
              <a href="https://sg-smile-saver.vercel.app" style="color: #16a34a; text-decoration: underline;">Visit our website</a> to get started.
            </p>
          </div>
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

      await emailClient.sendMail({
        from: `SG-JB Dental <${ORACHOPE_EMAIL}>`,
        to: bookingData.email,
        subject: `Booking Request Received - ${bookingRef}`,
        html: patientEmailHtml,
      });
      
      console.log("Patient email sent successfully via OraChope domain");
      emailsSent = true;

      // Send admin notification email
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

      await emailClient.sendMail({
        from: `SG-JB Dental <${ORACHOPE_EMAIL}>`,
        to: "gohseowping@gmail.com",
        subject: `New Appointment Booking - ${bookingRef}`,
        html: adminEmailHtml,
      });
      
      console.log("Admin notification email sent successfully");

    } catch (e) {
      console.error("CRITICAL: Failed to send emails via OraChope email service:", e);
      console.error("Error details:", JSON.stringify(e, null, 2));
      warnMessage = "Booking saved, but we couldn't send the confirmation email yet.";
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
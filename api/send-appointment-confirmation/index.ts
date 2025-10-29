// --- THIS IS THE FINAL, CORRECTED CODE FOR YOUR BACKEND ---

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

class OraHopeEmailService {
  private username: string;

  constructor(config: { username: string }) {
    this.username = config.username;
  }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      console.log("=== SENDING EMAIL VIA HTTP API ===");
      const smtp2goApiKey = Deno.env.get("SMTP2GO_API_KEY");
      if (smtp2goApiKey) {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: smtp2goApiKey,
            to: [options.to],
            sender: this.username,
            subject: options.subject,
            html_body: options.html,
          }),
        });
        if (response.ok) {
          console.log(`Email sent successfully via SMTP2GO to ${options.to}`);
          return { success: true };
        }
      }
      throw new Error("SMTP2GO_API_KEY is not configured or failed.");
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
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
  consent_given: boolean;
  create_account?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing appointment booking request...");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const SMTP_USER = Deno.env.get("SMTP_USER")!;
    
    const bookingData: AppointmentBookingRequest = await req.json();

    const { data: bookingRef, error: refError } = await supabase.rpc('generate_booking_ref');
    if (refError) throw new Error("Failed to generate booking reference");

    console.log("Generated booking reference:", bookingRef);

    let userCreated = false;
    let userCreationError: string | undefined;
    let passwordSetupLink: string | null = null;
    let isNewUser = false;

    if (bookingData.create_account) {
      console.log("Attempting to create/verify user for:", bookingData.email);
      const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
        email: bookingData.email,
        email_confirm: true,
        user_metadata: {
          full_name: bookingData.patient_name,
          whatsapp: bookingData.whatsapp,
        },
      });

      if (userError) {
        if (userError.message.includes('already') || userError.message.includes('exists')) {
          console.log("User already exists.");
          userCreated = true;
          isNewUser = false;
        } else {
          userCreationError = userError.message;
          console.error("Error creating user:", userCreationError);
        }
      } else {
        console.log("User created successfully.");
        userCreated = true;
        isNewUser = true;
      }

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
      .insert({ ...bookingDataForDb, booking_ref: bookingRef, status: 'pending' })
      .select().single();

    if (insertError) throw new Error("Failed to save appointment booking");
    console.log("Appointment saved successfully.");

    const formattedDate = new Date(bookingData.preferred_date).toLocaleDateString('en-SG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const emailService = new OraHopeEmailService({ username: SMTP_USER });
    
    const patientEmailHtml = `...`; // Your beautiful HTML email template
    // --- THIS IS THE NEW "SMART" PART OF THE EMAIL TEMPLATE ---
    const accountSectionHtml = userCreated ? (
        (isNewUser && passwordSetupLink) ? `
          <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
            <h4 style="color: #16a34a; margin: 0 0 10px; font-size: 16px;">🎉 Set Up Your Account!</h4>
            <p style="margin: 0 0 15px; color: #15803d; font-size: 14px;">To manage your bookings and get instant advice, please set a password for your new account.</p>
            <a href="${passwordSetupLink}" style="background-color: #22c55e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Your Password</a>
          </div>
        ` : `
          <div style="background: #f0f9ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #1e40af; margin: 0 0 8px; font-size: 16px;">👍 Welcome Back!</h4>
            <p style="margin: 0; color: #1c3d5a; font-size: 14px;">Your booking request has been received. You can log in to your existing account to view your booking history.</p>
          </div>
        `
      ) : '';

    // Inject the smart account section into the full email body
    const finalPatientEmailHtml = patientEmailHtml.replace('<!-- ACCOUNT_SECTION -->', accountSectionHtml);
    // You will need to add <!-- ACCOUNT_SECTION --> placeholder in your main email HTML where you want this box to appear.

    await emailService.sendMail({
      from: `SG-JB Dental <${SMTP_USER}>`,
      to: bookingData.email,
      subject: `Booking Request Received - ${bookingRef}`,
      html: finalPatientEmailHtml,
    });
    console.log("Patient email sent successfully.");

    // The rest of your function (sending admin email, returning response) goes here...
    
    return new Response(JSON.stringify({ success: true, message: "Booking confirmed." }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("Error in handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";
import { Resend } from "npm:resend@2.0.0";

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
  preferred_clinic?: string; // Optional field for backwards compatibility
  consent_given: boolean;
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

    // Initialize Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
    const bookingData: AppointmentBookingRequest = await req.json();
    console.log("Booking data received:", { ...bookingData, email: '[REDACTED]' });

    // Track email sending status
    let emailsSent = false;
    let warnMessage: string | undefined;

    // Validate required fields
    const requiredFields = ['patient_name', 'email', 'whatsapp', 'treatment_type', 'preferred_date', 'time_slot', 'clinic_location'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
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

    // Insert appointment booking
    const { data: appointment, error: insertError } = await supabase
      .from('appointment_bookings')
      .insert({
        ...bookingData,
        booking_ref: bookingRef,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting appointment:", insertError);
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

    // Send confirmation email to patient
    console.log(`Attempting to send patient email to: ${bookingData.email}`);
    if (resend) {
      console.log("Resend client is initialized, attempting to send patient email...");
      try {
        const patientEmailResponse = await resend.emails.send({
          from: "SG-JB Dental <onboarding@resend.dev>",
          to: [bookingData.email],
          subject: `Appointment Booking Confirmation - ${bookingRef}`,
          html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Appointment Confirmed!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your dental appointment has been successfully booked</p>
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
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin: 0;">Questions? Contact us:</p>
              <p style="color: #2563eb; margin: 5px 0; font-weight: 600;">WhatsApp: +60 12-345-6789</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© 2025 SG-JB Dental Tourism. Making quality dental care accessible across borders.</p>
          </div>
        </div>
      `,
        });
        console.log("Patient email sent successfully:", patientEmailResponse.id);
        console.log("Patient email status:", patientEmailResponse);
        emailsSent = true;
      } catch (e) {
        console.error("CRITICAL: Failed to send patient email to", bookingData.email, "Error:", e);
        console.error("Error details:", JSON.stringify(e, null, 2));
        warnMessage = "Booking saved, but we couldn't send the confirmation email yet.";
      }
    } else {
      console.error("CRITICAL: Resend client is null. RESEND_API_KEY:", Deno.env.get("RESEND_API_KEY") ? "SET" : "NOT SET");
      warnMessage = "Email service is not configured yet.";
    }
    // Send notification email to admin (non-blocking)
    if (resend) {
      try {
        const adminEmailResponse = await resend.emails.send({
          from: "SG-JB Dental <onboarding@resend.dev>",
          to: ["Contact@oracchope.org"],
          subject: `New Appointment Booking - ${bookingRef}`,
          html: `
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
        </div>
      `,
        });
        console.log("Admin email sent:", adminEmailResponse.id);
      } catch (e) {
        console.error("Failed to send admin email:", e);
        if (!warnMessage) warnMessage = "Email notification to admin could not be sent.";
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_ref: bookingRef,
        appointment_id: appointment.id,
        emails_sent: emailsSent,
        ...(warnMessage ? { warn: warnMessage } : {}),
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
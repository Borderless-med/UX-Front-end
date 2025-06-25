
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OptOutConfirmationRequest {
  email: string;
  name: string;
  requestType: string;
  clinicName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, requestType, clinicName }: OptOutConfirmationRequest = await req.json();

    console.log("Processing opt-out confirmation for:", { email, name, requestType, clinicName });

    // Generate reference number for tracking
    const referenceNumber = `OPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Determine email subject and content based on request type
    let subject = "Request Confirmation - SG-JB Dental Directory";
    let htmlContent = "";

    if (requestType === "opt_out") {
      subject = "Opt-out Request Confirmation - SG-JB Dental Directory";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">Opt-out Request Received</h1>
            <p style="color: #6b7280; margin: 0;">Reference: <strong>${referenceNumber}</strong></p>
          </div>
          
          <p>Dear ${name},</p>
          
          <p>We have successfully received your request to remove ${clinicName ? `<strong>${clinicName}</strong>` : 'your clinic listing'} from the SG-JB Dental directory.</p>
          
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <h3 style="color: #047857; margin: 0 0 10px 0;">What happens next?</h3>
            <ul style="color: #065f46; margin: 0; padding-left: 20px;">
              <li>Your request will be reviewed within 2-3 business days</li>
              <li>We will verify your authorization to request this removal</li>
              <li>Once approved, the listing will be removed from all directory pages</li>
              <li>You will receive a final confirmation email when the removal is complete</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">PDPA Compliance</h3>
            <p style="color: #78350f; margin: 0;">This request is being processed in accordance with Malaysian Personal Data Protection Act (PDPA) requirements. You have the right to request removal of your personal and business data from our directory.</p>
          </div>
          
          <p>If you have any questions or need to provide additional verification, please reply to this email with your reference number.</p>
          
          <p>Best regards,<br>
          <strong>SG-JB Dental Directory Team</strong><br>
          Data Protection & Compliance</p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #9ca3af;">
            <p>This is an automated confirmation email. Please do not reply unless you need to provide additional information for your request.</p>
          </div>
        </div>
      `;
    } else {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">Directory Report Received</h1>
            <p style="color: #6b7280; margin: 0;">Reference: <strong>${referenceNumber}</strong></p>
          </div>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reporting an issue with the SG-JB Dental directory. We have received your ${requestType.replace('_', ' ')} report and will investigate it promptly.</p>
          
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <h3 style="color: #047857; margin: 0 0 10px 0;">What happens next?</h3>
            <ul style="color: #065f46; margin: 0; padding-left: 20px;">
              <li>Your report will be reviewed within 2-3 business days</li>
              <li>We will investigate the issue and take appropriate action</li>
              <li>You will receive an update email once the issue is resolved</li>
            </ul>
          </div>
          
          <p>If you need to provide additional information, please reply to this email with your reference number.</p>
          
          <p>Best regards,<br>
          <strong>SG-JB Dental Directory Team</strong></p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "SG-JB Dental <noreply@sgsmile.app>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      referenceNumber,
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-opt-out-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Email Service Class
class OraHopeEmailService {
  private username: string;

  constructor(config: { username: string }) {
    this.username = config.username;
  }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      console.log("=== SENDING EMAIL VIA HTTP API ===");
      const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
      console.log("SMTP2GO_API_KEY at runtime:", smtp2goApiKey ? "present" : "missing");
      
      const smtp2goPayload = {
        api_key: smtp2goApiKey,
        to: [options.to],
        sender: this.username,
        subject: options.subject,
        html_body: options.html,
      };
      
      console.log("SMTP2Go email payload:", JSON.stringify({ ...smtp2goPayload, api_key: "***" }, null, 2));
      
      if (smtp2goApiKey) {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smtp2goPayload),
        });
        const responseText = await response.text();
        console.log("SMTP2Go response:", response.status, responseText);
        
        if (response.ok) {
          console.log(`Email sent successfully via SMTP2GO to ${options.to}`);
          return { success: true };
        } else {
          console.error(`SMTP2Go email failed:`, response.status, responseText);
          throw new Error(`SMTP2GO failed: ${responseText}`);
        }
      } else {
        throw new Error("SMTP2GO_API_KEY not configured");
      }

    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }
}

// Interface for inquiry request
interface InquiryRequest {
  clinic_name: string;
  user_name: string;
  user_email?: string;
  user_whatsapp?: string;
  preferred_contact: 'email' | 'whatsapp' | 'either';
  inquiry_message: string;
  inquiry_id: string;
}

// Main Handler Function
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    console.log("Processing inquiry notification request...");
    
    const SMTP_USER = process.env.SMTP_USER || 'noreply@orachope.org';
    const emailService = new OraHopeEmailService({ username: SMTP_USER });
    
    const inquiryData: InquiryRequest = req.body;

    // Validate required fields
    const requiredFields = ['clinic_name', 'user_name', 'inquiry_message', 'preferred_contact', 'inquiry_id'];
    for (const field of requiredFields) {
      if (!inquiryData[field as keyof InquiryRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // At least one contact method must be provided
    if (!inquiryData.user_email && !inquiryData.user_whatsapp) {
      throw new Error('Either email or WhatsApp number is required');
    }

    // Send notification to OraChope.org admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .label { font-weight: bold; color: #4b5563; }
          .value { margin-left: 10px; color: #111827; }
          .message-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
          .contact-box { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 10px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">🔔 New SG Clinic Inquiry</h1>
        </div>
        <div class="content">
          <div class="section">
            <h2 style="margin-top: 0; color: #1f2937;">Inquiry Details</h2>
            <p><span class="label">Clinic:</span><span class="value">${inquiryData.clinic_name}</span></p>
            <p><span class="label">Inquiry ID:</span><span class="value">${inquiryData.inquiry_id}</span></p>
            <p><span class="label">Received:</span><span class="value">${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</span></p>
          </div>

          <div class="section">
            <h2 style="margin-top: 0; color: #1f2937;">User Information</h2>
            <p><span class="label">Name:</span><span class="value">${inquiryData.user_name}</span></p>
            ${inquiryData.user_email ? `<p><span class="label">Email:</span><span class="value">${inquiryData.user_email}</span></p>` : ''}
            ${inquiryData.user_whatsapp ? `<p><span class="label">WhatsApp:</span><span class="value">${inquiryData.user_whatsapp}</span></p>` : ''}
            <div class="contact-box">
              <p style="margin: 0;"><span class="label">Preferred Contact:</span> <span class="value">${inquiryData.preferred_contact.toUpperCase()}</span></p>
            </div>
          </div>

          <div class="section">
            <h2 style="margin-top: 0; color: #1f2937;">Inquiry Message</h2>
            <div class="message-box">
              ${inquiryData.inquiry_message.replace(/\n/g, '<br>')}
            </div>
          </div>

          ${inquiryData.user_whatsapp ? `
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://wa.me/${inquiryData.user_whatsapp.replace(/[^\d+]/g, '')}?text=Hi%20${encodeURIComponent(inquiryData.user_name)}%2C%20thank%20you%20for%20your%20inquiry%20about%20${encodeURIComponent(inquiryData.clinic_name)}." class="button">
                Reply via WhatsApp
              </a>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>OraChope.org - Singapore Clinic Inquiry System</p>
          <p>This is an automated notification from the SG clinic inquiry form</p>
        </div>
      </body>
      </html>
    `;

    await emailService.sendMail({
      from: SMTP_USER,
      to: 'contact@orachope.org',
      subject: `New SG Clinic Inquiry: ${inquiryData.clinic_name}`,
      html: adminEmailHtml,
    });

    console.log("Admin notification email sent successfully");

    // Send confirmation to user if email provided
    if (inquiryData.user_email) {
      const userEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
            .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">✅ Inquiry Received</h1>
          </div>
          <div class="content">
            <div class="section">
              <h2 style="margin-top: 0; color: #1f2937;">Hi ${inquiryData.user_name},</h2>
              <p>Thank you for contacting OraChope.org! We've received your inquiry about:</p>
              <div class="highlight">
                <h3 style="margin: 0; color: #1f2937;">${inquiryData.clinic_name}</h3>
              </div>
              <p><strong>Your message:</strong></p>
              <p style="font-style: italic; color: #4b5563;">"${inquiryData.inquiry_message}"</p>
            </div>

            <div class="section">
              <h3 style="margin-top: 0; color: #1f2937;">What happens next?</h3>
              <p>✅ Our team will review your inquiry within 24 hours</p>
              <p>✅ We'll contact you via ${inquiryData.preferred_contact === 'email' ? 'email' : inquiryData.preferred_contact === 'whatsapp' ? 'WhatsApp' : 'your preferred method'}</p>
              <p>✅ We'll help connect you with ${inquiryData.clinic_name}</p>
            </div>

            ${inquiryData.user_whatsapp ? `
              <div style="text-align: center; margin: 20px 0;">
                <p>Need urgent assistance? Message us directly:</p>
                <a href="https://wa.me/6581926158?text=Hi%20OraChope%2C%20I%20submitted%20an%20inquiry%20about%20${encodeURIComponent(inquiryData.clinic_name)}" class="button">
                  WhatsApp OraChope.org
                </a>
              </div>
            ` : ''}

            <div class="section" style="background: #fef3c7; border: 1px solid #fbbf24;">
              <p style="margin: 0;"><strong>📌 Inquiry Reference:</strong> ${inquiryData.inquiry_id}</p>
            </div>
          </div>
          <div class="footer">
            <p><strong>OraChope.org</strong> - Your Trusted Singapore Dental Guide</p>
            <p>WhatsApp: +65 8192 6158 | Email: contact@orachope.org</p>
            <p style="color: #9ca3af; font-size: 11px; margin-top: 15px;">
              This is an automated confirmation email. Please do not reply directly to this email.
            </p>
          </div>
        </body>
        </html>
      `;

      await emailService.sendMail({
        from: SMTP_USER,
        to: inquiryData.user_email,
        subject: `Inquiry Received - ${inquiryData.clinic_name}`,
        html: userEmailHtml,
      });

      console.log("User confirmation email sent successfully");
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry notifications sent successfully',
    });

  } catch (error) {
    console.error('Error sending inquiry notifications:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notifications',
    });
  }
}

// API route to send partner signup confirmation and admin notification emails
// Uses SMTP2GO, mimics booking confirmation logic

import type { VercelRequest, VercelResponse } from '@vercel/node';

class OraChopeEmailService {
  private username: string;
  constructor(config: { username: string }) {
    this.username = config.username;
  }
  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
      const smtp2goPayload = {
        api_key: smtp2goApiKey,
        to: [options.to],
        sender: this.username,
        subject: options.subject,
        html_body: options.html,
      };
      if (smtp2goApiKey) {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smtp2goPayload),
        });
        if (response.ok) return { success: true };
      }
      return { success: false };
    } catch (error) {
      throw error;
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type, x-environment");
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
    const SMTP_USER = process.env.SMTP_USER!;
    const emailService = new OraChopeEmailService({ username: SMTP_USER });
    const {
      clinicName,
      contactName,
      email,
      phone,
      city,
      address,
      mdcRegistrationNumber,
      clinicLicense,
      services,
      sentimentAnalysisInterest,
      marketAnalysisInterest,
      otherAiFeatures
    } = req.body;
    // Confirmation email to clinic owner
    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#333;">
        <div style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:20px;text-align:center;">
          <h2 style="color:#fff;margin:0;">Welcome to OraChope.org!</h2>
        </div>
        <div style="padding:24px;background:#f9fafb;">
          <p style="margin:0 0 12px;">Dear <strong>${contactName}</strong>,</p>
          <p style="margin:0 0 16px;">Thank you for registering <strong>${clinicName}</strong> with us.</p>
          
          <div style="background:#dbeafe;border-left:4px solid #2563eb;padding:12px;margin:16px 0;">
            <p style="margin:0;font-weight:600;color:#1e40af;">What's Next?</p>
            <p style="margin:6px 0 0;font-size:14px;color:#1e3a8a;">
              • We'll verify your credentials within 24 hours<br/>
              • Contact you at <strong>${email}</strong> or <strong>${phone}</strong><br/>
              • Send platform access and onboarding details
            </p>
          </div>
          
          <p style="margin:16px 0 0;font-size:13px;color:#6b7280;">
            Questions? Contact us at <a href="mailto:contact@orachope.org" style="color:#2563eb;">contact@orachope.org</a>
          </p>
          
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:12px;">
            OraChope.org • Your Trusted Dental Partner Network
          </p>
        </div>
      </div>
    `;
    await emailService.sendMail({
      from: `OraChope.org <${SMTP_USER}>`,
      to: email,
      subject: `Partnership Signup Confirmation - ${clinicName}`,
      html: ownerHtml,
    });
    // Notification email to admin
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#333;">
        <h2 style="color:#1e3a8a;">New Partner Signup</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 0;font-weight:600;">Clinic Name</td><td>${clinicName}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Contact Name</td><td>${contactName}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Email</td><td>${email}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Phone</td><td>${phone}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">City</td><td>${city}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Address</td><td style="font-size:13px;">${address || 'Not provided'}</td></tr>
          <tr style="background:#eff6ff;"><td style="padding:8px 4px;font-weight:600;">Clinic License (Form 7)</td><td style="font-family:monospace;font-weight:bold;color:#1e40af;">${clinicLicense}</td></tr>
          <tr style="background:#eff6ff;"><td style="padding:8px 4px;font-weight:600;">MDC Registration</td><td style="font-family:monospace;font-weight:bold;color:#1e40af;">${mdcRegistrationNumber}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Services</td><td>${services}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">AI Features</td><td style="font-size:13px;">
            ${sentimentAnalysisInterest ? '✓ Sentiment Analysis<br/>' : ''}${marketAnalysisInterest ? '✓ Market Analysis<br/>' : ''}${otherAiFeatures ? `✓ Other: ${otherAiFeatures}` : ''}${!sentimentAnalysisInterest && !marketAnalysisInterest && !otherAiFeatures ? 'None selected' : ''}
          </td></tr>
        </table>
        <div style="margin:20px 0;padding:12px;background:#fef3c7;border-left:4px solid #f59e0b;">
          <p style="margin:0;font-weight:600;color:#92400e;">Action Required:</p>
          <p style="margin:4px 0 0;font-size:13px;color:#78350f;">1. Verify MDC number at <a href="https://www.mdc.org.my/" target="_blank">mdc.org.my</a></p>
          <p style="margin:0;font-size:13px;color:#78350f;">2. Confirm Form 7 clinic license validity</p>
          <p style="margin:0;font-size:13px;color:#78350f;">3. Contact partner within 24 hours</p>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">Automated notification • Do not forward externally.</p>
      </div>
    `;
    await emailService.sendMail({
      from: `OraChope.org <${SMTP_USER}>`,
      to: 'contact@orachope.org',
      subject: `ADMIN: New Partner Signup - ${clinicName}`,
      html: adminHtml,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error?.message || 'Email send failed' });
  }
}

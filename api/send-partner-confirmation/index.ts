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
      registrationNumber,
      services,
      experience,
      whyJoin
    } = req.body;
    // Confirmation email to clinic owner
    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#333;">
        <h2 style="color:#2563eb;">Welcome to OraChope.org!</h2>
        <p>Dear ${contactName},</p>
        <p>Your clinic <strong>${clinicName}</strong> has successfully signed up as a partner.</p>
        <p>We will review your application and contact you soon.</p>
        <p>Thank you for joining our network!</p>
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
          <tr><td style="padding:4px 0;font-weight:600;">Registration Number</td><td>${registrationNumber}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Services</td><td>${services}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Experience</td><td>${experience}</td></tr>
          <tr><td style="padding:4px 0;font-weight:600;">Why Join</td><td>${whyJoin}</td></tr>
        </table>
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

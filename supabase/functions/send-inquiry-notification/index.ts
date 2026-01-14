import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InquiryNotification {
  clinic_name: string;
  user_name: string;
  user_email?: string;
  user_whatsapp?: string;
  preferred_contact: string;
  inquiry_message: string;
  inquiry_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      clinic_name,
      user_name,
      user_email,
      user_whatsapp,
      preferred_contact,
      inquiry_message,
      inquiry_id
    }: InquiryNotification = await req.json();

    const SMTP2GO_API_KEY = Deno.env.get('SMTP2GO_API_KEY');
    if (!SMTP2GO_API_KEY) {
      throw new Error('SMTP2GO_API_KEY not configured');
    }

    const timestamp = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
    const contactInfo = user_whatsapp || user_email || 'No contact provided';
    const contactType = user_whatsapp ? 'WhatsApp' : 'Email';
    
    // WhatsApp link for quick action
    const whatsappLink = user_whatsapp 
      ? `https://wa.me/${user_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${user_name}, thank you for your inquiry about ${clinic_name}. I'm from OraChope.org.`)}`
      : null;

    // Build notification email to admin
    const adminEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">🔔 New Clinic Inquiry</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="color: #495057; margin-top: 0;">📍 Clinic Information</h3>
            <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${clinic_name}</p>
          </div>

          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="color: #495057; margin-top: 0;">👤 Contact Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${user_name}</p>
            ${user_email ? `<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${user_email}">${user_email}</a></p>` : ''}
            ${user_whatsapp ? `<p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${user_whatsapp}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Preferred Contact:</strong> <span style="background: #e3f2fd; padding: 3px 8px; border-radius: 4px; color: #1976d2;">${preferred_contact}</span></p>
          </div>

          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <h3 style="color: #495057; margin-top: 0;">💬 Inquiry Message</h3>
            <p style="background: #f8f9fa; padding: 12px; border-left: 4px solid #667eea; margin: 0;">${inquiry_message}</p>
          </div>

          ${whatsappLink ? `
          <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; border: 2px solid #4caf50; margin-bottom: 15px;">
            <h3 style="color: #2e7d32; margin-top: 0;">⚡ Quick Actions</h3>
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
              📱 Message on WhatsApp
            </a>
          </div>
          ` : ''}

          <div style="background: white; padding: 15px; border-radius: 6px;">
            <p style="margin: 5px 0; font-size: 14px; color: #6c757d;">
              ⏰ <strong>Submitted:</strong> ${timestamp} SGT<br>
              ${inquiry_id ? `🆔 <strong>Inquiry ID:</strong> ${inquiry_id}` : ''}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send notification to admin
    const adminResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: SMTP2GO_API_KEY,
        to: ['contact@orachope.org'],
        sender: 'noreply@orachope.org',
        subject: `🚨 New ${preferred_contact === 'whatsapp' ? 'WhatsApp' : 'Email'} Inquiry: ${clinic_name}`,
        html_body: adminEmailBody,
      }),
    });

    const adminResult = await adminResponse.json();
    console.log('Admin notification result:', adminResult);

    // Send confirmation to user if email provided
    if (user_email) {
      const userEmailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Thank You for Your Inquiry!</h2>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <p style="font-size: 16px; line-height: 1.6;">Hi ${user_name},</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for your interest in <strong>${clinic_name}</strong>! We've received your inquiry and will get back to you within 24 hours.
            </p>

            ${user_whatsapp && preferred_contact !== 'email' ? `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #2e7d32;">Prefer WhatsApp?</p>
              <p style="margin: 0 0 10px 0;">You can also message us directly:</p>
              <a href="https://wa.me/6581926158?text=${encodeURIComponent(`Hi OraChope.org, I submitted an inquiry about ${clinic_name}`)}" 
                 style="display: inline-block; background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                💬 Message on WhatsApp
              </a>
            </div>
            ` : ''}

            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold;">Your inquiry:</p>
              <p style="margin: 0; color: #495057;">"${inquiry_message}"</p>
            </div>

            <p style="font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>OraChope.org Team</strong>
            </p>

            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #6c757d; text-align: center;">
              This is an automated confirmation. We'll reply personally soon.
            </p>
          </div>
        </div>
      `;

      const userResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: SMTP2GO_API_KEY,
          to: [user_email],
          sender: 'contact@orachope.org',
          subject: `We received your inquiry about ${clinic_name}`,
          html_body: userEmailBody,
        }),
      });

      const userResult = await userResponse.json();
      console.log('User confirmation result:', userResult);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending notifications:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

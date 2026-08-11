// ============================================
// URGENT NUDGE CRON JOB
// Runs every 15 minutes
// Sends urgent reminder 30 minutes before expiry
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';
import crypto from 'crypto';
import { formatSingaporeDate, formatSingaporeTime } from '../../utils/sg-time.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret
  // Note: Using X-Cron-Secret instead of Authorization because Vercel strips Authorization headers
  const cronSecret = req.headers['x-cron-secret'] || req.headers['X-Cron-Secret'];
  const expectedSecret = process.env.CRON_SECRET;
  
  if (cronSecret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('=== URGENT NUDGE CRON JOB STARTED ===');
    
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate time window: 30-45 minutes from now.
    // This guarantees clinics have at least 30 minutes to respond.
    const now = new Date();
    const windowStart = new Date(now.getTime() + 30 * 60 * 1000); // 30 min from now
    const windowEnd = new Date(now.getTime() + 45 * 60 * 1000);   // 45 min from now

    // Find bookings expiring soon (haven't been nudged yet)
    const { data: expiringBookings, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select('*')
      .eq('status', 'pending')
      .gte('expires_at', windowStart.toISOString())
      .lte('expires_at', windowEnd.toISOString())
      .is('clinic_responded_at', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${expiringBookings?.length || 0} bookings needing urgent nudge`);

    if (!expiringBookings || expiringBookings.length === 0) {
      return res.status(200).json({
        success: true,
        nudged: 0,
        message: 'No bookings need nudging',
      });
    }

    // Check which bookings haven't been nudged yet
    const bookingsToNudge = expiringBookings.filter((booking) => {
      const notifications = booking.notifications_sent || [];
      return !notifications.some((n: any) => n.type === 'urgent_clinic_nudge');
    });

    console.log(`${bookingsToNudge.length} bookings not yet nudged`);

    if (bookingsToNudge.length === 0) {
      return res.status(200).json({
        success: true,
        nudged: 0,
        message: 'All expiring bookings already nudged',
      });
    }

    // Initialize notification service
    const notificationService = new NotificationService({
      supabaseUrl,
      supabaseKey,
      whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
      smtpUser: process.env.SMTP_USER!,
    });

    const results = [];

    // Process each booking
    for (const booking of bookingsToNudge) {
      try {
        // Look up clinic by name in BOTH tables (JB and SG)
        let clinic: any = null;
        
        if (booking.clinic_id) {
          // Try to get clinic by ID first
          const { data: jbClinic } = await supabase
            .from('clinics_data')
            .select('id, name, address, contact_email, whatsapp_number')
            .eq('id', booking.clinic_id)
            .single();
          
          const { data: sgClinic } = await supabase
            .from('sg_clinics')
            .select('id, name, address, contact_email, whatsapp_number')
            .eq('id', booking.clinic_id)
            .single();
          
          clinic = jbClinic || sgClinic;
        }
        
        // If no clinic_id or not found, search by name
        if (!clinic && booking.clinic_location) {
          const { data: jbClinics } = await supabase
            .from('clinics_data')
            .select('id, name, address, contact_email, whatsapp_number')
            .ilike('name', booking.clinic_location)
            .limit(1);
          
          const { data: sgClinics } = await supabase
            .from('sg_clinics')
            .select('id, name, address, contact_email, whatsapp_number')
            .ilike('name', booking.clinic_location)
            .limit(1);
          
          clinic = jbClinics?.[0] || sgClinics?.[0];
        }
        
        if (!clinic || !clinic.contact_email) {
          console.log(`⚠️ No clinic contact found for booking ${booking.booking_ref}, skipping`);
          continue;
        }
        
        console.log(`📧 Sending nudge to clinic: ${clinic.name} (${clinic.contact_email})`);
        
        // Generate HMAC token for response URL
        const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
        const token = crypto
          .createHmac('sha256', HMAC_SECRET)
          .update(`${booking.booking_ref}|${clinic.id || booking.clinic_location}`)
          .digest('hex')
          .slice(0, 32);

        const baseUrl = 'https://orachope.org/api/clinic/respond';
        const responseUrl = `${baseUrl}/${booking.booking_ref}?token=${token}`;

        // Send urgent nudge to clinic
        const notificationResults = await notificationService.send(
          'urgent_clinic_nudge',
          {
            name: clinic.name || booking.clinic_location,
            email: clinic.contact_email,
            whatsapp: clinic.whatsapp_number,
          },
          {
            clinic_name: clinic.name || booking.clinic_location,
            booking_ref: booking.booking_ref,
            expires_at: formatSingaporeTime(booking.expires_at),
            patient_name: booking.patient_name,
            treatment_type: booking.treatment_type,
            formatted_date: formatSingaporeDate(booking.preferred_date),
            time_slot: booking.time_slot,
            response_url: responseUrl,
          },
          ['email', 'whatsapp']
        );

        // Log notification
        await notificationService.logNotification(
          booking.booking_ref,
          'urgent_clinic_nudge',
          notificationResults
        );

        console.log(`Sent urgent nudge for booking ${booking.booking_ref}`);
        
        // Send admin notification
        try {
          const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
          const brevoApiKey = process.env.BREVO_API_KEY;
          const adminEmail = 'contact@orachope.org';
          const fromUser = process.env.SMTP_USER || 'noreply@orachope.org';

          const expiryTime = new Date(booking.expires_at);
          const minutesRemaining = Math.round((expiryTime.getTime() - Date.now()) / (1000 * 60));

          const adminHtml = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.5;color:#333">
              <h2 style="color:#ea580c;margin:0 0 20px">⚠️ Urgent: Booking Expiring Soon</h2>
              <div style="background:#fff7ed;border-left:4px solid #ea580c;padding:16px;margin:16px 0">
                <p style="margin:0 0 8px;font-size:18px;font-weight:600">Reference: ${booking.booking_ref}</p>
                <p style="margin:0;font-size:14px;color:#9a3412">Expires in ~${minutesRemaining} minutes</p>
              </div>
              <h3 style="color:#374151;margin:20px 0 10px;font-size:16px">Booking Details</h3>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Patient:</td><td style="padding:8px 0">${booking.patient_name}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Email:</td><td style="padding:8px 0">${booking.email}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">WhatsApp:</td><td style="padding:8px 0">${booking.whatsapp}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Clinic:</td><td style="padding:8px 0">${clinic.name || booking.clinic_location}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Treatment:</td><td style="padding:8px 0">${booking.treatment_type}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Date:</td><td style="padding:8px 0">${formatSingaporeDate(booking.preferred_date)}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Time:</td><td style="padding:8px 0">${booking.time_slot}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Created:</td><td style="padding:8px 0">${new Date(booking.created_at).toLocaleString('en-SG')}</td></tr>
                <tr><td style="padding:8px 0;font-weight:600;color:#4b5563">Expires:</td><td style="padding:8px 0">${formatSingaporeTime(booking.expires_at)}</td></tr>
              </table>
              <div style="background:#fff7ed;border:1px solid #ea580c;padding:12px;margin:16px 0;border-radius:6px">
                <p style="margin:0;font-size:13px;color:#9a3412">⚠️ <strong>Action:</strong> Urgent nudge sent to clinic</p>
              </div>
              <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">Automated notification from OraChope booking system</p>
            </div>
          `;

          if (smtp2goApiKey) {
            try {
              const smtp2goResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  api_key: smtp2goApiKey,
                  to: [adminEmail],
                  sender: fromUser,
                  subject: `⚠️ ADMIN: Booking Expiring Soon - ${booking.booking_ref}`,
                  html_body: adminHtml,
                }),
              });

              const smtp2goData = await smtp2goResponse.json();
              if (smtp2goResponse.ok && smtp2goData.data?.succeeded === 1) {
                console.log('✅ Admin notification sent via SMTP2GO for urgent nudge');
              } else {
                throw new Error('SMTP2GO failed');
              }
            } catch (smtp2goError) {
              if (brevoApiKey && brevoApiKey !== 'your-brevo-api-key') {
                const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'api-key': brevoApiKey,
                  },
                  body: JSON.stringify({
                    sender: { email: fromUser },
                    to: [{ email: adminEmail }],
                    subject: `⚠️ ADMIN: Booking Expiring Soon - ${booking.booking_ref}`,
                    htmlContent: adminHtml,
                  }),
                });

                if (brevoResponse.ok) {
                  console.log('✅ Admin notification sent via Brevo (fallback) for urgent nudge');
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to send admin notification for urgent nudge:', error);
        }
        
        results.push({
          booking_ref: booking.booking_ref,
          success: true,
          notifications: notificationResults,
        });

      } catch (error) {
        console.error(`Error nudging booking ${booking.booking_ref}:`, error);
        results.push({
          booking_ref: booking.booking_ref,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('=== URGENT NUDGE CRON JOB COMPLETED ===');

    return res.status(200).json({
      success: true,
      nudged: results.length,
      results,
    });

  } catch (error) {
    console.error('URGENT NUDGE CRON JOB FAILED:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

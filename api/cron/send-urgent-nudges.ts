// ============================================
// URGENT NUDGE CRON JOB
// Runs every 15 minutes
// Sends urgent reminder 30 minutes before expiry
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service.js';
import crypto from 'crypto';

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

    // Calculate time window: 25-35 minutes from now (targets 30 min before expiry)
    const now = new Date();
    const windowStart = new Date(now.getTime() + 25 * 60 * 1000); // 25 min from now
    const windowEnd = new Date(now.getTime() + 35 * 60 * 1000);   // 35 min from now

    // Find bookings expiring soon (haven't been nudged yet)
    const { data: expiringBookings, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select(`
        *,
        clinics_data (
          id,
          name,
          address,
          city,
          state,
          postcode,
          country,
          contact_email,
          whatsapp_number
        )
      `)
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
        const clinic = booking.clinics_data || {};
        
        // Generate HMAC tokens for response URLs
        const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
        const token = crypto
          .createHmac('sha256', HMAC_SECRET)
          .update(`${booking.booking_ref}|${clinic.id || booking.clinic_location}`)
          .digest('hex')
          .slice(0, 32);

        const baseUrl = 'https://orachope.org/clinic/respond';
        const confirmUrl = `${baseUrl}/${booking.booking_ref}/confirm?token=${token}`;
        const rejectUrl = `${baseUrl}/${booking.booking_ref}/reject?token=${token}`;
        const alternativesUrl = `${baseUrl}/${booking.booking_ref}/alternatives?token=${token}`;

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
            expires_at: new Date(booking.expires_at).toLocaleTimeString('en-SG', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            patient_name: booking.patient_name,
            treatment_type: booking.treatment_type,
            formatted_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time_slot: booking.time_slot,
            confirm_url: confirmUrl,
            reject_url: rejectUrl,
            alternatives_url: alternativesUrl,
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

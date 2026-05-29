// ============================================
// AUTO-EXPIRY CRON JOB
// Runs every 15 minutes to expire old pending bookings
// Updates status and notifies patients
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret (security)
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  
  if (authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('=== AUTO-EXPIRY CRON JOB STARTED ===');
    
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find expired bookings
    const { data: expiredBookings, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select(`
        *,
        clinics_data (
          name,
          address,
          city,
          state,
          postcode,
          country
        )
      `)
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString())
      .is('clinic_responded_at', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${expiredBookings?.length || 0} expired bookings`);

    if (!expiredBookings || expiredBookings.length === 0) {
      return res.status(200).json({
        success: true,
        expired: 0,
        message: 'No bookings to expire',
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

    // Process each expired booking
    for (const booking of expiredBookings) {
      try {
        // Update status to expired
        const { error: updateError } = await supabase
          .from('appointment_bookings')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('booking_ref', booking.booking_ref);

        if (updateError) {
          console.error(`Failed to update booking ${booking.booking_ref}:`, updateError);
          results.push({
            booking_ref: booking.booking_ref,
            success: false,
            error: updateError.message,
          });
          continue;
        }

        // Send expiry notification to patient
        const clinic = booking.clinics_data || {};
        const notificationResults = await notificationService.send(
          'booking_expired',
          {
            name: booking.patient_name,
            email: booking.email,
            whatsapp: booking.whatsapp,
          },
          {
            booking_ref: booking.booking_ref,
            patient_name: booking.patient_name,
            clinic_name: clinic.name || booking.clinic_location,
            clinic_address: clinic.address || '',
            clinic_city: clinic.city || '',
            clinic_state: clinic.state || '',
            clinic_postcode: clinic.postcode || '',
            clinic_country: clinic.country || 'Malaysia',
            treatment_type: booking.treatment_type,
            formatted_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
          ['email', 'whatsapp']
        );

        // Log notification
        await notificationService.logNotification(
          booking.booking_ref,
          'booking_expired',
          notificationResults
        );

        console.log(`Expired booking ${booking.booking_ref} and notified patient`);
        
        results.push({
          booking_ref: booking.booking_ref,
          success: true,
          notifications: notificationResults,
        });

      } catch (error) {
        console.error(`Error processing booking ${booking.booking_ref}:`, error);
        results.push({
          booking_ref: booking.booking_ref,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('=== AUTO-EXPIRY CRON JOB COMPLETED ===');

    return res.status(200).json({
      success: true,
      expired: results.length,
      results,
    });

  } catch (error) {
    console.error('AUTO-EXPIRY CRON JOB FAILED:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

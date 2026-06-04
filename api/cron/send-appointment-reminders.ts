// ============================================
// 24-HOUR REMINDER CRON JOB
// Runs every hour (top of the hour)
// Sends reminders exactly 24 hours before appointment
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service.js';

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
    console.log('=== 24-HOUR REMINDER CRON JOB STARTED ===');
    
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate target time: 24 hours from now (±1 hour window)
    const now = new Date();
    const targetStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hours from now
    const targetEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);   // 25 hours from now

    // Find confirmed bookings with appointments tomorrow
    const { data: upcomingBookings, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select('*')
      .eq('status', 'confirmed')
      .eq('reminder_24h_sent', false)
      .gte('preferred_date', targetStart.toISOString().split('T')[0])
      .lte('preferred_date', targetEnd.toISOString().split('T')[0]);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${upcomingBookings?.length || 0} bookings needing reminders`);

    if (!upcomingBookings || upcomingBookings.length === 0) {
      return res.status(200).json({
        success: true,
        reminded: 0,
        message: 'No bookings need reminders',
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
    for (const booking of upcomingBookings) {
      try {
        // Fetch clinic details separately (database only has: name, address, township)
        const { data: clinic } = await supabase
          .from('clinics_data')
          .select('name, address, township')
          .eq('id', booking.clinic_id)
          .single();
        
        const clinicDetails = clinic || {};
        
        // Generate URLs
        const clinicSlug = (clinicDetails.name || booking.clinic_location)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        const clinicCardUrl = `https://www.orachope.org/clinic/${clinicSlug}`;
        const travelGuideUrl = 'https://www.orachope.org/travel-guide';
        const googleMapsUrl = clinicDetails.address 
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicDetails.address)}`
          : clinicCardUrl;

        // Send reminder (both WhatsApp AND Email for reliability)
        const notificationResults = await notificationService.send(
          'appointment_reminder_24h',
          {
            name: booking.patient_name,
            email: booking.email,
            whatsapp: booking.whatsapp,
          },
          {
            patient_name: booking.patient_name,
            booking_ref: booking.booking_ref,
            clinic_name: clinicDetails.name || booking.clinic_location,
            clinic_address: clinicDetails.address || '',
            clinic_city: clinicDetails.township || 'Johor Bahru',
            clinic_state: 'Johor',
            clinic_postcode: '',
            clinic_country: 'Malaysia',
            formatted_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time_slot: booking.time_slot,
            travel_guide_url: travelGuideUrl,
            clinic_card_url: clinicCardUrl,
            google_maps_url: googleMapsUrl,
          },
          ['email', 'whatsapp'] // Send BOTH for critical reminder
        );

        // Update reminder flag
        await supabase
          .from('appointment_bookings')
          .update({
            reminder_24h_sent: true,
            updated_at: new Date().toISOString(),
          })
          .eq('booking_ref', booking.booking_ref);

        // Log notification
        await notificationService.logNotification(
          booking.booking_ref,
          'appointment_reminder_24h',
          notificationResults
        );

        console.log(`Sent 24h reminder for booking ${booking.booking_ref}`);
        
        results.push({
          booking_ref: booking.booking_ref,
          success: true,
          notifications: notificationResults,
        });

      } catch (error) {
        console.error(`Error reminding booking ${booking.booking_ref}:`, error);
        results.push({
          booking_ref: booking.booking_ref,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('=== 24-HOUR REMINDER CRON JOB COMPLETED ===');

    return res.status(200).json({
      success: true,
      reminded: results.length,
      results,
    });

  } catch (error) {
    console.error('24-HOUR REMINDER CRON JOB FAILED:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

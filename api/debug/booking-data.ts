// Temporary diagnostic endpoint to inspect booking data
// URL: /api/debug/booking-data?ref=APT-2026-000028
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { ref } = req.query;

  if (!ref) {
    return res.status(400).json({ error: 'Missing ref parameter' });
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch booking
  const { data: booking, error: fetchError } = await supabase
    .from('appointment_bookings')
    .select('*')
    .eq('booking_ref', ref)
    .single();

  if (fetchError || !booking) {
    return res.status(404).json({ 
      error: 'Booking not found', 
      ref,
      fetchError: fetchError?.message 
    });
  }

  // Parse admin_notes safely
  let parsedNotes = null;
  let parseError = null;
  try {
    parsedNotes = typeof booking.admin_notes === 'string' 
      ? JSON.parse(booking.admin_notes) 
      : booking.admin_notes;
  } catch (e) {
    parseError = e instanceof Error ? e.message : 'Unknown parse error';
  }

  // Extract alternatives
  const alternatives = parsedNotes?.alternatives_offered || [];

  return res.status(200).json({
    booking_ref: booking.booking_ref,
    status: booking.status,
    patient_name: booking.patient_name,
    clinic_id: booking.clinic_id,
    clinic_location: booking.clinic_location,
    preferred_date: booking.preferred_date,
    time_slot: booking.time_slot,
    created_at: booking.created_at,
    updated_at: booking.updated_at,
    clinic_responded_at: booking.clinic_responded_at,
    confirmed_at: booking.confirmed_at,
    expires_at: booking.expires_at,
    admin_notes: {
      raw: booking.admin_notes,
      type: typeof booking.admin_notes,
      parsed: parsedNotes,
      parse_error: parseError,
      alternatives_count: alternatives.length,
      alternatives: alternatives,
    },
    diagnostics: {
      has_clinic_id: !!booking.clinic_id,
      status_allows_update: ['pending', 'alternatives_offered'].includes(booking.status),
      alternatives_valid: alternatives.every((alt: any) => alt?.date && alt?.time),
    }
  });
}

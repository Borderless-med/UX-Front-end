import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type DashboardSummary = {
  totalRequests: number;
  pendingCount: number;
  confirmedCount: number;
  expiredCount: number;
  rejectedCount: number;
  confirmedRate: number;
  expiredRate: number;
  rejectedRate: number;
  averageResponseMinutes: number | null;
};

type ClinicSummary = DashboardSummary & {
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  averageResponseMinutes: number | null;
};

type PendingBooking = {
  bookingRef: string;
  patientName: string;
  treatmentType: string;
  preferredDate: string;
  timeSlot: string;
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  expiresAt: string | null;
  minutesRemaining: number | null;
};

type RejectionReasonSummary = {
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  reason: string;
  count: number;
};

type BookingRow = {
  booking_ref: string | null;
  patient_name: string;
  treatment_type: string;
  preferred_date: string;
  time_slot: string;
  clinic_id: number | null;
  clinic_location: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
  clinic_responded_at: string | null;
  rejection_reason: string | null;
};

const roundRate = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

const toMinutes = (startAt: string, endAt: string) => {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  return Math.round((end - start) / 60000);
};

const computeSummary = (bookings: BookingRow[]): DashboardSummary => {
  const totalRequests = bookings.length;
  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length;
  const confirmedCount = bookings.filter((booking) => booking.status === 'confirmed').length;
  const expiredCount = bookings.filter((booking) => booking.status === 'expired').length;
  const rejectedCount = bookings.filter((booking) => booking.status === 'rejected').length;
  const responseMinutes = bookings
    .filter((booking) => booking.clinic_responded_at)
    .map((booking) => toMinutes(booking.created_at, booking.clinic_responded_at!));

  return {
    totalRequests,
    pendingCount,
    confirmedCount,
    expiredCount,
    rejectedCount,
    confirmedRate: roundRate(confirmedCount, totalRequests),
    expiredRate: roundRate(expiredCount, totalRequests),
    rejectedRate: roundRate(rejectedCount, totalRequests),
    averageResponseMinutes: responseMinutes.length
      ? Math.round(responseMinutes.reduce((total, value) => total + value, 0) / responseMinutes.length)
      : null,
  };
};

const createError = (res: VercelResponse, status: number, error: string) =>
  res.status(status).json({ error });

const getClinicKey = (booking: BookingRow) => {
  if (booking.clinic_id !== null) {
    return `id:${booking.clinic_id}`;
  }

  if (booking.clinic_location?.trim()) {
    return `location:${booking.clinic_location.trim()}`;
  }

  return 'unassigned';
};

const getClinicName = (booking: BookingRow, clinicNameMap: Map<number, string>) => {
  if (booking.clinic_id !== null) {
    return clinicNameMap.get(booking.clinic_id) || booking.clinic_location || `Clinic ${booking.clinic_id}`;
  }

  return booking.clinic_location || 'Unassigned Clinic';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return createError(res, 405, `Method ${req.method} Not Allowed`);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return createError(res, 500, 'Server is missing Supabase configuration');
  }

  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!accessToken) {
    return createError(res, 401, 'Missing bearer token');
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !authData.user) {
      return createError(res, 401, 'Invalid session');
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id, email')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (adminError) {
      return createError(res, 500, 'Failed to verify admin access');
    }

    if (!adminUser) {
      return createError(res, 403, 'Admin access required');
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from('appointment_bookings')
      .select([
        'booking_ref',
        'patient_name',
        'treatment_type',
        'preferred_date',
        'time_slot',
        'clinic_id',
        'clinic_location',
        'status',
        'created_at',
        'expires_at',
        'clinic_responded_at',
        'rejection_reason',
      ].join(','))
      .order('created_at', { ascending: false });

    if (bookingsError) {
      return createError(res, 500, 'Failed to load bookings');
    }

    const clinicIds = Array.from(new Set((bookings || []).map((booking) => booking.clinic_id).filter((clinicId): clinicId is number => clinicId !== null)));

    const clinicNameMap = new Map<number, string>();

    if (clinicIds.length > 0) {
      const { data: clinics, error: clinicsError } = await supabase
        .from('clinics_data')
        .select('id, name')
        .in('id', clinicIds);

      if (clinicsError) {
        return createError(res, 500, 'Failed to load clinic names');
      }

      for (const clinic of clinics || []) {
        clinicNameMap.set(clinic.id, clinic.name);
      }
    }

    const bookingRows = (bookings || []) as BookingRow[];
    const summary = computeSummary(bookingRows);

    const groupedByClinic = new Map<string, BookingRow[]>();
    for (const booking of bookingRows) {
      const clinicKey = getClinicKey(booking);
      const clinicBookings = groupedByClinic.get(clinicKey) || [];
      clinicBookings.push(booking);
      groupedByClinic.set(clinicKey, clinicBookings);
    }

    const clinicSummaries: ClinicSummary[] = Array.from(groupedByClinic.entries()).map(([clinicKey, clinicBookings]) => {
      const firstBooking = clinicBookings[0];
      const clinicId = firstBooking?.clinic_id ?? null;
      const clinicName = firstBooking ? getClinicName(firstBooking, clinicNameMap) : 'Unassigned Clinic';
      const clinicSummary = computeSummary(clinicBookings);

      return {
        clinicId,
        clinicKey,
        clinicName,
        ...clinicSummary,
      };
    }).sort((left, right) => right.totalRequests - left.totalRequests);

    const pendingBookings: PendingBooking[] = bookingRows
      .filter((booking) => booking.status === 'pending')
      .map((booking) => {
        const clinicName = getClinicName(booking, clinicNameMap);
        const clinicKey = getClinicKey(booking);
        const expiresAtMs = booking.expires_at ? new Date(booking.expires_at).getTime() : null;
        const minutesRemaining = expiresAtMs === null
          ? null
          : Math.round((expiresAtMs - Date.now()) / 60000);

        return {
          bookingRef: booking.booking_ref || 'Unknown',
          patientName: booking.patient_name,
          treatmentType: booking.treatment_type,
          preferredDate: booking.preferred_date,
          timeSlot: booking.time_slot,
          clinicId: booking.clinic_id,
          clinicKey,
          clinicName,
          expiresAt: booking.expires_at,
          minutesRemaining,
        };
      })
      .sort((left, right) => {
        if (left.minutesRemaining === null) return 1;
        if (right.minutesRemaining === null) return -1;
        return left.minutesRemaining - right.minutesRemaining;
      });

    const rejectionReasonCounts = new Map<string, RejectionReasonSummary>();
    for (const booking of bookingRows.filter((row) => row.status === 'rejected')) {
      const reason = booking.rejection_reason?.trim() || 'No reason provided';
      const clinicName = getClinicName(booking, clinicNameMap);
      const clinicKey = getClinicKey(booking);
      const mapKey = `${clinicKey}::${reason}`;
      const current = rejectionReasonCounts.get(mapKey);

      if (current) {
        current.count += 1;
      } else {
        rejectionReasonCounts.set(mapKey, {
          clinicId: booking.clinic_id,
          clinicKey,
          clinicName,
          reason,
          count: 1,
        });
      }
    }

    const clinicOptions = clinicSummaries.map((clinic) => ({
      id: clinic.clinicKey,
      name: clinic.clinicName,
    }));

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      adminEmail: adminUser.email,
      summary,
      clinicOptions,
      clinicSummaries,
      pendingBookings,
      rejectionReasons: Array.from(rejectionReasonCounts.values()).sort((left, right) => right.count - left.count),
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return createError(res, 500, error instanceof Error ? error.message : 'Unknown dashboard error');
  }
}

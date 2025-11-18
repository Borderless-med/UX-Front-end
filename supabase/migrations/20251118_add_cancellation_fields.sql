-- Add cancellation audit fields to appointment_bookings
ALTER TABLE appointment_bookings
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason text NULL;

-- Helpful index to query recent cancellations
CREATE INDEX IF NOT EXISTS appointment_bookings_cancelled_at_idx ON appointment_bookings (cancelled_at);

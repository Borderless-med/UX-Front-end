# OraChope Pulse Admin Dashboard

## What was added

- Route: `/admin/dashboard`
- Server API: `api/admin/dashboard.ts`
- Frontend page: `src/pages/AdminDashboard.tsx`
- Access registry: `public.admin_users`

## Setup steps

1. Run `ADMIN_DASHBOARD_SETUP.sql` in the Supabase SQL Editor.
2. Insert your admin email into `public.admin_users`.
3. Deploy the latest `sg-smile-saver` build.
4. Sign in with the same Supabase account and visit `/admin/dashboard`.

## What the dashboard shows

- Total booking requests
- Pending booking count
- Confirmed, expired, and rejected rates
- Clinic-specific performance breakdown
- Pending bookings sorted by nearest expiry
- Rejection reasons by clinic

## Access model

- The page requires an authenticated Supabase session.
- The API only returns data for users listed in `public.admin_users`.
- All booking reads happen server-side using the service role key.

## Troubleshooting

### `Admin access required`
- The signed-in user email is not mapped in `public.admin_users`.

### `Missing bearer token`
- The browser session is not authenticated. Sign in again.

### Empty dashboard
- No booking rows exist yet in `appointment_bookings`, or the deployment is stale.

### Page loads old code
- Redeploy `sg-smile-saver` and hard refresh the browser.

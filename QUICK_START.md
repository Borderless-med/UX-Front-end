# 🚀 QUICK START - Local Testing

**Goal:** Test the booking system on localhost in 15 minutes

---

## STEP 1: Install Vercel CLI (2 minutes)

```powershell
npm install -g vercel
```

---

## STEP 2: Setup Environment (3 minutes)

1. **Copy template:**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Edit `.env` file** - Replace with your real values:
   - `SUPABASE_URL` - From Supabase project settings
   - `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project settings
   - `SMTP2GO_API_KEY` - From SMTP2GO dashboard
   - `BREVO_API_KEY` - From Brevo dashboard
   - `SMTP_USER` - contact@orachope.org
   - `CANCEL_SECRET` - Your existing secret

3. **Generate new secrets:**
   ```powershell
   # Generate CRON_SECRET
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # Generate HMAC_SECRET (run again for different value)
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

4. **Add to `.env`:**
   ```env
   CRON_SECRET=your-generated-value-here
   HMAC_SECRET=your-generated-value-here
   WHATSAPP_ENABLED=false
   ```

---

## STEP 3: Start Local Server (1 minute)

```powershell
vercel dev
```

Wait for: `Ready! Available at http://localhost:3000`

---

## STEP 4: Quick Test - Cron Jobs (2 minutes)

**Open new PowerShell terminal** (keep vercel dev running in first terminal):

```powershell
# Replace YOUR_CRON_SECRET with value from .env
.\quick-test.ps1 -CronSecret "YOUR_CRON_SECRET"
```

**Expected output:**
```
✓ SUCCESS - Expired: 0
✓ SUCCESS - Nudged: 0
✓ SUCCESS - Reminded: 0
```

**If you see this, cron jobs are working!** ✅

---

## STEP 5: Test Clinic Endpoints (7 minutes)

### 5a. Create Test Booking in Database

Go to Supabase SQL Editor and run:

```sql
INSERT INTO appointment_bookings (
  booking_ref,
  patient_name,
  email,
  whatsapp,
  clinic_location,
  clinic_id,
  treatment_type,
  preferred_date,
  time_slot,
  status,
  expires_at
) VALUES (
  'BK999TEST',
  'Test Patient',
  'YOUR-EMAIL@example.com',  -- PUT YOUR REAL EMAIL HERE
  '+6591234567',
  'Test Clinic',
  (SELECT id FROM clinics_data LIMIT 1),
  'Root Canal',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00 - 11:00',
  'pending',
  NOW() + INTERVAL '3 hours'
);
```

### 5b. Get Clinic ID

```sql
SELECT id FROM clinics_data LIMIT 1;
```

Copy the `id` value (e.g., `5`)

### 5c. Generate Test URLs

```powershell
# Replace values with your actual values
.\generate-test-urls.ps1 -BookingRef "BK999TEST" -ClinicId "5" -HmacSecret "YOUR_HMAC_SECRET"
```

**Copy the 3 URLs it generates.**

### 5d. Test in Browser

**Test CONFIRM:**
1. Open confirm URL in browser
2. Should see: ✅ Appointment Confirmed page
3. Check database: `status` should be 'confirmed'
4. Check email: Should receive confirmation email

**Test REJECT:**
1. Create another test booking (change ref to BK888TEST)
2. Generate new URLs with BK888TEST
3. Open reject URL
4. Fill form with reason: "Test rejection"
5. Submit
6. Check database: `status='rejected'`

**Test ALTERNATIVES:**
1. Create another test booking (change ref to BK777TEST)
2. Generate new URLs with BK777TEST
3. Open alternatives URL
4. Enter 3 time slots (tomorrow, next day, day after)
5. Submit
6. Check database: `expires_at` extended, `admin_notes` has JSON

---

## ✅ TESTING COMPLETE!

If all tests pass:
- ✅ Cron jobs working
- ✅ Clinic confirm working
- ✅ Clinic reject working
- ✅ Clinic alternatives working
- ✅ Emails sending
- ✅ Database updating

**You're ready to deploy!** 🚀

---

## NEXT: Deploy to Production

Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Troubleshooting

**"vercel: command not found"**
- Run: `npm install -g vercel`
- Restart PowerShell

**"Module not found" errors**
- Run: `npm install`
- Restart `vercel dev`

**"Unauthorized" on cron test**
- Check CRON_SECRET in .env matches the one you're using
- No spaces or quotes around the value

**"Invalid token" on clinic endpoints**
- Regenerate URLs with correct HMAC_SECRET
- Make sure no spaces in the secret

**"Database error"**
- Check SUPABASE_SERVICE_ROLE_KEY (not anon key)
- Check Supabase project is running

**Email not sending**
- Check SMTP credentials in .env
- Check SMTP2GO dashboard for errors

---

## Need More Detail?

See [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) for comprehensive testing instructions.

# 🧪 LOCAL TESTING GUIDE

**Purpose:** Test the booking system on localhost before deploying to production

**Estimated Setup Time:** 10-15 minutes

---

## STEP 1: INSTALL VERCEL CLI

Vercel CLI allows you to run serverless functions locally.

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Verify installation
vercel --version
```

---

## STEP 2: CREATE LOCAL ENVIRONMENT FILE

1. **Copy the template:**
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Fill in your actual values in `.env`:**
   - Open `.env` in VS Code
   - Replace all placeholder values with real credentials
   - Generate new secrets for CRON_SECRET and HMAC_SECRET

3. **Generate secrets (PowerShell):**
   ```powershell
   # Generate CRON_SECRET
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # Generate HMAC_SECRET
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

4. **IMPORTANT:** Never commit `.env` to git! (Already in .gitignore)

---

## STEP 3: START LOCAL DEV SERVER

```powershell
cd "C:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver"

# Start Vercel dev server
vercel dev
```

**What happens:**
- Vercel CLI starts local server (usually `http://localhost:3000`)
- All API routes available at `http://localhost:3000/api/*`
- Hot reload - changes reflect automatically
- Environment variables loaded from `.env`

**Expected Output:**
```
Vercel CLI [version]
> Running in Development mode
> Ready! Available at http://localhost:3000
```

---

## STEP 4: TEST EACH ENDPOINT

### Test 1: Confirm Endpoint (Manual)

**URL:**
```
http://localhost:3000/api/clinic/respond/BK123456/confirm?token=test123
```

**Expected Result:**
- Opens in browser
- Shows "❌ Invalid Security Token" (correct - security working!)

### Test 2: Reject Endpoint (Form Display)

**URL:**
```
http://localhost:3000/api/clinic/respond/BK123456/reject?token=test123
```

**Expected Result:**
- Shows "❌ Invalid Security Token"
- OR if you create valid token, shows rejection form

### Test 3: Alternatives Endpoint (Form Display)

**URL:**
```
http://localhost:3000/api/clinic/respond/BK123456/alternatives?token=test123
```

**Expected Result:**
- Shows "❌ Invalid Security Token"
- OR with valid token, shows alternatives form with 3-5 slot inputs

### Test 4: Auto-Expiry Cron Job

**Command (PowerShell):**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_FROM_ENV"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/cron/check-expired-bookings" -Headers $headers -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "expired": 0,
  "message": "No bookings to expire"
}
```

### Test 5: Urgent Nudge Cron

**Command:**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_FROM_ENV"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-urgent-nudges" -Headers $headers -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "nudged": 0,
  "message": "No bookings need nudging"
}
```

### Test 6: 24-Hour Reminder Cron

**Command:**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_FROM_ENV"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-appointment-reminders" -Headers $headers -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "reminded": 0,
  "message": "No bookings need reminders"
}
```

---

## STEP 5: TEST WITH REAL BOOKING DATA

### Create Test Booking in Database

```sql
-- Connect to Supabase SQL Editor
-- Run this to create a test booking:

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
  'your-email@example.com',  -- Use your real email to receive test notifications
  '+6591234567',
  'Test Clinic',
  (SELECT id FROM clinics_data LIMIT 1),  -- Get first clinic ID
  'Root Canal',
  CURRENT_DATE + INTERVAL '1 day',  -- Tomorrow
  '10:00 - 11:00',
  'pending',
  NOW() + INTERVAL '3 hours'  -- Expires in 3 hours
);
```

### Generate Valid HMAC Token for Test Booking

**PowerShell Script:**
```powershell
# Create a file: generate-test-token.ps1

$bookingRef = "BK999TEST"
$clinicId = "1"  # Replace with actual clinic_id from database
$hmacSecret = "YOUR_HMAC_SECRET_FROM_ENV"  # Copy from .env

$dataToSign = "$bookingRef|$clinicId"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($hmacSecret)
$hash = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($dataToSign))
$hashString = [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
$token = $hashString.Substring(0, 32)

Write-Host "Test URL (Confirm):"
Write-Host "http://localhost:3000/api/clinic/respond/BK999TEST/confirm?token=$token"
Write-Host ""
Write-Host "Test URL (Reject):"
Write-Host "http://localhost:3000/api/clinic/respond/BK999TEST/reject?token=$token"
Write-Host ""
Write-Host "Test URL (Alternatives):"
Write-Host "http://localhost:3000/api/clinic/respond/BK999TEST/alternatives?token=$token"
```

**Run the script:**
```powershell
.\generate-test-token.ps1
```

**Copy the URLs and test in browser!**

### Test Confirm Flow

1. Open confirm URL in browser
2. Should see success page
3. Check database: `status` should be 'confirmed'
4. Check your email: Should receive confirmation email (Template 3)
5. Check database: `notifications_sent` should have log entry

### Test Reject Flow

1. Open reject URL in browser
2. Should see form with reason textarea
3. Enter reason: "Test rejection"
4. Submit form
5. Check database: `status='rejected'`, `rejection_reason='Test rejection'`
6. Check email: Should receive rejection notice

### Test Alternatives Flow

1. Open alternatives URL in browser
2. Should see form for 3-5 time slots
3. Enter 3 slots (dates + times)
4. Submit
5. Check database: `expires_at` extended by +60 min
6. Check database: `admin_notes` contains JSON with alternatives
7. Check email: Should receive alternatives email (Template 4)

---

## STEP 6: TEST EXPIRY FLOW

### Manually Expire a Booking

```sql
-- Set expiry to past time
UPDATE appointment_bookings
SET expires_at = NOW() - INTERVAL '1 hour'
WHERE booking_ref = 'BK999TEST'
  AND status = 'pending';
```

### Trigger Expiry Cron

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_FROM_ENV"
}

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/cron/check-expired-bookings" -Headers $headers -Method GET
$response | ConvertTo-Json -Depth 5
```

**Expected Result:**
- Response shows 1 booking expired
- Database: `status='expired'`
- Email: Expiry notice (Template 5) received

---

## STEP 7: TEST 24-HOUR REMINDER

### Create Confirmed Booking Tomorrow

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
  reminder_24h_sent
) VALUES (
  'BK888REMIND',
  'Reminder Test',
  'your-email@example.com',
  '+6591234567',
  'Test Clinic',
  (SELECT id FROM clinics_data LIMIT 1),
  'Cleaning',
  CURRENT_DATE + INTERVAL '1 day',  -- Tomorrow (within 24h window)
  '14:00 - 15:00',
  'confirmed',
  FALSE
);
```

### Trigger Reminder Cron

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_FROM_ENV"
}

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/cron/send-appointment-reminders" -Headers $headers -Method GET
$response | ConvertTo-Json -Depth 5
```

**Expected Result:**
- Response shows 1 reminder sent
- Database: `reminder_24h_sent=TRUE`
- Email: 24h reminder (Template 7) received
- (WhatsApp message if enabled)

---

## DEBUGGING TIPS

### Check Vercel Dev Logs

Watch the terminal where `vercel dev` is running:
- All console.log() statements appear here
- Error stack traces show here
- HTTP request logs displayed

### Check Database After Each Test

```sql
-- View recent bookings
SELECT 
  booking_ref,
  status,
  expires_at,
  clinic_responded_at,
  rejection_reason,
  notifications_sent,
  reminder_24h_sent
FROM appointment_bookings
ORDER BY created_at DESC
LIMIT 10;
```

### Common Issues

**Issue: "Module not found" errors**
- Solution: Run `npm install` to install dependencies

**Issue: "Environment variable undefined"**
- Solution: Check `.env` file exists and has all variables
- Restart `vercel dev` after changing `.env`

**Issue: "Unauthorized" on cron endpoints**
- Solution: Check `CRON_SECRET` in `.env` matches the one in request header

**Issue: "Invalid token" on clinic endpoints**
- Solution: Regenerate token using PowerShell script with correct HMAC_SECRET

**Issue: Email not sending**
- Solution: Check SMTP credentials in `.env`
- Check SMTP2GO dashboard for errors
- Try Brevo fallback

**Issue: Database update failed**
- Solution: Check Supabase connection
- Verify SERVICE_ROLE_KEY (not anon key)
- Check Row Level Security policies

---

## STOPPING LOCAL SERVER

Press `Ctrl + C` in the terminal running `vercel dev`

---

## TESTING CHECKLIST

Before deploying to production, verify:

- [ ] All 3 cron endpoints return 200 OK
- [ ] Confirm endpoint works with valid token
- [ ] Reject form displays and submits correctly
- [ ] Alternatives form accepts 3-5 slots
- [ ] Expired bookings auto-update to 'expired'
- [ ] Emails sending successfully (check inbox)
- [ ] Database updates working (status, timestamps, etc.)
- [ ] Notification logs saved in `notifications_sent` JSONB
- [ ] No errors in Vercel dev terminal
- [ ] All environment variables loaded correctly

---

## NEXT STEP: DEPLOY TO PRODUCTION

Once local testing passes, follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) to deploy to Vercel.

**Difference between local and production:**
- Local: Uses `.env` file
- Production: Uses Vercel environment variables (set in dashboard)
- Local: Manual cron trigger (curl/PowerShell)
- Production: Automatic cron execution per schedule

---

## ADDITIONAL TESTING TOOLS

### Postman/Insomnia Collection

You can create a collection with all test requests for easy re-testing.

### Database Seeding Script

Create `test-seed.sql` with multiple test bookings in different states.

### Automated Testing (Future)

Consider adding Jest/Vitest tests for:
- Notification service
- Email template rendering
- HMAC token generation
- Database operations

---

**Ready to test locally? Follow the steps above!**

Once everything works, deploy to production with confidence. 🚀

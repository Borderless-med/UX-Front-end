# 🚀 ORACHOPE BOOKING SYSTEM - DEPLOYMENT GUIDE

**Date:** May 29, 2026  
**Status:** ✅ Phase 1 Complete - Ready for Deployment  
**Estimated Deployment Time:** 30-45 minutes

---

## 📦 WHAT'S BEEN BUILT

### Core Infrastructure (10 Files)

1. **[api/services/notification-service.ts](api/services/notification-service.ts)** - Unified notification service
2. **[api/templates/email-templates.ts](api/templates/email-templates.ts)** - 7 email templates
3. **[api/templates/whatsapp-templates.ts](api/templates/whatsapp-templates.ts)** - WhatsApp mappings
4. **[api/cron/check-expired-bookings.ts](api/cron/check-expired-bookings.ts)** - Auto-expiry (every 15 min)
5. **[api/cron/send-urgent-nudges.ts](api/cron/send-urgent-nudges.ts)** - 30-min warning (every 15 min)
6. **[api/cron/send-appointment-reminders.ts](api/cron/send-appointment-reminders.ts)** - 24h reminder (hourly)
7. **[api/clinic/respond/[booking_ref]/confirm.ts](api/clinic/respond/[booking_ref]/confirm.ts)** - Confirm endpoint
8. **[api/clinic/respond/[booking_ref]/reject.ts](api/clinic/respond/[booking_ref]/reject.ts)** - Reject endpoint (with form)
9. **[api/clinic/respond/[booking_ref]/alternatives.ts](api/clinic/respond/[booking_ref]/alternatives.ts)** - Alternatives endpoint (extends +60min)
10. **[vercel.json](vercel.json)** - Updated with 3 cron schedules

---

## ⚙️ STEP 1: ADD ENVIRONMENT VARIABLES

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

### Required (New Variables)

```bash
# Cron Job Security
CRON_SECRET=<generate-random-32-char-string>
HMAC_SECRET=<generate-random-32-char-string>

# WhatsApp Configuration (set when Meta approves)
WHATSAPP_ENABLED=false
WHATSAPP_API_TOKEN=<get-from-meta-business-manager>
WHATSAPP_PHONE_NUMBER_ID=<get-from-meta-business-manager>
```

### How to Generate Secrets (PowerShell)

```powershell
# Generate CRON_SECRET
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Generate HMAC_SECRET
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Existing Variables (Verify Present)

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
SMTP2GO_API_KEY=xxx
BREVO_API_KEY=xxx
SMTP_USER=contact@orachope.org
CANCEL_SECRET=xxx
```

---

## 📤 STEP 2: DEPLOY TO VERCEL

### Option A: Git Push (Recommended)

```bash
cd "C:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver"
git add .
git commit -m "feat: Add automated booking system with WhatsApp/Email notifications"
git push origin main
```

Vercel will auto-deploy on push.

### Option B: Manual Deploy

1. Go to Vercel Dashboard
2. Click "Deploy"
3. Wait 2-3 minutes
4. Check deployment logs for errors

---

## ✅ STEP 3: VERIFY CRON JOBS REGISTERED

After deployment:

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see **3 cron jobs**:
   - `check-expired-bookings` - Every 15 minutes
   - `send-urgent-nudges` - Every 15 minutes
   - `send-appointment-reminders` - Every hour

3. Click each cron job to see:
   - Next scheduled run
   - Past execution history
   - Logs

---

## 🧪 STEP 4: TEST THE SYSTEM

### Test 1: Clinic Confirm Endpoint

**Manual Test (No Database Needed):**

1. Create test URL:
   ```
   https://orachope.org/api/clinic/respond/BK123456/confirm?token=test123
   ```

2. Open in browser - you should see:
   - ❌ Invalid Token page (expected - security working!)

3. To test with real booking:
   - Submit a test booking via your booking form
   - Wait for clinic alert email
   - Click "Confirm" button
   - Should see ✅ success page
   - Patient should receive confirmation email

### Test 2: Auto-Expiry Cron Job

**Trigger Manually:**

```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_HERE"
}

Invoke-WebRequest -Uri "https://orachope.org/api/cron/check-expired-bookings" -Headers $headers -Method GET
```

**Expected Response:**

```json
{
  "success": true,
  "expired": 0,
  "message": "No bookings to expire"
}
```

**To Test With Actual Expiry:**

1. Create booking in database
2. Manually set `expires_at` to past time:
   ```sql
   UPDATE appointment_bookings
   SET expires_at = NOW() - INTERVAL '1 hour'
   WHERE booking_ref = 'BK123456';
   ```
3. Trigger cron manually (command above)
4. Patient should receive expiry email (Template 5)

### Test 3: Reject Endpoint (Form)

1. Create test booking
2. Get clinic alert email
3. Click "Reject" button
4. Fill rejection reason: "Fully booked"
5. Submit
6. Should see success page
7. Check database: `status='rejected'`

### Test 4: Alternatives Endpoint

1. Create test booking
2. Get clinic alert email
3. Click "Offer Alternatives" button
4. Enter 3 time slots:
   - June 1, 2026 at 10:00
   - June 2, 2026 at 14:00
   - June 3, 2026 at 16:00
5. Submit
6. Check database:
   - `expires_at` extended by +60 minutes
   - `admin_notes` contains JSON with alternatives
7. Patient should receive email with 3 options

### Test 5: 24-Hour Reminder

**Manual Trigger:**

```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_HERE"
}

Invoke-WebRequest -Uri "https://orachope.org/api/cron/send-appointment-reminders" -Headers $headers -Method GET
```

**To Test With Actual Booking:**

1. Create confirmed booking
2. Set `preferred_date` to tomorrow:
   ```sql
   UPDATE appointment_bookings
   SET preferred_date = CURRENT_DATE + INTERVAL '1 day'
   WHERE booking_ref = 'BK123456';
   ```
3. Trigger cron manually
4. Patient should receive reminder email (Template 7)
5. Check database: `reminder_24h_sent=TRUE`

---

## 🔍 STEP 5: MONITOR FIRST 10 BOOKINGS

### Things to Watch

1. **Email Deliverability**
   - Check spam folders
   - Verify SMTP2GO dashboard for delivery status
   - Fallback to Brevo working?

2. **Database Updates**
   - `status` changing correctly?
   - `expires_at` auto-set by trigger?
   - `notifications_sent` JSONB logging?

3. **Cron Job Execution**
   - Check Vercel → Cron Jobs → Logs
   - Any errors or timeouts?
   - 15-min schedule working?

4. **Response Times**
   - Clinic endpoints loading quickly?
   - Forms submitting successfully?
   - Auto-retry working if database busy?

### SQL Queries for Monitoring

```sql
-- Check recent bookings
SELECT 
  booking_ref,
  status,
  created_at,
  expires_at,
  clinic_responded_at,
  notifications_sent
FROM appointment_bookings
ORDER BY created_at DESC
LIMIT 10;

-- Check which notifications sent
SELECT 
  booking_ref,
  jsonb_array_length(notifications_sent) as notification_count,
  notifications_sent
FROM appointment_bookings
WHERE notifications_sent IS NOT NULL;

-- Check expired bookings
SELECT 
  booking_ref,
  status,
  expires_at,
  created_at
FROM appointment_bookings
WHERE status = 'expired';

-- Check reminders sent
SELECT 
  booking_ref,
  patient_name,
  preferred_date,
  reminder_24h_sent
FROM appointment_bookings
WHERE status = 'confirmed'
  AND reminder_24h_sent = TRUE;
```

---

## 🚨 TROUBLESHOOTING

### Issue: Cron Jobs Not Running

**Check:**
1. Vercel Dashboard → Cron Jobs → Status
2. Environment variable `CRON_SECRET` set?
3. Deployment successful?
4. View logs for error messages

**Fix:**
- Redeploy project
- Check cron expression syntax in vercel.json
- Verify `/api/cron/*` files deployed

### Issue: Email Not Sending

**Check:**
1. SMTP2GO dashboard for delivery errors
2. Environment variables correct?
3. Email address valid format?
4. Check Brevo fallback working?

**Fix:**
- Test SMTP credentials manually
- Check API key quotas/limits
- Verify sender email verified in SMTP2GO

### Issue: HMAC Token Invalid

**Check:**
1. `HMAC_SECRET` environment variable set?
2. Same secret used in email link generation?
3. URL not truncated/modified?

**Fix:**
- Regenerate HMAC_SECRET
- Ensure secret same in all environments
- Check email template URL generation

### Issue: Database Update Failed

**Check:**
1. Supabase connection working?
2. Row Level Security blocking?
3. Using SERVICE_ROLE_KEY (not anon key)?

**Fix:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` correct
- Check Supabase logs for errors
- Auto-retry should handle transient errors

---

## 📊 SUCCESS METRICS

After 1 week, check:

- **Booking Automation Rate:** % of bookings handled without manual intervention
- **Email Deliverability:** % of emails successfully delivered (check SMTP2GO)
- **Clinic Response Rate:** % of clinics responding within 3 hours
- **Expiry Rate:** % of bookings expiring due to no clinic response
- **Patient Satisfaction:** Feedback on notification timing/content

**Target Metrics:**
- 95%+ email delivery success
- 80%+ clinic response rate
- <10% booking expiry rate
- 90%+ patient satisfaction

---

## 🎯 NEXT PHASE: WHATSAPP INTEGRATION

**When Meta Approves Business Verification:**

1. **Create WhatsApp Templates in Meta Business Manager**
   - Copy text from `whatsapp-templates.ts`
   - Submit all 7 templates for approval
   - Wait 2-3 days

2. **Get API Credentials**
   - WhatsApp Phone Number ID
   - WhatsApp API Token
   - Business Account ID

3. **Enable WhatsApp**
   ```bash
   # Update environment variables
   WHATSAPP_ENABLED=true
   WHATSAPP_API_TOKEN=<your-token>
   WHATSAPP_PHONE_NUMBER_ID=<your-id>
   ```

4. **Test WhatsApp Delivery**
   - Send test message to yourself
   - Verify buttons working
   - Check delivery status

5. **Monitor Costs**
   - Meta charges per message
   - Track conversation windows
   - Budget ~$0.05-0.10 per message

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Environment variables added (CRON_SECRET, HMAC_SECRET)
- [ ] Code deployed to Vercel
- [ ] 3 cron jobs visible in Vercel dashboard
- [ ] Test booking created successfully
- [ ] Clinic confirm endpoint working
- [ ] Clinic reject endpoint (form) working
- [ ] Alternatives endpoint (3-5 slots) working
- [ ] Auto-expiry cron tested manually
- [ ] 24h reminder cron tested manually
- [ ] Emails arriving in inbox (not spam)
- [ ] Database updates working correctly
- [ ] Monitoring queries saved for regular checks

---

## 🆘 SUPPORT

**Issues During Deployment:**
- Check Vercel deployment logs
- Review function errors in Vercel dashboard
- Verify all environment variables present
- Test each endpoint individually

**Contact for Help:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- WhatsApp Business API: https://business.facebook.com/support

---

**🎉 CONGRATULATIONS!**

Your automated booking system is now live. All booking workflows are automated - no more manual email copying!

**What happens now:**
1. Patient submits booking → Automatic email to clinic (Template 2)
2. Clinic responds in 3 hours → Patient auto-notified (Template 3/4/5)
3. No response in 30 min → Urgent nudge sent (Template 6)
4. No response in 3 hours → Auto-expires, patient notified (Template 5)
5. 24 hours before → Reminder sent (Template 7)

**All automated. Zero manual work. ✨**

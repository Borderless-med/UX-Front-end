# 🔍 SMTP2GO DIAGNOSTIC & FIX PLAN
**Date:** August 11, 2026  
**Goal:** Verify SMTP2GO status, fix if broken, then establish Brevo backup

---

## 📋 ASSESSMENT CHECKLIST

### ✅ **STEP 1: Check Vercel Environment Variables**

1. **Go to Vercel Dashboard:**
   - URL: https://vercel.com/gohseowpings-projects/sg-smile-saver/settings/environment-variables
   
2. **Check these variables:**
   ```
   SMTP2GO_API_KEY = ?
   BREVO_API_KEY = ?
   SMTP_USER = ?
   ```

3. **Expected values:**
   - ❌ BAD: `SMTP2GO_API_KEY = your-smtp2go-api-key` (placeholder)
   - ❌ BAD: `SMTP2GO_API_KEY = (not set)`
   - ✅ GOOD: `SMTP2GO_API_KEY = api-xxxxxxxxxxxxxxxxxxxxx` (real key)

**ACTION:** Take screenshot of Vercel environment variables (redact key values)

---

### ✅ **STEP 2: Check Vercel Production Logs**

1. **Go to Vercel Logs:**
   - URL: https://vercel.com/gohseowpings-projects/sg-smile-saver/logs
   - Filter: Production environment
   - Time range: Last 7 days

2. **Search for these patterns:**

   **Pattern A: SMTP2GO Success** (✅ Working)
   ```
   "Email sent successfully via SMTP2GO"
   "SMTP2Go response: 200"
   ```

   **Pattern B: SMTP2GO Failure** (❌ Broken)
   ```
   "SMTP2GO_API_KEY at runtime: missing"
   "SMTP2Go response: 401" (Invalid API key)
   "SMTP2Go response: 403" (Forbidden)
   "SMTP2GO failed"
   ```

   **Pattern C: Brevo Fallback** (⚠️ SMTP2GO failed, Brevo worked)
   ```
   "Email sent successfully via Brevo"
   "SMTP2GO failed, trying Brevo fallback"
   ```

3. **Look for admin email attempts:**
   - Search: `"New SG Clinic Inquiry"` (inquiry emails)
   - Search: `"ADMIN: New Partner Signup"` (partner emails)
   - Search: `"contact@orachope.org"` (admin emails)

**ACTION:** Export/screenshot relevant log entries showing email failures

---

### ✅ **STEP 3: Check Database for Missed Notifications**

Run these SQL queries in Supabase SQL Editor:

```sql
-- ============================================
-- CHECK 1: Recent Inquiries (if table exists)
-- ============================================
SELECT 
  id,
  clinic_name,
  user_name,
  user_email,
  created_at,
  'inquiry' as type
FROM inquiries
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC;

-- If inquiries table doesn't exist, skip this query

-- ============================================
-- CHECK 2: Recent Partner Signups (if table exists)
-- ============================================
SELECT 
  id,
  clinic_name,
  contact_name,
  email,
  created_at,
  'partner' as type
FROM partner_signups
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC;

-- If partner_signups table doesn't exist, skip this query

-- ============================================
-- CHECK 3: Recent Bookings (to see if system active)
-- ============================================
SELECT 
  booking_ref,
  patient_name,
  patient_email,
  clinic_location,
  status,
  created_at
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC
LIMIT 20;

-- This proves system is active and receiving bookings

-- ============================================
-- CHECK 4: Recent Cancellations (admin should be notified)
-- ============================================
SELECT 
  booking_ref,
  patient_name,
  patient_email,
  clinic_location,
  status,
  updated_at as cancelled_at
FROM appointment_bookings
WHERE status = 'cancelled'
  AND updated_at >= NOW() - INTERVAL '14 days'
ORDER BY updated_at DESC;
```

**EXPECTED RESULT:**
- If bookings exist but you received NO admin emails → **PROOF of email failure**
- If cancellations exist but you received NO admin emails → **PROOF of email failure**

**ACTION:** Run queries and document counts:
- `__` inquiries in past 2 weeks (should have received __ emails)
- `__` partner signups in past 2 weeks (should have received __ emails)
- `__` cancellations in past 2 weeks (should have received __ emails)

---

### ✅ **STEP 4: Verify SMTP2GO Account Status**

1. **Check if SMTP2GO account exists:**
   - Go to: https://www.smtp2go.com/
   - Try to login with: `contact@orachope.org`
   - If no account → **Need to create one**

2. **If account exists, check:**
   - Account status: Active or Suspended?
   - Monthly quota: `___` / 1,000 emails used
   - API keys: How many exist? Are they active?
   - Recent activity: Last email sent on `___` date

3. **Check API Key validity:**
   - Settings → API Keys
   - Find key used in Vercel
   - Status: Active or Revoked?
   - Created date: `___`
   - Last used: `___`

**ACTION:** Document SMTP2GO account status

---

### ✅ **STEP 5: Manual SMTP2GO API Test**

Test SMTP2GO directly with curl to verify it works:

```powershell
# Replace YOUR_API_KEY with actual key from Vercel
$apiKey = "api-YOUR_SMTP2GO_KEY_HERE"
$body = @{
    api_key = $apiKey
    to = @("contact@orachope.org")
    sender = "contact@orachope.org"
    subject = "SMTP2GO Test - $(Get-Date)"
    html_body = "<h1>Test Email</h1><p>This is a test from SMTP2GO diagnostic script.</p><p>Sent at: $(Get-Date)</p>"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://api.smtp2go.com/v3/email/send" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

**EXPECTED RESPONSES:**

**✅ SUCCESS (200):**
```json
{
  "data": {
    "email_id": "...",
    "succeeded": 1,
    "failed": 0
  }
}
```
→ SMTP2GO is working! Problem is elsewhere.

**❌ FAILURE (401 Unauthorized):**
```json
{
  "data": {
    "error": "Invalid API key"
  }
}
```
→ API key is invalid/revoked. Need new key.

**❌ FAILURE (403 Forbidden):**
```json
{
  "data": {
    "error": "Account suspended"
  }
}
```
→ Account has issues (quota exceeded, payment failed, etc.)

**ACTION:** Run test and document response

---

## 🔧 FIX PLAN (Based on Assessment)

### **SCENARIO A: SMTP2GO API Key Missing/Invalid**

**Diagnosis:** Vercel has placeholder value or missing key

**Fix Steps:**

1. **Get Real API Key:**
   - Login to SMTP2GO: https://www.smtp2go.com/
   - Settings → API Keys → "Add API Key"
   - Name: "OraChope Production"
   - Copy key: `api-xxxxxxxxxxxxxxxxxxxxx`

2. **Update Vercel:**
   - Go to: https://vercel.com/.../environment-variables
   - Find `SMTP2GO_API_KEY`
   - Edit → Paste real key
   - Save

3. **Redeploy:**
   - Deployments → Latest → Redeploy
   - Wait for deployment to complete

4. **Test:**
   - Submit test inquiry/partner form
   - Check contact@orachope.org inbox
   - Check Vercel logs for "Email sent successfully via SMTP2GO"

---

### **SCENARIO B: SMTP2GO Account Suspended/Quota Exceeded**

**Diagnosis:** Account exists but disabled

**Fix Options:**

**Option 1: Upgrade SMTP2GO Account**
- Upgrade to paid tier (if quota issue)
- Contact support to reactivate
- Timeline: 1-2 days

**Option 2: Create New SMTP2GO Account**
- Use different email (e.g., `admin@orachope.org`)
- Free tier: 1,000 emails/month
- Generate new API key
- Update Vercel
- Timeline: 30 minutes

**Option 3: Switch to Brevo as Primary** (Temporary)
- Already have working Brevo account
- Update code to try Brevo first
- Use SMTP2GO as backup
- Timeline: Immediate

---

### **SCENARIO C: SMTP2GO Working But Not Configured in Vercel**

**Diagnosis:** Account is fine, just not set in Vercel

**Fix Steps:**

1. Copy API key from SMTP2GO dashboard
2. Add to Vercel environment variables
3. Redeploy
4. Test

Timeline: 10 minutes

---

### **SCENARIO D: Code Bug (Not SMTP2GO Issue)**

**Diagnosis:** SMTP2GO works but code doesn't call it

**Check:**
- Admin email functions being triggered?
- Are inquiry/partner forms submitting correctly?
- Are endpoints returning errors?

**Fix:** Debug code execution flow

---

## 🛡️ ESTABLISH BREVO BACKUP (After SMTP2GO Fixed)

### **Goal:** Ensure emails always work even if SMTP2GO fails

**Current State:**
- ✅ NotificationService (patient/clinic): Already has Brevo fallback
- ✅ inquiry-handler.ts: Brevo fallback added (just committed)
- ✅ partner-handler.ts: Brevo fallback added (just committed)
- ✅ cancel-appointment: Already has Brevo fallback

**Verification Steps:**

1. **Check Brevo API Key in Vercel:**
   - Is `BREVO_API_KEY` set?
   - Is it valid?

2. **Test Brevo (if SMTP2GO fixed):**
   - Temporarily invalidate SMTP2GO key
   - Trigger email send
   - Should fall back to Brevo automatically
   - Check logs: "SMTP2GO failed, trying Brevo fallback"

3. **Monitor Both Services:**
   - SMTP2GO: Primary (faster, 1,000/month free)
   - Brevo: Backup (300/day free)
   - Total capacity: ~10,000 emails/month

---

## 📊 ASSESSMENT SUMMARY TEMPLATE

Fill this out after completing steps 1-5:

```
=== SMTP2GO DIAGNOSTIC REPORT ===
Date: [DATE]
Assessed by: [NAME]

1. VERCEL ENVIRONMENT VARIABLES
   [ ] SMTP2GO_API_KEY: [present/missing/placeholder]
   [ ] BREVO_API_KEY: [present/missing/placeholder]
   [ ] SMTP_USER: [value]

2. VERCEL PRODUCTION LOGS (Past 7 days)
   [ ] SMTP2GO success messages: [count]
   [ ] SMTP2GO failure messages: [count]
   [ ] Brevo fallback messages: [count]
   [ ] Admin email attempts: [count]

3. DATABASE EVIDENCE (Past 14 days)
   [ ] Inquiries submitted: [count]
   [ ] Partner signups: [count]
   [ ] Cancellations: [count]
   [ ] Emails received by admin: [count]
   [ ] PROOF of failure: [YES/NO - based on mismatch]

4. SMTP2GO ACCOUNT STATUS
   [ ] Account exists: [YES/NO]
   [ ] Account status: [Active/Suspended/Not Created]
   [ ] API key valid: [YES/NO/UNKNOWN]
   [ ] Monthly quota: [used/total]

5. MANUAL API TEST RESULT
   [ ] Status code: [200/401/403/other]
   [ ] SMTP2GO working: [YES/NO]
   [ ] Error message: [if applicable]

=== DIAGNOSIS ===
Root Cause: [Scenario A/B/C/D from above]

=== FIX PLAN ===
1. [Step 1]
2. [Step 2]
3. [Step 3]

Estimated Time: [minutes/hours]
Priority: [CRITICAL/HIGH/MEDIUM]
```

---

## 🚀 EXECUTION ORDER

**DO THIS IN ORDER:**

1. ✅ Check Vercel environment variables (5 min)
2. ✅ Check Vercel logs (10 min)
3. ✅ Run database queries (5 min)
4. ✅ Check SMTP2GO account (5 min)
5. ✅ Run manual API test (5 min)
6. 📋 Fill out assessment summary (5 min)
7. 🔧 Execute fix based on diagnosis (10-60 min)
8. ✅ Test fixed system (10 min)
9. 🛡️ Verify Brevo backup works (5 min)
10. 📝 Document final state (5 min)

**Total Time: 1-2 hours**

---

## 📞 SUPPORT CONTACTS (If Needed)

- **SMTP2GO Support:** support@smtp2go.com
- **Brevo Support:** support@brevo.com
- **Vercel Support:** https://vercel.com/support

---

**NEXT STEP: Start with Step 1 - Check Vercel environment variables**

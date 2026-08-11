# 🔍 SMTP2GO EMAIL DIAGNOSTIC TOOLKIT
**Purpose:** Systematically diagnose and fix admin email notification failures  
**Date:** August 11, 2026  
**Priority:** CRITICAL

---

## 📦 WHAT'S IN THIS TOOLKIT

This toolkit provides everything you need to:
1. **Prove** admin emails are failing (database evidence)
2. **Diagnose** the root cause (SMTP2GO vs Brevo vs Configuration)
3. **Fix** the primary email service (SMTP2GO)
4. **Verify** the backup works (Brevo fallback)
5. **Test** end-to-end email delivery

---

## 📁 FILES INCLUDED

| File | Purpose | When to Use |
|------|---------|-------------|
| **SMTP2GO_DIAGNOSTIC_PLAN.md** | Master diagnostic plan with step-by-step checklist | START HERE - Complete assessment guide |
| **SMTP2GO_DIAGNOSTIC_QUERIES.sql** | Database queries to find evidence of missed emails | Run in Supabase to get proof |
| **test-smtp2go.ps1** | PowerShell script to test SMTP2GO API directly | Verify if SMTP2GO account/key works |
| **test-brevo.ps1** | PowerShell script to test Brevo API directly | Verify if Brevo account/key works |
| **README_DIAGNOSTIC.md** | This file - Overview and execution guide | Read first for context |

---

## 🎯 QUICK START (5-Minute Assessment)

### **Step 1: Get Proof (2 minutes)**

Run this query in Supabase SQL Editor:

```sql
-- Quick evidence check
SELECT 
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancellations_past_14_days,
  COUNT(*) as total_bookings_past_14_days
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days';
```

**If you see:**
- `cancellations_past_14_days > 0` BUT you received ZERO admin emails
- → **PROOF that admin emails are failing**

---

### **Step 2: Test SMTP2GO (2 minutes)**

```powershell
# In PowerShell terminal
cd "c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver"
.\test-smtp2go.ps1
```

**Enter your SMTP2GO API key from Vercel environment variables**

**Expected Results:**
- ✅ Success (200) → SMTP2GO works, issue is in Vercel config
- ❌ 401 Error → API key invalid, need new key
- ❌ 403 Error → Account suspended/quota exceeded

---

### **Step 3: Check Vercel (1 minute)**

1. Go to: https://vercel.com/gohseowpings-projects/sg-smile-saver/settings/environment-variables
2. Check: `SMTP2GO_API_KEY` value
3. Is it:
   - `your-smtp2go-api-key` → Placeholder (BROKEN) ❌
   - `api-xxxxxxxxxxxxx` → Real key (might be invalid) ⚠️
   - Not set → Missing (BROKEN) ❌

---

## 🔬 FULL DIAGNOSTIC PROCESS (1-2 Hours)

### **Phase 1: Evidence Collection (30 minutes)**

Follow the complete checklist in **SMTP2GO_DIAGNOSTIC_PLAN.md**:

1. ✅ Check Vercel environment variables
2. ✅ Review Vercel production logs (past 7 days)
3. ✅ Run all diagnostic SQL queries
4. ✅ Check SMTP2GO account dashboard
5. ✅ Run manual SMTP2GO API test

**Deliverable:** Completed assessment summary showing:
- Database evidence (X cancellations = X missed emails)
- SMTP2GO status (working/broken/missing)
- Root cause identified

---

### **Phase 2: Fix Implementation (30-60 minutes)**

Based on diagnostic results, execute the appropriate fix:

#### **SCENARIO A: API Key Missing/Invalid**

**Symptoms:**
- Vercel shows placeholder: `your-smtp2go-api-key`
- Test script returns 401 error
- SMTP2GO dashboard has no recent activity

**Fix:**
1. Login to SMTP2GO: https://www.smtp2go.com/
2. Settings → API Keys → Create new key
3. Copy key: `api-xxxxxxxxxxxxx`
4. Update Vercel: `SMTP2GO_API_KEY = <new key>`
5. Redeploy Vercel project
6. Re-run test script (should succeed)

**Time:** 15 minutes

---

#### **SCENARIO B: Account Suspended/Quota Exceeded**

**Symptoms:**
- API key exists and looks valid
- Test script returns 403 error
- SMTP2GO dashboard shows quota 1,000/1,000

**Fix Options:**

**Option 1:** Upgrade SMTP2GO (paid)
- Cost: $10-50/month for higher quota
- Timeline: Immediate

**Option 2:** Create new free account
- Use different email (e.g., `admin@orachope.org`)
- Get new 1,000 email/month quota
- Timeline: 30 minutes

**Option 3:** Switch to Brevo as primary
- Already have Brevo account working
- 300 emails/day (9,000/month) - MORE than SMTP2GO free tier
- Update code to try Brevo first
- Timeline: 1 hour

**Time:** 30-60 minutes depending on option

---

#### **SCENARIO C: Working but Not Configured in Vercel**

**Symptoms:**
- Test script succeeds (200 response)
- Vercel environment variable NOT set or placeholder
- SMTP2GO dashboard shows account active

**Fix:**
1. Copy API key from SMTP2GO dashboard
2. Update Vercel: `SMTP2GO_API_KEY = <key>`
3. Redeploy
4. Test end-to-end

**Time:** 10 minutes

---

### **Phase 3: Verification (15 minutes)**

After fix is deployed:

#### **Test 1: Direct API Test**
```powershell
.\test-smtp2go.ps1
# Should succeed with 200 response
# Check inbox for test email
```

#### **Test 2: Brevo Fallback Test**
```powershell
.\test-brevo.ps1
# Should succeed with 201 response
# Check inbox for test email
```

#### **Test 3: End-to-End Production Test**
1. Submit test inquiry form (if available)
2. Submit test partner signup form (if available)
3. Create test booking and cancel it
4. Check: contact@orachope.org receives all emails
5. Check: Vercel logs show email success

---

## 📊 DIAGNOSTIC DECISION TREE

```
START: Admin emails not received
  │
  ├─ Run SQL queries (SMTP2GO_DIAGNOSTIC_QUERIES.sql)
  │  │
  │  ├─ No bookings/cancellations → System inactive (can't prove failure)
  │  └─ Bookings exist, no emails → PROOF of failure ✅
  │
  ├─ Check Vercel environment variables
  │  │
  │  ├─ SMTP2GO_API_KEY = placeholder → FIX: Get real key
  │  ├─ SMTP2GO_API_KEY = missing → FIX: Add key to Vercel
  │  └─ SMTP2GO_API_KEY = real key → Continue diagnosis
  │
  ├─ Run test-smtp2go.ps1
  │  │
  │  ├─ 200 Success → SMTP2GO works!
  │  │                 → Issue: Vercel config or code bug
  │  │                 → FIX: Check Vercel has correct key
  │  │
  │  ├─ 401 Unauthorized → Invalid API key
  │  │                     → FIX: Generate new key in SMTP2GO
  │  │
  │  ├─ 403 Forbidden → Account issue (quota/suspended)
  │  │                  → FIX: Upgrade or create new account
  │  │
  │  └─ Connection error → Network/DNS issue
  │                        → FIX: Check firewall/proxy settings
  │
  └─ Verify Brevo fallback working
     │
     ├─ Run test-brevo.ps1
     │  │
     │  ├─ 201 Success → Brevo works! ✅
     │  │                Use as backup or primary
     │  │
     │  └─ Error → Fix Brevo configuration
     │
     └─ Deploy code with fallback logic (already done)
```

---

## 🎯 SUCCESS CRITERIA

Your email system is fully working when:

- ✅ SMTP2GO test script succeeds (200 response)
- ✅ Brevo test script succeeds (201 response)
- ✅ Test inquiry form → Admin receives email
- ✅ Test partner signup → Admin receives email
- ✅ Test cancellation → Admin receives email
- ✅ Vercel logs show "Email sent successfully"
- ✅ No errors in Vercel logs for 24 hours

---

## 🔧 MAINTENANCE & MONITORING

### **Weekly Check:**
Run this query to monitor email delivery health:

```sql
-- Weekly email health check
SELECT 
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancellations,
  COUNT(*) as total_bookings
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Expected:** If you see cancellations, you should have received admin emails

---

### **Monthly Tasks:**
1. Check SMTP2GO quota (Settings → Usage)
2. Check Brevo quota (Dashboard → Statistics)
3. Verify both API keys still valid
4. Test both services with test scripts

---

### **Set Up Alerts (Future):**
Consider adding monitoring to alert if:
- No admin emails received for X hours
- Email API returns errors
- Quota approaching limit

---

## 📞 SUPPORT CONTACTS

### **SMTP2GO:**
- Website: https://www.smtp2go.com/
- Support: support@smtp2go.com
- Docs: https://apidoc.smtp2go.com/

### **Brevo:**
- Website: https://www.brevo.com/
- Support: support@brevo.com
- Docs: https://developers.brevo.com/

### **Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

---

## 🚀 QUICK REFERENCE

### **Get SMTP2GO API Key:**
```
1. https://www.smtp2go.com/ → Login
2. Settings → API Keys → Add New
3. Copy key (starts with "api-")
```

### **Get Brevo API Key:**
```
1. https://app.brevo.com/ → Login
2. Settings → API Keys → Create New
3. Select "Send emails" permission
4. Copy key (starts with "xkeysib-")
```

### **Update Vercel Environment Variables:**
```
1. https://vercel.com/[your-org]/sg-smile-saver/settings/environment-variables
2. Find variable or Add New
3. Paste key value
4. Save → Redeploy
```

### **Test Commands:**
```powershell
# Test SMTP2GO
.\test-smtp2go.ps1

# Test Brevo
.\test-brevo.ps1

# View Vercel logs
# Go to: https://vercel.com/[your-org]/sg-smile-saver/logs
```

---

## 📝 NOTES

### **Local .env vs Vercel:**
- Local `.env` file: Used for local development only
- Vercel environment variables: Used in production
- They are SEPARATE - changing local `.env` does NOT affect production

### **Security:**
- NEVER commit real API keys to git
- Keep `.env` file with placeholders only
- Real keys ONLY in Vercel environment variables

### **Free Tier Limits:**
- SMTP2GO: 1,000 emails/month
- Brevo: 300 emails/day (9,000/month)
- Combined: ~10,000 emails/month
- Should be plenty for admin notifications

---

**NEXT STEP: Open SMTP2GO_DIAGNOSTIC_PLAN.md and follow Step 1** 🎯

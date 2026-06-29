# Booking System Status - June 9, 2026

## 📊 OVERALL STATUS
**Phase 1 Automated Booking System: Operational with WhatsApp enabled**
- Core booking flow: ✅ Working
- Clinic response system: ✅ Working  
- Email notifications: ✅ Working
- WhatsApp notifications: ✅ Approved and enabled
- Admin dashboard: ✅ Working
- Cron automation: ✅ Working

---

## ✅ COMPLETED ITEMS

### 1. Core Booking Endpoint
- **File:** `api/send-appointment-confirmation/index.ts`
- **Status:** ✅ Complete
- **Features:**
  - Accepts patient booking requests from website
  - Creates appointment in database with unique reference (APT-2026-XXXXXX)
  - Generates HMAC tokens for secure clinic responses
  - Sends 3 emails: Patient confirmation, Clinic alert, Admin notification
  - Stores clinic_response_token and expires_at in database

### 2. Clinic Response System (All 3 Endpoints Working!)
- **Files:** 
  - `api/clinic/respond/[booking_ref]/confirm.ts` ✅
  - `api/clinic/respond/[booking_ref]/reject.ts` ✅
  - `api/clinic/respond/[booking_ref]/alternatives.ts` ✅
- **Status:** ✅ All CTAs working in clinic email
- **Features:**
  - **Confirm:** One-click approval, updates status to 'confirmed', notifies patient
  - **Reject:** Shows form for rejection reason, updates status to 'rejected', notifies patient
  - **Offer Alternatives:** Prompts clinic to select 3 alternative time slots, sends WhatsApp message to patient with 3 clickable buttons

### 3. Email Templates
- **File:** `api/templates/email-templates.ts`
- **Status:** ✅ Complete (7 templates)
- **Design:** Professional stacked buttons, muted colors (emerald/blue/gray)
- **Templates:**
  1. ✅ Patient booking confirmation
  2. ✅ Clinic booking alert (with Confirm/Reject/Alternatives buttons)
  3. ✅ Appointment confirmed (patient notification)
  4. ✅ Alternatives offered (patient receives 3 new time slots) - **BUTTONS HAVE 404 BUG**
  5. ✅ Booking expired (auto-expiry notification)
  6. ✅ Urgent clinic nudge (30-min warning)
  7. ✅ 24-hour appointment reminder

### 4. Notification Service
- **File:** `api/services/notification-service.ts`
- **Status:** ✅ Complete
- **Features:**
  - Unified abstraction for email + WhatsApp
  - SMTP2GO primary, Brevo fallback
  - Logs all notifications to database (JSONB field)

### 5. GitHub Actions Cron Jobs
- **Files:** `.github/workflows/*.yml`
- **Status:** ✅ Working (free alternative to Vercel Pro)
- **Jobs:**
  - `check-expired-bookings.yml` - Every 15 minutes, auto-expires pending bookings after 3 hours
  - `send-urgent-nudges.yml` - Every 10 minutes, sends 30-min warning to clinics
  - `send-appointment-reminders.yml` - Every hour, sends 24h reminder to patients with confirmed bookings

### 6. Admin Dashboard
- **File:** `src/pages/AdminDashboard.tsx`, `api/admin/dashboard.ts`
- **Status:** ✅ Working nicely
- **Features:**
  - Date range filter
  - Real-time booking statistics
  - Status breakdown (pending/confirmed/rejected/expired)
  - Unified response format

### 7. Security & Token System
- **Status:** ✅ Complete
- **Implementation:**
  - HMAC-SHA256 tokens for clinic responses
  - Tokens use `clinic.id` for verification (matches response endpoints)
  - X-Cron-Secret header for cron endpoint protection (Vercel strips Authorization headers)
  - Cancel tokens for patient cancellations

### 8. Database Schema
- **Table:** `appointment_bookings`
- **Status:** ✅ Complete (21 columns, 7 indexes, 2 triggers, 1 FK)
- **Key Fields:**
  - `booking_ref` - Unique identifier (APT-2026-XXXXXX)
  - `status` - pending/confirmed/rejected/expired/cancelled/completed
  - `clinic_response_token` - HMAC token for verification
  - `expires_at` - Auto-expiry timestamp (3 hours default, +60 min if alternatives offered)
  - `nudge_30min_sent` - Boolean flag to prevent duplicate nudges
  - `reminder_24h_sent` - Boolean flag to prevent duplicate reminders
  - `notifications_sent` - JSONB log of all notifications

---

## 🔄 WORK IN PROGRESS

### 1. Alternative Time Slots - Patient Acceptance (404 BUG)
- **Issue:** When patient clicks on alternative time slots in email, gets 404 error
- **Expected Behavior:** Patient should be able to accept one of the 3 alternative slots
- **Files to Check:**
  - `api/templates/email-templates.ts` - `alternativesOffered` template (check button URLs)
  - Need to create: `api/patient/accept-alternative.ts` endpoint (likely missing!)
- **Status:** 🔴 BLOCKING - Patient cannot respond to alternatives

---

## 🚧 NEXT STEPS / OUTSTANDING ISSUES

### 1. After-Hours Booking Logic (Business Rule Issue)
- **Problem:** User books at 7 PM after office hours → 3-hour expiry = 10 PM → Clinic doesn't see email until next morning → Auto-expired
- **Current Behavior:**
  - Booking created at 19:00 → expires_at = 22:00
  - Urgent nudge sent at 21:30 (30 min before expiry)
  - Auto-expires at 22:00 if clinic doesn't respond
  - Clinic opens at 09:00 next day → booking already expired
- **Possible Solutions:**
  - Option A: Pause expiry timer during non-business hours (8 AM - 6 PM only)
  - Option B: Extend expiry to next business day if booked after hours
  - Option C: Set minimum expiry to "next business day 12 PM" for after-hours bookings
  - Option D: Accept the limitation, communicate clearly to patients
- **Decision Needed:** Which approach to implement?

### 2. Messaging Consistency (24 Hours vs 3 Hours)
- **Discrepancy:**
  - **Patient email says:** "We will contact you within 24 hours"
  - **Clinic has:** 3 hours to respond before auto-expiry
  - **Auto-expiry happens:** After 3 hours of no clinic response
- **Why This Exists:**
  - 24 hours = Buffer for patient expectations (conservative promise)
  - 3 hours = Urgent response needed from clinic (operational reality)
  - Creates safety margin: Clinic responds in 3h → Patient receives confirmation within 24h
- **Is This OK?** 
  - ✅ Good: Under-promise, over-deliver (respond faster than promised)
  - ❌ Bad: Confusing if patient sees booking expired in 3h but was told 24h
- **Recommendation:**
  - Keep 3-hour clinic expiry (drives urgency)
  - Change patient message to "We will confirm your appointment within 3-6 hours"
  - Or: Keep 24h promise but add "We aim to respond within a few hours"

### 3. WhatsApp Notifications
- **Status:** ✅ Meta-approved and wired into the runtime
- **Code Ready:** NotificationService supports WhatsApp channel
- **Current State:** WhatsApp templates and send paths are aligned with the latest approved manifest
- **Next Step:** Run live smoke tests and monitor delivery logs

### 4. Patient Alternative Acceptance Endpoint
- **Status:** Implemented via the unified patient response route
- **Handler:** `api/patient/booking-response.ts`
- **Features:**
  - Verifies stuffed query parameters and HMAC tokens
  - Updates booking with the selected alternative slot
  - Sends patient and clinic notifications
  - Extends expiry when alternatives are offered

---

## 🗂️ FILE INVENTORY

### Core Booking Files
- ✅ `api/send-appointment-confirmation/index.ts` (577 lines)
- ✅ `api/clinic/respond/[booking_ref]/confirm.ts` (291 lines)
- ✅ `api/clinic/respond/[booking_ref]/reject.ts` (337 lines)
- ✅ `api/clinic/respond/[booking_ref]/alternatives.ts` (519 lines)
- ❌ `api/patient/accept-alternative.ts` (MISSING - needs creation)
- ✅ `api/cancel-appointment.ts` (patient cancellation)

### Services & Templates
- ✅ `api/services/notification-service.ts` (390 lines)
- ✅ `api/templates/email-templates.ts` (410 lines, 7 templates)
- ✅ `api/templates/whatsapp-templates.ts` (ready for Meta approval)

### Cron Jobs
- ✅ `api/cron/check-expired-bookings.ts`
- ✅ `api/cron/send-urgent-nudges.ts`
- ✅ `api/cron/send-appointment-reminders.ts`

### GitHub Actions
- ✅ `.github/workflows/check-expired-bookings.yml`
- ✅ `.github/workflows/send-urgent-nudges.yml`
- ✅ `.github/workflows/send-appointment-reminders.yml`

### Admin Dashboard
- ✅ `api/admin/dashboard.ts`
- ✅ `src/pages/AdminDashboard.tsx`

### Configuration
- ✅ `vercel.json` (cron section removed, using GitHub Actions)
- ✅ `.env.example` (template for environment variables)

---

## 🔧 ENVIRONMENT VARIABLES REQUIRED

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Email (SMTP2GO primary)
SMTP2GO_API_KEY=api-1458CEFCE51D46BD8C69C9C70AA19941
SMTP_USER=contact@orachope.org
BREVO_API_KEY=xxx (fallback)

# Security
HMAC_SECRET=xxx (for clinic response tokens)
CANCEL_SECRET=xxx (for patient cancellation tokens)
CRON_SECRET=CRON_TEST_12345_ABCDEFGHIJKLMNOP (for GitHub Actions authentication)

# WhatsApp (future)
WHATSAPP_PHONE_ID=xxx
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_BUSINESS_ACCOUNT_ID=xxx
```

---

## 🧪 TEST DATA

- **Test Clinic:** ID 223, "TEST CLINIC - DO NOT BOOK"
- **Clinic Email:** gohseowping@gmail.com
- **Clinic WhatsApp:** +6582229202
- **Latest Booking:** APT-2026-000015 (or higher)
- **Test User:** gohseowping@gmail.com / +65 82229202

---

## 📈 RECENT COMMITS (Last 7 Days)

```
d4157e3 - Debug: Add logging for clinic response URLs
aa6c110 - Fix: Improve button design + Fix token verification bug
4a6c9ef - Fix: Add action buttons to clinic emails (Confirm/Reject/Alternatives)
69dafdf - Fix: Replace .single() with .limit(1) to handle ILIKE results properly
7eb5035 - Fix: Move bookingData extraction before clinic query
0696f3e - Fix: Use .ilike() for case-insensitive clinic name matching
f8e4483 - Fix: Remove non-existent columns from cron queries
e41fa40 - Fix: Switch to X-Cron-Secret header (Vercel strips Authorization)
cafb2e7 - Fix: Add .js extensions to ES module imports
8463dbd - Add: GitHub Actions cron workflows
```

---

## 🎯 IMMEDIATE PRIORITIES (For Next Chat)

### Priority 1: Live WhatsApp Smoke Test
**Goal:** Confirm approved templates send successfully from the deployed runtime

**Tasks:**
1. Trigger each booking workflow in production or staging
2. Verify template delivery in WhatsApp and Vercel logs
3. Confirm button clicks reach the expected endpoints
4. Watch for any template-name or token-parsing mismatches

### Priority 2: After-Hours Booking Logic (Business Decision)
**Goal:** Prevent after-hours bookings from auto-expiring before clinic sees them

**Tasks:**
1. User decides which approach (A/B/C/D above)
2. Implement chosen logic in `api/send-appointment-confirmation/index.ts`
3. Update cron jobs to respect business hours if needed
4. Test edge cases (Friday 7 PM, Saturday booking, etc.)

**Estimated Effort:** 2-4 hours (depends on complexity chosen)

### Priority 3: Update Patient Messaging (QUICK WIN)
**Goal:** Align patient expectations with actual 3-hour expiry

**Tasks:**
1. Update patient email template to say "within 3-6 hours" instead of "24 hours"
2. Add disclaimer about after-hours bookings if needed
3. Deploy and test

**Estimated Effort:** 15 minutes

---

## 💡 RECOMMENDATIONS FOR NEW THREAD

### Start with:
```
"Continue booking system development. Read context from:
/memories/repo/booking-system-status.md

Priority 1: Fix patient alternative acceptance 404 bug
- Email template sends patient to /api/patient/accept-alternative
- This endpoint doesn't exist yet, needs creation
- Should update booking with chosen alternative time
- Files: api/templates/email-templates.ts (alternativesOffered template)

Use GPT-4o for this (simple endpoint creation)."
```

### Budget-Saving Tips:
1. ✅ Read `/memories/repo/booking-system-status.md` for context (1 file vs whole conversation)
2. ✅ Use GPT-4o for simple tasks (endpoint creation, template updates)
3. ✅ Use Sonnet 4.5 only for complex logic (after-hours business rules)
4. ✅ Be specific with file paths and line numbers
5. ✅ Batch related changes together

---

## 📞 SUPPORT CONTACTS

- **Platform:** OraChope.org
- **Admin Email:** contact@orachope.org
- **Test Clinic:** gohseowping@gmail.com
- **GitHub Repo:** gohseowping/sg-smile-saver
- **Vercel Project:** sg-smile-saver

---

**Last Updated:** June 9, 2026
**Status:** Ready for new thread - Priority 1 is fixing alternative slots 404 bug

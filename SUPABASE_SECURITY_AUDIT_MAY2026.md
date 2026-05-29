# Supabase Security Audit & Remediation Plan
**Date:** May 13, 2026  
**Project:** SG-JB Dental (uzppuebjzqxeavgmwtvr)  
**Priority:** PDPA Compliance & Healthcare Data Protection

---

## 🚨 EXECUTIVE SUMMARY

**Critical Vulnerabilities Found:** 8 tables with security issues  
**Sensitive Data Exposed:** Email, phone, WhatsApp, addresses, health inquiries  
**PDPA Compliance Status:** ⚠️ NON-COMPLIANT  
**Immediate Action Required:** YES

---

## 📊 CURRENT SECURITY STATUS

### ✅ SECURE TABLES (Properly Protected)
1. **user_profiles** - Users can only view/edit their own profile
2. **consent_logs** - Users can only view their own consent history
3. **opt_out_requests** - Users can only view/create their own requests
4. **data_access_audit** - System-only insert access

### 🔴 VULNERABLE TABLES (Require Immediate Fix)

| Table | Sensitivity | Current Exposure | PDPA Risk |
|-------|-------------|------------------|-----------|
| **waitlist_signups** | HIGH | Anyone can read ALL emails & phones | CRITICAL |
| **partner_applications** | HIGH | All auth users can read emails, phones, addresses | CRITICAL |
| **sg_clinic_inquiries** | HIGH | All auth users can read patient emails & WhatsApp | CRITICAL |
| **opt_out_reports** | HIGH | Anyone can read ALL reports with contact info | CRITICAL |
| **clinic_claims** | MEDIUM | Anyone can read clinic contact emails & phones | HIGH |
| **appointment_bookings** | HIGH | Only own bookings (GOOD) but email-based auth weakness | MEDIUM |
| **clinics_data** | LOW | Public read (acceptable - business directory) | LOW |
| **booking_ref_counter** | LOW | No access policies (locked down) | LOW |

---

## 🎯 ADMIN USER DEFINITION - OPTIONS & RECOMMENDATIONS

### Option 1: Email-Based Admin (SIMPLEST) ⭐ RECOMMENDED FOR NOW

**How it works:**
- Hardcode specific admin email addresses
- Check using: `auth.jwt() ->> 'email' IN ('your@email.com', 'admin2@email.com')`

**Pros:**
- ✅ Immediate implementation (no schema changes)
- ✅ No additional tables or complexity
- ✅ Easy to understand and audit
- ✅ Works with current Supabase Auth setup

**Cons:**
- ❌ Requires migration file changes to add/remove admins
- ❌ Not scalable beyond 5-10 admins
- ❌ Email change = lose admin access
- ❌ Hardcoded emails in database policies

**Best for:** Small teams (1-5 admins), quick deployment

---

### Option 2: JWT Role Claim (FLEXIBLE) ⭐ RECOMMENDED FOR GROWTH

**How it works:**
- Set custom claim `role: 'admin'` in user metadata during signup/update
- Check using: `auth.jwt() ->> 'role' = 'admin'`
- Already partially implemented in your migrations!

**Pros:**
- ✅ Dynamic role assignment (no migration needed to change admins)
- ✅ Can be set via Supabase Dashboard or API
- ✅ Supports multiple roles (admin, clinic_staff, partner, etc.)
- ✅ Already used in some of your policies

**Cons:**
- ❌ Requires backend code to set user metadata
- ❌ Must update user metadata when promoting/demoting users
- ❌ Need separate admin management UI

**Best for:** Growing teams, multi-role systems

**Implementation:**
```typescript
// When creating/updating an admin user
await supabase.auth.admin.updateUserById(userId, {
  user_metadata: { role: 'admin' }
});
```

---

### Option 3: Admin Table (ENTERPRISE-GRADE)

**How it works:**
- Create `admin_users` table with user_id
- Check using: `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`

**Pros:**
- ✅ Centralized admin management
- ✅ Can add admin-specific fields (permissions, department, etc.)
- ✅ Audit trail of who became admin when
- ✅ Can implement granular permissions

**Cons:**
- ❌ Additional table to maintain
- ❌ Join queries in every RLS policy (slight performance impact)
- ❌ More complex setup
- ❌ Overkill for small teams

**Best for:** Large organizations, complex permission systems

---

### Option 4: Email Domain-Based (ORGANIZATION-WIDE)

**How it works:**
- Allow all users from specific domain (e.g., @orachope.org)
- Check using: `SPLIT_PART(auth.jwt() ->> 'email', '@', 2) = 'orachope.org'`

**Pros:**
- ✅ Automatic admin access for all company emails
- ✅ No manual user management
- ✅ Easy onboarding for new employees

**Cons:**
- ❌ All employees become admins (too broad)
- ❌ Can't have non-admin company employees
- ❌ Security risk if email domain is compromised
- ❌ Not suitable for sensitive healthcare data

**Best for:** Internal company tools only (NOT recommended for healthcare)

---

## 🏥 RECOMMENDED SECURITY MODEL FOR PDPA COMPLIANCE

### **Immediate Recommendation: Option 2 (JWT Role Claim)**

**Why this approach:**
1. ✅ Already partially implemented in your codebase
2. ✅ Flexible enough for future growth
3. ✅ PDPA-compliant with proper role segregation
4. ✅ Can combine with email verification for specific sensitive operations

---

## 🔐 TABLE-BY-TABLE SECURITY RECOMMENDATIONS

### 1. **waitlist_signups** (Email, Mobile)

**Current Policy:**
```sql
-- ❌ INSECURE: Anyone can read all signups
CREATE POLICY "Allow read access to waitlist signups" 
  ON public.waitlist_signups FOR SELECT USING (true);
```

**Recommended Policy Options:**

#### Option A: Admin-Only Access ⭐ MOST SECURE
```sql
-- ✅ Only admins can view, users can only insert
CREATE POLICY "Admin can view waitlist signups" 
  ON public.waitlist_signups FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Pros:**
- ✅ Full PDPA compliance
- ✅ Minimal data exposure
- ✅ Users can still sign up (INSERT policy separate)

**Cons:**
- ❌ Users can't view their own submission
- ❌ No self-service "check status" feature

---

#### Option B: Own-Record Access ⭐ USER-FRIENDLY
```sql
-- ✅ Users can view own signup, admins view all
CREATE POLICY "View own waitlist signup" 
  ON public.waitlist_signups FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = email
  );
```

**Pros:**
- ✅ Users can check their submission status
- ✅ PDPA-compliant (users control their data)
- ✅ Better UX

**Cons:**
- ❌ Slightly more complex policy
- ❌ Authenticated access required to view own signup

**VERDICT:** Use **Option B** (better UX + PDPA compliant)

---

### 2. **partner_applications** (Email, Phone, Address, Clinic Details)

**Current Policy:**
```sql
-- ❌ INSECURE: All authenticated users can read ALL applications
CREATE POLICY "Allow reading partner applications" 
  ON public.partner_applications FOR SELECT 
  TO authenticated USING (true);
```

**Recommended Policy:**
```sql
-- ✅ Only admins + submitter can view
CREATE POLICY "View own partner application" 
  ON public.partner_applications FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = email
  );
```

**Pros:**
- ✅ Partners can track their application status
- ✅ Admins can review all applications
- ✅ PDPA-compliant data segregation

**Cons:**
- ❌ None significant

**VERDICT:** **MUST IMPLEMENT** - Critical healthcare business data

---

### 3. **sg_clinic_inquiries** (User Email, WhatsApp, Health Inquiries)

**Current Policy:**
```sql
-- ❌ INSECURE: All authenticated users can view ALL inquiries
CREATE POLICY "Allow authenticated users to view inquiries"
  ON public.sg_clinic_inquiries FOR SELECT 
  TO authenticated USING (true);
```

**Recommended Policy:**
```sql
-- ✅ Only admins + inquiry submitter can view
CREATE POLICY "View own clinic inquiries" 
  ON public.sg_clinic_inquiries FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = user_email OR
    (user_whatsapp IS NOT NULL AND auth.jwt() ->> 'phone' = user_whatsapp)
  );
```

**Special Consideration - Clinic Staff Access:**

If clinics need to view inquiries directed to them:
```sql
-- ✅ Option: Clinic-specific access
CREATE POLICY "Clinics view their own inquiries" 
  ON public.sg_clinic_inquiries FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = user_email OR
    (auth.jwt() ->> 'role' = 'clinic_staff' AND 
     auth.jwt() ->> 'clinic_id'::int = clinic_id)
  );
```

**Pros:**
- ✅ Patient privacy protected (PDPA critical)
- ✅ Patients can view their inquiry history
- ✅ Clinics only see relevant inquiries

**Cons:**
- ❌ Requires clinic staff role implementation
- ❌ More complex if using WhatsApp-only auth

**VERDICT:** **CRITICAL - HIGHEST PRIORITY** (contains health-related inquiries)

---

### 4. **opt_out_reports** (Email, Phone, Clinic Name, Description)

**Current Policy:**
```sql
-- ❌ INSECURE: Anyone can view all reports
CREATE POLICY "Users can view their own reports" 
  ON public.opt_out_reports FOR SELECT USING (true);
```

**Recommended Policy:**
```sql
-- ✅ Only admins + reporter can view
CREATE POLICY "View own opt-out reports" 
  ON public.opt_out_reports FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = email
  );
```

**Pros:**
- ✅ PDPA compliant (users control their data access requests)
- ✅ Privacy of complaints protected
- ✅ Admins can process all reports

**Cons:**
- ❌ None significant

**VERDICT:** **MUST IMPLEMENT** - PDPA requires secure opt-out mechanisms

---

### 5. **clinic_claims** (Contact Email, Phone, Clinic Details)

**Current Policy:**
```sql
-- ❌ INSECURE: Anyone can view all claims
CREATE POLICY "Users can view all claims" 
  ON public.clinic_claims FOR SELECT USING (true);
```

**Recommended Policy:**
```sql
-- ✅ Only admins + claimant can view
CREATE POLICY "View own clinic claims" 
  ON public.clinic_claims FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' = contact_email
  );
```

**Pros:**
- ✅ Protects clinic contact information
- ✅ Prevents competitors from seeing claim details
- ✅ Claimants can track status

**Cons:**
- ❌ None significant

**VERDICT:** **IMPLEMENT** - Moderate priority

---

### 6. **appointment_bookings** (Email, WhatsApp, Treatment Type)

**Current Status:** ✅ Already secure (users view own bookings)

**Current Policy:**
```sql
CREATE POLICY "Users can view own bookings by email" 
  ON public.appointment_bookings FOR SELECT 
  USING (
    (auth.jwt() ->> 'email' = email) OR 
    (auth.jwt() ->> 'role' = 'admin')
  );
```

**Recommendation:** ✅ **KEEP AS IS** - Already PDPA compliant

**Enhancement (Optional):**
Add clinic staff access if needed:
```sql
-- Clinic staff can view bookings for their clinic
USING (
  auth.jwt() ->> 'email' = email OR 
  auth.jwt() ->> 'role' = 'admin' OR
  (auth.jwt() ->> 'role' = 'clinic_staff' AND 
   auth.jwt() ->> 'clinic_location' = clinic_location)
);
```

---

### 7. **clinics_data** (Public Directory Information)

**Current Policy:**
```sql
-- ✅ ACCEPTABLE: Public business directory
CREATE POLICY "Allow public read access to clinics data" 
  ON public.clinics_data FOR SELECT USING (true);
```

**Recommendation:** ✅ **KEEP AS IS** - Public business information

**Justification:**
- Clinic names, addresses, services = public business info
- Similar to Google Maps, Yellow Pages
- NOT personal data under PDPA
- Website URLs already public
- Ratings aggregated (no individual patient data)

---

## 🛡️ PDPA COMPLIANCE REQUIREMENTS

### What PDPA Requires for Healthcare Data:

1. **Data Minimization** ✅
   - Only collect necessary data
   - Already implemented in your schema

2. **Access Control** ❌ FAILING
   - Individuals can access ONLY their own data
   - Currently: Multiple tables allow unauthorized access

3. **Purpose Limitation** ✅
   - Data used only for stated purpose
   - Already documented in consent logs

4. **Accuracy** ✅
   - Users can update their own data
   - Already implemented in policies

5. **Retention** ⚠️ NEEDS REVIEW
   - Delete data when no longer needed
   - Recommend: Implement data retention policies

6. **Security** ❌ FAILING
   - Protect against unauthorized access
   - Currently: RLS policies too permissive

7. **Accountability** ⚠️ PARTIAL
   - Track who accesses what data
   - data_access_audit table exists but not fully utilized

---

## 📋 IMPLEMENTATION PRIORITY MATRIX

| Priority | Table | Risk Level | Action Required | Timeline |
|----------|-------|------------|-----------------|----------|
| **P0 - CRITICAL** | sg_clinic_inquiries | CRITICAL | Fix RLS immediately | Within 24h |
| **P0 - CRITICAL** | appointment_bookings | MEDIUM | Review & verify policy | Within 24h |
| **P1 - HIGH** | partner_applications | HIGH | Fix RLS | Within 48h |
| **P1 - HIGH** | opt_out_reports | HIGH | Fix RLS | Within 48h |
| **P1 - HIGH** | waitlist_signups | HIGH | Fix RLS | Within 48h |
| **P2 - MEDIUM** | clinic_claims | MEDIUM | Fix RLS | Within 1 week |
| **P3 - LOW** | clinics_data | LOW | Keep as-is | No action |
| **P3 - LOW** | booking_ref_counter | LOW | Keep as-is | No action |

---

## 🎯 RECOMMENDED ADMIN SETUP

### Step 1: Define Your Admin Email
**Who should be admin?**
- Your email: _____________________________ (fill in)
- Additional admins: _____________________________ (fill in)

### Step 2: Choose Admin Method
**Recommended: JWT Role Claim**

To make yourself admin:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user account
3. Click to edit
4. In "User Metadata" add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save changes

### Step 3: Set Admin Email in Functions
Update your API functions that send admin emails:
- Current admin email: `contact@orachope.org`
- Verify this is correct in files:
  - `/api/send-partner-confirmation/index.ts`
  - `/api/send-appointment-confirmation/index.ts`
  - `/api/cancel-appointment/index.ts`

---

## 📝 NEXT STEPS - ACTION PLAN

### Phase 1: Immediate (Next 24-48 hours)
1. ✅ Review this document
2. ⬜ Confirm admin email(s)
3. ⬜ Set admin role in Supabase Dashboard
4. ⬜ Test admin access (login and verify JWT contains role)
5. ⬜ Apply RLS migration (I'll create this file)
6. ⬜ Test each table's access control

### Phase 2: Short-term (Next week)
1. ⬜ Implement data retention policies
2. ⬜ Enhance audit logging for sensitive operations
3. ⬜ Create admin dashboard for managing access
4. ⬜ Document security procedures

### Phase 3: Long-term (Next month)
1. ⬜ Regular security audits (monthly)
2. ⬜ Implement automated PDPA compliance checks
3. ⬜ User data export functionality (PDPA right to portability)
4. ⬜ Automated data deletion for closed accounts

---

## 🔍 QUESTIONS FOR YOU TO ANSWER

Before I create the fix migration file, please confirm:

1. **Admin Users:**
   - What email(s) should have admin access?
   - Do you want to use JWT role claims (recommended) or hardcoded emails?

2. **User Access:**
   - Should users be able to view their own waitlist signup status? (Yes/No)
   - Should users be able to view their own partner application status? (Yes/No)

3. **Clinic Staff (Future):**
   - Will clinic staff need access to view inquiries/bookings for their clinic?
   - If yes, should we implement clinic_staff role now or later?

4. **Data Retention:**
   - How long should you keep appointment bookings after completion? (30/60/90 days?)
   - How long should you keep waitlist signups? (6 months/1 year?)

---

## 💾 READY-TO-APPLY FIX

Once you answer the questions above, I will create:
1. **Migration file** with all RLS policy fixes
2. **Testing script** to verify security
3. **Admin setup guide** with step-by-step instructions
4. **Rollback plan** in case of issues

---

**Questions? Need clarification on any recommendation?**

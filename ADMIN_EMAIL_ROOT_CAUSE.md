# 🎯 ADMIN EMAIL ROOT CAUSE ANALYSIS
**Date:** August 11, 2026  
**Issue:** Admin emails failing while patient/clinic emails work  

---

## **THE REAL PROBLEM: TWO EMAIL SYSTEMS**

### **System 1: NotificationService (WORKS ✅)**
**Location:** `services/notification-service.ts`  
**Used By:** Patient & Clinic notifications  
**Email Logic:**
```typescript
// Line 347-399
private async sendEmail(...) {
  const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;

  // Try SMTP2GO first
  if (smtp2goApiKey) {
    const response = await fetch('smtp2go api...');
    if (response.ok) return success; // ✅ WORKS if SMTP2GO valid
  }

  // FALLBACK to Brevo
  if (brevoApiKey) {
    const response = await fetch('brevo api...');
    if (response.ok) return success; // ✅ WORKS if Brevo valid
  }

  throw new Error('Failed via all providers');
}
```

**Result:** Works because **BREVO_API_KEY is valid** (even if SMTP2GO broken)

---

### **System 2: OraHopeEmailService (FAILS ❌)**
**Location:** `lib/notifications/inquiry-handler.ts`  
**Used By:** Admin inquiry & partner signup emails  
**Email Logic:**
```typescript
// Line 10-50
class OraHopeEmailService {
  async sendMail(...) {
    const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
    
    if (smtp2goApiKey) {
      const response = await fetch('smtp2go api...');
      if (response.ok) return success;
      else throw new Error("SMTP2GO failed"); // ❌ THROWS ERROR
    } else {
      throw new Error("SMTP2GO_API_KEY not configured"); // ❌ THROWS ERROR
    }
    
    // NO BREVO FALLBACK!
  }
}
```

**Result:** Fails because **NO FALLBACK TO BREVO**

---

## **WHY PATIENT/CLINIC EMAILS WORK**

```
Patient books → NotificationService.notify() 
              → sendEmail() 
              → Try SMTP2GO (fails or invalid)
              → Fall back to Brevo ✅ SUCCESS
              → Email delivered!
```

**Notifications that work:**
- ✅ Booking confirmations (patient)
- ✅ Booking alerts (clinic)
- ✅ Urgent nudges (clinic)
- ✅ 24h reminders
- ✅ Expired notices
- ✅ Alternative slots offered

**Why:** All use `NotificationService` with Brevo fallback

---

## **WHY ADMIN EMAILS FAIL**

```
New inquiry → inquiryHandler() 
           → OraHopeEmailService.sendMail()
           → Check SMTP2GO_API_KEY
           → Invalid or missing
           → throw Error("SMTP2GO_API_KEY not configured") ❌ FAILS
           → NO BREVO FALLBACK
           → Email NOT sent!
```

**Notifications that fail:**
- ❌ Inquiry notifications (admin)
- ❌ Partner signup notifications (admin)

**Why:** Use `OraHopeEmailService` with NO Brevo fallback

---

## **VERIFICATION: Check Vercel Logs**

If admin inquiry/partner submitted, look for:
```
=== SENDING EMAIL VIA HTTP API ===
SMTP2GO_API_KEY at runtime: missing  ← PROBLEM!
Failed to send email: Error: SMTP2GO_API_KEY not configured
```

OR:
```
SMTP2GO_API_KEY at runtime: present
SMTP2Go response: 401 Invalid API key  ← PROBLEM!
Failed to send email: Error: SMTP2GO failed: ...
```

---

## **WHAT ABOUT CANCELLATION EMAILS?**

Let me check `api/cancel-appointment/index.ts`...

**Code at line 43-68:**
```typescript
async function sendAdminCancellationEmail(...) {
  const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  
  if (smtp2goApiKey) {
    await fetch('smtp2go...');
  }
  
  if (brevoApiKey) {
    await fetch('brevo...');
  }
}
```

**Status:** ✅ **HAS BREVO FALLBACK** → Should work!

---

## **THE FIX: Add Brevo Fallback to OraHopeEmailService**

### **Option 1: Quick Fix (Add Brevo fallback)**

```typescript
// In lib/notifications/inquiry-handler.ts
class OraHopeEmailService {
  async sendMail(options) {
    const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    // Try SMTP2GO first
    if (smtp2goApiKey) {
      try {
        const response = await fetch('smtp2go...');
        if (response.ok) return { success: true };
      } catch (error) {
        console.log('SMTP2GO failed, trying Brevo...');
      }
    }
    
    // FALLBACK to Brevo
    if (brevoApiKey) {
      const response = await fetch('brevo...');
      if (response.ok) return { success: true };
    }
    
    throw new Error('Failed via all providers');
  }
}
```

### **Option 2: Better Fix (Use NotificationService everywhere)**

**Problem:** You have duplicate email logic in 3 places:
1. `services/notification-service.ts` (has fallback ✅)
2. `lib/notifications/inquiry-handler.ts` (no fallback ❌)
3. `api/cancel-appointment/index.ts` (has fallback ✅)

**Solution:** Refactor to use `NotificationService` for ALL emails

**Benefits:**
- Single source of truth
- Consistent error handling
- Automatic fallback logic
- Easier maintenance

---

## **IMMEDIATE ACTION**

1. **Check Vercel environment variables:**
   - Is `SMTP2GO_API_KEY` set? (probably invalid/placeholder)
   - Is `BREVO_API_KEY` set? (probably VALID ✅ - that's why patient/clinic emails work)

2. **Quick fix:** Add Brevo fallback to `OraHopeEmailService`

3. **Long-term:** Refactor to use `NotificationService` for all emails

---

## **SUMMARY**

| Email Type | Service Used | Has Brevo Fallback? | Status |
|------------|--------------|---------------------|--------|
| Patient booking | NotificationService | ✅ YES | ✅ Works |
| Clinic alerts | NotificationService | ✅ YES | ✅ Works |
| 24h reminders | NotificationService | ✅ YES | ✅ Works |
| Urgent nudges | NotificationService | ✅ YES | ✅ Works |
| **Inquiries (admin)** | OraHopeEmailService | ❌ NO | ❌ Fails |
| **Partner signup (admin)** | OraHopeEmailService | ❌ NO | ❌ Fails |
| Cancellations (admin) | Direct API call | ✅ YES | ✅ Works |

**Root Cause:** `OraHopeEmailService` doesn't fall back to Brevo when SMTP2GO fails

**Why you didn't know:** Patient/clinic emails kept working via Brevo, masking the SMTP2GO issue

**Fix:** Add Brevo fallback to OraHopeEmailService OR use NotificationService everywhere

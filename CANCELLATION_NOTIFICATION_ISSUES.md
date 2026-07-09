# Cancellation & Notification Issues - Analysis & Fix Proposal
**Date:** July 9, 2026  
**Status:** 🔍 Issues Verified | 🔧 Fixes Required

---

## 🚨 CONFIRMED ISSUES

### **Issue 1: WhatsApp Cancel Button - Broken** ❌
**Location:** WhatsApp appointment_reminder_24h template  
**Root Cause:** Missing base URL configuration in notification service

**Current Implementation:**
- WhatsApp template sends: `cancel_ref_payload = "REF001&email=user@email.com&token=abc123"`
- Meta template should have base URL: `https://www.orachope.org/api/cancel-appointment?token={{1}}`
- **PROBLEM:** `appointment_reminder_24h` is NOT in the `urlTemplates` object in `notification-service.ts`

**Code Location:** `services/notification-service.ts` line 177-200

**What's Missing:**
```typescript
const urlTemplates: Record<string, string> = {
  // ... existing templates ...
  
  // MISSING THIS ENTRY:
  // appointment_reminder_24h: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',
};
```

**Impact:** 
- WhatsApp cancel button may not work at all
- OR constructs malformed URLs
- Users cannot cancel from WhatsApp reminder

**Evidence:**
1. User reports: "Cancel does not work. Link seems to be broken for both email and whatsapp"
2. Template exists in `whatsapp-templates.ts` (line 320)
3. No entry in `getFirstButtonBaseSegment()` method
4. Second button normalization fails → wrong URL generated

---

### **Issue 2: No Clinic Notification on Cancellation** ❌
**Location:** `api/cancel-appointment/index.ts`  
**Root Cause:** Only admin email sent, no clinic notification

**Current Behavior:**
When patient cancels appointment:
1. ✅ Booking status updated to 'cancelled' in database
2. ✅ Admin email sent to `contact@orachope.org`
3. ❌ **NO email sent to clinic**
4. ❌ **NO WhatsApp sent to clinic**

**Code Evidence:**
```typescript
// api/cancel-appointment/index.ts line 33-66
async function sendAdminCancellationEmail(params: { booking: any; ref: string; email: string; reason?: string }) {
  const { booking, ref, email, reason } = params;
  // ...
  const admin = 'contact@orachope.org';  // ⚠️ Only sends to admin!
  // ...
}
```

**Missing:**
- No template exists for `booking_cancelled_clinic` (email)
- No template exists for `booking_cancelled_clinic` (WhatsApp)
- No NotificationService call to clinic in cancel endpoint

**Impact:**
- Clinics don't know when patients cancel
- Clinics waste time preparing for cancelled appointments
- Poor clinic experience
- Missed opportunity to fill cancelled slots

---

## 📋 DETAILED ANALYSIS

### **Analysis 1: WhatsApp Button Configuration**

**Expected Flow:**
1. Cron job generates cancel data:
   ```typescript
   cancel_ref_payload: "APT-123&email=john@email.com&token=abc123xyz"
   ```

2. WhatsApp template passes to button:
   ```typescript
   buttons: [
     data.google_maps_query,  // Button 1: Google Maps
     data.cancel_ref_payload  // Button 2: Cancel
   ]
   ```

3. Notification service should normalize to:
   ```typescript
   // Meta expects: https://www.orachope.org/api/cancel-appointment?token={{1}}
   // Where {{1}} = "APT-123&email=john@email.com&token=abc123xyz"
   // Final URL: https://www.orachope.org/api/cancel-appointment?token=APT-123&email=john@email.com&token=abc123xyz
   ```

**Actual Behavior:**
- `normalizeWhatsAppButtonValue()` is called for `appointment_reminder_24h`
- No base URL found in `urlTemplates`
- Returns raw value: `"APT-123&email=john@email.com&token=abc123xyz"`
- Meta sends malformed URL to user

**Fix Required:**
Add to `notification-service.ts` urlTemplates:
```typescript
appointment_reminder_24h: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',
```

**Also Check:** Meta WhatsApp template configuration
- Verify Button 2 base URL is: `https://www.orachope.org/api/cancel-appointment?token={{1}}`
- If not, need to update Meta template

---

### **Analysis 2: Clinic Notification Missing**

**Template Inventory:**

**Existing Email Templates:**
1. ✅ booking_confirmation_patient
2. ✅ booking_alert_clinic
3. ✅ appointment_confirmed
4. ✅ alternatives_offered
5. ✅ booking_expired
6. ✅ urgent_clinic_nudge
7. ✅ appointment_reminder_24h
8. ✅ alternative_slot_accepted_clinic
9. ❌ **booking_cancelled_clinic** - MISSING!

**Existing WhatsApp Templates:**
1. ✅ booking_request_received
2. ✅ booking_confirmation_patient
3. ✅ booking_alert_clinic
4. ✅ appointment_confirmed
5. ✅ booking_expired
6. ✅ urgent_clinic_nudge
7. ✅ alternative_accepted_clinic
8. ❌ **booking_cancelled_clinic** - MISSING!

**Required Data for Clinic Cancellation:**
```typescript
{
  booking_ref: string,
  patient_name: string,
  patient_email: string,
  patient_whatsapp: string,
  clinic_name: string,
  treatment_type: string,
  formatted_date: string,
  time_slot: string,
  cancelled_at: string,
  cancellation_reason?: string
}
```

---

## 🎯 PROPOSED SOLUTIONS

### **Fix 1: Add WhatsApp Cancel URL Template** 🔴 HIGH PRIORITY

**File:** `services/notification-service.ts`

**Change:** Add entry to urlTemplates (line ~197)

**Before:**
```typescript
const urlTemplates: Record<string, string> = {
  alternatives_offered_2slot: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
  // ... other templates ...
  booking_alert_clinic_v7: 'https://www.orachope.org/api/clinic/respond/{{1}}',
};
```

**After:**
```typescript
const urlTemplates: Record<string, string> = {
  alternatives_offered_2slot: 'https://www.orachope.org/api/patient/booking-response?token={{1}}',
  // ... other templates ...
  booking_alert_clinic_v7: 'https://www.orachope.org/api/clinic/respond/{{1}}',
  appointment_reminder_24h: 'https://www.orachope.org/api/cancel-appointment?token={{1}}',  // ADD THIS
};
```

**Time:** 2 minutes

---

### **Fix 2: Create Clinic Cancellation Email Template** 🔴 HIGH PRIORITY

**File:** `templates/email-templates.ts`

**Add New Template Function:**
```typescript
// Template 9: Booking Cancelled - Clinic Notification
const bookingCancelledClinic: EmailTemplateFunction = (data) => ({
  subject: `🚫 Appointment Cancelled - ${data.booking_ref} | ${data.clinic_name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px;">🚫 PATIENT CANCELLED APPOINTMENT</h2>
        </div>
        
        <p style="color: #374151; font-size: 16px; margin: 0 0 20px;">For: <strong>${data.clinic_name}</strong></p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">Reference: <strong>${data.booking_ref}</strong></p>
        
        <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #991b1b; margin: 0 0 15px;">Cancelled Appointment</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; font-weight: 600; color: #991b1b;">Date:</td><td style="padding: 6px 0;">${data.formatted_date}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #991b1b;">Time:</td><td style="padding: 6px 0;">${data.time_slot}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #991b1b;">Treatment:</td><td style="padding: 6px 0;">${data.treatment_type}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #991b1b;">Cancelled At:</td><td style="padding: 6px 0;">${data.cancelled_at}</td></tr>
          </table>
        </div>
        
        ${data.cancellation_reason ? `
        <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>📝 Cancellation Reason:</strong><br>${data.cancellation_reason}</p>
        </div>
        ` : ''}
        
        <h3 style="margin: 20px 0 10px; color: #374151;">Patient Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Name:</td><td style="padding: 6px 0;">${data.patient_name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">WhatsApp:</td><td style="padding: 6px 0;">${data.patient_whatsapp}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #475569;">Email:</td><td style="padding: 6px 0;">${data.patient_email}</td></tr>
        </table>
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;"><strong>ℹ️ No Action Required</strong><br>This is an FYI notification. The slot is now available for other patients.</p>
        </div>
        
        <div style="text-align: center; padding: 20px 0; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">OraChope.org | Partner Support: contact@orachope.org</p>
        </div>
      </div>
    </body>
    </html>
  `,
});
```

**Export Addition:**
```typescript
export const emailTemplates: Record<string, EmailTemplateFunction> = {
  // ... existing templates ...
  booking_cancelled_clinic: bookingCancelledClinic,  // ADD THIS
};
```

**Time:** 10 minutes

---

### **Fix 3: Create WhatsApp Clinic Cancellation Template** 🟡 MEDIUM PRIORITY

**File:** `templates/whatsapp-templates.ts`

**Add New Template:**
```typescript
// Template 10: Booking Cancelled - Clinic Notification
const bookingCancelledClinic: WhatsAppTemplateFunction = (data) => ({
  templateName: 'booking_cancelled_clinic',
  variables: [
    data.clinic_name || '',
    data.patient_name || '',
    data.booking_ref || '',
    data.formatted_date || '',
    data.time_slot || '',
    data.treatment_type || '',
    data.cancelled_at || '',
    data.cancellation_reason || 'No reason provided',
  ],
  variableNames: [
    'clinic_name',
    'patient_name',
    'booking_ref',
    'appointment_date',
    'appointment_time',
    'treatment_type',
    'cancelled_at',
    'cancellation_reason',
  ],
  buttons: [],  // No buttons needed for clinic FYI
  buttonHasVariable: [],
});
```

**Export Addition:**
```typescript
export const whatsappTemplates: Record<string, WhatsAppTemplateFunction> = {
  // ... existing templates ...
  booking_cancelled_clinic: bookingCancelledClinic,  // ADD THIS
};
```

**⚠️ IMPORTANT:** This template must be submitted to Meta WhatsApp Business for approval!

**Meta Template Configuration:**
- **Name:** `booking_cancelled_clinic`
- **Category:** UTILITY
- **Language:** English
- **Header:** Appointment Cancelled
- **Body:**
```
Hi {{clinic_name}}, 

Patient {{patient_name}} has cancelled their appointment.

📋 Booking Reference: {{booking_ref}}
📅 Date: {{appointment_date}}
🕐 Time: {{appointment_time}}
💉 Treatment: {{treatment_type}}
🚫 Cancelled At: {{cancelled_at}}

Reason: {{cancellation_reason}}

This slot is now available for other patients. No action required.
```
- **Footer:** OraChope.org
- **Buttons:** None

**Time:** 15 minutes (coding) + 3-5 days (Meta approval)

---

### **Fix 4: Update Cancel Endpoint to Notify Clinic** 🔴 HIGH PRIORITY

**File:** `api/cancel-appointment/index.ts`

**Add Function After sendAdminCancellationEmail:**
```typescript
async function sendClinicCancellationNotification(params: { 
  booking: any; 
  ref: string; 
  email: string; 
  reason?: string;
  supabase: any;
}) {
  const { booking, ref, email, reason, supabase } = params;
  
  // Get clinic details
  let clinic: any = null;
  
  if (booking.clinic_id) {
    const { data: jbClinic } = await supabase
      .from('clinics_data')
      .select('id, name, email, whatsapp_number')
      .eq('id', booking.clinic_id)
      .single();
    
    const { data: sgClinic } = await supabase
      .from('sg_clinics')
      .select('id, name, email, whatsapp_number')
      .eq('id', booking.clinic_id)
      .single();
    
    clinic = jbClinic || sgClinic;
  }
  
  if (!clinic || !clinic.email) {
    console.log('⚠️ No clinic email found for cancellation notification');
    return;
  }
  
  // Initialize notification service
  const notificationService = new NotificationService({
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
    smtpUser: process.env.SMTP_USER!,
  });
  
  // Format cancellation date
  const cancelledAt = new Date().toLocaleString('en-SG', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = new Date(booking.preferred_date).toLocaleString('en-SG', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Send notification (email + WhatsApp if available)
  const channels: ('email' | 'whatsapp')[] = ['email'];
  if (clinic.whatsapp_number) {
    channels.push('whatsapp');
  }
  
  const results = await notificationService.send(
    'booking_cancelled_clinic',
    {
      name: clinic.name,
      email: clinic.email,
      whatsapp: clinic.whatsapp_number,
    },
    {
      clinic_name: clinic.name,
      patient_name: booking.patient_name,
      patient_email: email,
      patient_whatsapp: booking.whatsapp,
      booking_ref: ref,
      treatment_type: booking.treatment_type,
      formatted_date: formattedDate,
      time_slot: booking.time_slot,
      cancelled_at: cancelledAt,
      cancellation_reason: reason || 'No reason provided',
    },
    channels
  );
  
  console.log('Clinic cancellation notification sent:', results);
}
```

**Update POST Handler (around line 180):**
```typescript
// After updating booking status to cancelled
if (booking.status !== 'cancelled') {
  const { error: updateErr } = await supabase
    .from('appointment_bookings')
    .update({ status: 'cancelled', cancelled_at: now, cancellation_reason: reason || null, updated_at: now })
    .eq('booking_ref', ref)
    .eq('email', email);
  if (updateErr) throw updateErr;
  
  // Send admin cancellation notification
  try {
    await sendAdminCancellationEmail({ booking, ref, email, reason });
  } catch (e) {
    console.error('Admin cancellation email failed', e);
  }
  
  // ADD THIS: Send clinic cancellation notification
  try {
    await sendClinicCancellationNotification({ booking, ref, email, reason, supabase });
  } catch (e) {
    console.error('Clinic cancellation notification failed', e);
  }
  
  // ... rest of response
}
```

**Also Update GET Handler (around line 220):**
```typescript
// After updating booking status to cancelled
if (booking.status !== 'cancelled') {
  const now = new Date().toISOString();
  const { error: updateErr } = await supabase
    .from('appointment_bookings')
    .update({ status: 'cancelled', cancelled_at: now, cancellation_reason: reason || null, updated_at: now })
    .eq('booking_ref', ref)
    .eq('email', email);
  if (updateErr) throw updateErr;
  
  try {
    await sendAdminCancellationEmail({ booking, ref, email, reason });
  } catch (e) { console.error('Admin cancellation email failed', e); }
  
  // ADD THIS: Send clinic cancellation notification
  try {
    await sendClinicCancellationNotification({ booking, ref, email, reason, supabase });
  } catch (e) { 
    console.error('Clinic cancellation notification failed', e); 
  }
  
  // ... rest of response
}
```

**Import Addition (top of file):**
```typescript
import { NotificationService } from '../../services/notification-service.js';
```

**Time:** 20 minutes

---

## 📊 IMPLEMENTATION PLAN

### **Phase 1: Critical WhatsApp Fix** ⚡ 30 minutes
1. ✅ Add appointment_reminder_24h URL template to notification-service.ts
2. ✅ Test WhatsApp cancel button functionality
3. ✅ Git commit + push

### **Phase 2: Clinic Email Notification** ⚡ 45 minutes
1. ✅ Create booking_cancelled_clinic email template
2. ✅ Add clinic notification function to cancel endpoint
3. ✅ Update both POST and GET handlers
4. ✅ Test email delivery to clinic
5. ✅ Git commit + push

### **Phase 3: Clinic WhatsApp Notification** 🕐 5-7 days (Meta approval)
1. ✅ Create booking_cancelled_clinic WhatsApp template (code)
2. ✅ Submit template to Meta WhatsApp Business
3. ⏳ Wait for Meta approval (3-5 business days)
4. ✅ Test WhatsApp delivery to clinic after approval
5. ✅ Git commit + push

**Total Time:** 
- Immediate fixes: ~75 minutes
- WhatsApp approval: 5-7 days

---

## ✅ TESTING CHECKLIST

### **WhatsApp Cancel Button Test:**
- [ ] Send test appointment reminder to WhatsApp
- [ ] Verify "Get Directions" button opens Google Maps
- [ ] Verify "Cancel Appointment" button opens cancel page
- [ ] Verify cancel page loads correctly with all parameters
- [ ] Complete cancellation via WhatsApp link
- [ ] Verify booking status updated to 'cancelled'

### **Clinic Email Notification Test:**
- [ ] Cancel a test booking via email link
- [ ] Verify admin email sent to contact@orachope.org
- [ ] Verify clinic email sent to clinic.email@domain.com
- [ ] Check email template rendering (all data populated)
- [ ] Verify cancellation reason included (if provided)

### **Clinic WhatsApp Notification Test (After Meta Approval):**
- [ ] Cancel a test booking
- [ ] Verify clinic receives WhatsApp message
- [ ] Check message template rendering
- [ ] Verify all variables populated correctly

---

## 🎯 SUMMARY

| Issue | Priority | Status | ETA |
|-------|----------|--------|-----|
| WhatsApp cancel button broken | 🔴 HIGH | Ready to fix | 5 min |
| No clinic email on cancellation | 🔴 HIGH | Ready to fix | 45 min |
| No clinic WhatsApp on cancellation | 🟡 MEDIUM | Needs Meta approval | 5-7 days |

**Total Implementation:** ~75 minutes + Meta approval time

---

**READY FOR YOUR APPROVAL TO PROCEED** 🚀

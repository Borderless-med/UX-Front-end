# CLINIC ACTION BUTTONS FIX - SUMMARY

## Problem Statement
**Current State:** Clinic emails are being sent, but WITHOUT action buttons
**Expected State:** Clinics should be able to click "Confirm" / "Reject" / "Offer Alternatives" directly in the email

## Root Cause
The `send-appointment-confirmation/index.ts` endpoint is using hardcoded HTML instead of the proper `bookingAlertClinic` email template that includes action buttons.

## What's Missing from Current Email
❌ No "✅ CONFIRM APPOINTMENT" button
❌ No "❌ REJECT BOOKING" button  
❌ No "🔄 OFFER ALTERNATIVES" button
❌ No HMAC-secured response URLs
❌ No "ACTION REQUIRED WITHIN 3 HOURS" warning
❌ No auto-expiry countdown

## What Currently Exists (Working)
✅ Patient details displayed
✅ Appointment details displayed
✅ "Contact Patient via WhatsApp" button
✅ Clinic email lookup working (fixed!)
✅ Email delivery working

## Solution Required

### Step 1: Import NotificationService
Add at top of `send-appointment-confirmation/index.ts`:
```typescript
import { NotificationService } from '../services/notification-service.js';
```

### Step 2: Initialize NotificationService
After Supabase setup:
```typescript
const notificationService = new NotificationService({
  supabase,
  smtpUser: SMTP_USER!,
});
```

### Step 3: Generate HMAC Tokens for Response URLs
After saving booking to database:
```typescript
const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
const token = crypto
  .createHmac('sha256', HMAC_SECRET)
  .update(`${bookingRef}|${clinicEmail || bookingData.clinic_location}`)
  .digest('hex')
  .slice(0, 32);

const baseUrl = 'https://orachope.org/api/clinic/respond';
const confirmUrl = `${baseUrl}/${bookingRef}/confirm?token=${token}`;
const rejectUrl = `${baseUrl}/${bookingRef}/reject?token=${token}`;
const alternativesUrl = `${baseUrl}/${bookingRef}/alternatives?token=${token}`;
```

### Step 4: Calculate Expiry Time
```typescript
const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now
const formattedExpiryTime = expiresAt.toLocaleTimeString('en-SG', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
```

### Step 5: Replace Hardcoded Email with NotificationService
Replace the entire `clinicEmailHtml` variable and email sending logic with:
```typescript
if (clinicEmail) {
  // Send via NotificationService using proper template
  const clinicNotificationResults = await notificationService.send(
    'booking_alert_clinic',
    {
      name: bookingData.clinic_location,
      email: clinicEmail,
      whatsapp: clinicWhatsApp,
    },
    {
      clinic_name: bookingData.clinic_location,
      booking_ref: bookingRef,
      patient_name: bookingData.patient_name,
      patient_email: bookingData.email,
      patient_whatsapp: bookingData.whatsapp,
      treatment_type: bookingData.treatment_type,
      formatted_date: formattedDate,
      time_slot: bookingData.time_slot,
      expires_at: formattedExpiryTime,
      confirm_url: confirmUrl,
      reject_url: rejectUrl,
      alternatives_url: alternativesUrl,
    },
    ['email'] // Only email for now, add 'whatsapp' later if needed
  );

  // Log notification
  await notificationService.logNotification(
    bookingRef,
    'booking_alert_clinic',
    clinicNotificationResults
  );
  
  console.log(`✅ Clinic notification sent to: ${clinicEmail}`);
}
```

## Files to Modify
1. `api/send-appointment-confirmation/index.ts` - Replace clinic email logic (lines ~365-460)

## Files Already Correct (No Changes Needed)
✅ `api/templates/email-templates.ts` - bookingAlertClinic template is perfect
✅ `api/services/notification-service.ts` - Working correctly
✅ `api/clinic/respond/[booking_ref]/confirm.ts` - Already handles responses
✅ `api/clinic/respond/[booking_ref]/reject.ts` - Already handles responses
✅ `api/clinic/respond/[booking_ref]/alternatives.ts` - Already handles responses

## Environment Variables Required
Ensure `.env` has:
```
HMAC_SECRET=your-secret-key-here
```

## Testing After Fix
1. Create new test booking
2. Check clinic email (gohseowping@gmail.com)
3. Verify 3 action buttons appear:
   - ✅ CONFIRM APPOINTMENT (green)
   - ❌ REJECT BOOKING (red)
   - 🔄 OFFER ALTERNATIVES (blue)
4. Click "Confirm" button
5. Verify it opens response page and updates booking status

## Impact
**High Priority** - This is a core feature of the booking system. Without action buttons, clinics must manually contact patients instead of one-click responses.

## Estimated Complexity
**Medium** - Requires replacing ~100 lines of hardcoded HTML with NotificationService calls, but the pattern is well-established in other files (send-urgent-nudges.ts).

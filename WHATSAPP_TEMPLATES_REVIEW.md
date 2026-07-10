# 📱 WhatsApp Templates - Complete Review & Meta Submission Guide

**Last Updated:** June 12, 2026  
**Status:** ⚠️ NOT YET SUBMITTED TO META  
**Total Templates:** 7

---

## 🎯 TEMPLATES OVERVIEW

| # | Template Name | Category | Recipient | Buttons | Status |
|---|---------------|----------|-----------|---------|--------|
| 1 | booking_request_received | UTILITY | Patient | 1 | ✅ Submitted |
| 2 | appointment_confirmed | UTILITY | Patient | 2 | ⚠️ Not Submitted |
| 3 | alternatives_offered_1slot | UTILITY | Patient | 1 | ⚠️ Not Submitted |
| 4 | alternatives_offered_2slot | UTILITY | Patient | 2 | ⚠️ Not Submitted |
| 5 | alternatives_offered_3slot | UTILITY | Patient | 3 | ⚠️ Not Submitted |
| 6 | booking_alert_clinic | UTILITY | Clinic | 3 | ⚠️ Not Submitted |
| 7 | urgent_clinic_nudge | UTILITY | Clinic | 3 | ⚠️ Not Submitted |
| 8 | booking_expired | UTILITY | Patient | 2 | ⚠️ Not Submitted |
| 9 | appointment_reminder_24h | UTILITY | Patient | 2 | ⚠️ Not Submitted |

---

## 📋 TEMPLATE 1: Booking Request Received (Patient)

**Template Name:** `booking_request_received`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Request Received!
```

### Body
```
Hi {{patient_name}}, your appointment request has been received! 📋

Booking Reference: {{booking_ref}}

🏥 Clinic: {{clinic_name}}
📍 Address: {{clinic_address}}
💉 Treatment: {{treatment_type}}
📅 Requested Date: {{requested_date}}
🕐 Time: {{time_slot}}

Your clinic will respond within 3 hours. You'll receive a WhatsApp notification once they confirm or offer alternative times.
```

### Footer
```
OraChope.org
```

### Buttons
None (informational only)

### Variables (7)
1. `patient_name` - e.g., "John Tan"
2. `booking_ref` - e.g., "APT-000051"
3. `clinic_name` - e.g., "AllSmiles Dental"
4. `clinic_address` - e.g., "123 Jalan Maju, Johor Bahru, 80100, Malaysia"
5. `treatment_type` - e.g., "Root Canal"
6. `requested_date` - e.g., "Friday, 13 June 2026"
7. `time_slot` - e.g., "10:00 AM"



## 📋 TEMPLATE 2: Appointment Confirmed (Patient)

**Template Name:** `appointment_confirmed`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Appointment Confirmed!
```

### Body
```
Great news {{patient_name}}! 🎉

{{clinic_name}} has confirmed your appointment:

📋 Booking: {{booking_ref}}
📅 Date: {{appointment_date}}
🕐 Time: {{appointment_time}}
📍 {{clinic_address}}

🚗 Parking & transport info: orachope.org/travel

Arrive 10-15 minutes early. Safe travels! 🚗
```

### Footer
```
OraChope.org
```

### Buttons (2 CTA URL)
1. **Get Directions 📍** - URL: `{{google_maps_url}}`
2. **Cancel Appointment** - URL: `{{cancel_url}}`

⚠️ **Note:** Meta limits "Visit Website" buttons to 2 maximum per template. Travel guide is included as static URL in body.

### Variables (7)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `booking_ref` - e.g., "APT-000051"
4. `appointment_date` - e.g., "Friday, 13 June 2026"
5. `appointment_time` - e.g., "10:00 AM"
6. `clinic_address` - e.g., "123 Jalan Maju, Johor Bahru, 80100, Malaysia"
7. `google_maps_url` - Google Maps link (e.g., "https://maps.google.com/?q=1.4655,103.7578")
8. `cancel_url` - Cancellation endpoint (e.g., "https://orachope.org/api/cancel?ref=APT-000051&token=abc123")

---

## 📋 TEMPLATE 3: Alternatives Offered (1 Slot)

**Template Name:** `alternatives_offered_1slot`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Alternative Time Available
```
(Note: "Time" singular, not "Times")

### Body
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered this alternative time. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

### Footer
```
OraChope.org
```

### Buttons (1 CTA URL)
1. **{{slot1_button_text}}** (e.g., "📅 Fri 13 Jun, 10:00 AM") - URL: `{{slot1_url}}`

### Variables (6)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `original_date` - e.g., "2026-06-11"
4. `original_time` - e.g., "15:00"
5. `slot1_button_text` - e.g., "📅 Fri 13 Jun, 10:00 AM"
6. `slot1_url` - First slot confirmation endpoint

---

## 📋 TEMPLATE 4: Alternatives Offered (2 Slots)

**Template Name:** `alternatives_offered_2slot`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Alternative Times Available
```
(Note: "Times" plural)

### Body
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered these 2 alternative times. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

### Footer
```
OraChope.org
```

### Buttons (2 CTA URL)
1. **{{slot1_button_text}}** (e.g., "📅 Fri 13 Jun, 10:00 AM") - URL: `{{slot1_url}}`
2. **{{slot2_button_text}}** (e.g., "📅 Sat 14 Jun, 2:00 PM") - URL: `{{slot2_url}}`

### Variables (8)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `original_date` - e.g., "2026-06-11"
4. `original_time` - e.g., "15:00"
5. `slot1_button_text` - e.g., "📅 Fri 13 Jun, 10:00 AM"
6. `slot1_url` - First slot confirmation endpoint
7. `slot2_button_text` - e.g., "📅 Sat 14 Jun, 2:00 PM"
8. `slot2_url` - Second slot confirmation endpoint

---

## 📋 TEMPLATE 5: Alternatives Offered (3 Slots)

**Template Name:** `alternatives_offered_3slot`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Alternative Times Available
```

### Body
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered these 3 alternative times. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

### Footer
```
OraChope.org
```

### Buttons (3 CTA URL - MAXIMUM!)
1. **{{slot1_button_text}}** (e.g., "📅 Fri 13 Jun, 10:00 AM") - URL: `{{slot1_url}}`
2. **{{slot2_button_text}}** (e.g., "📅 Sat 14 Jun, 2:00 PM") - URL: `{{slot2_url}}`
3. **{{slot3_button_text}}** (e.g., "📅 Mon 16 Jun, 9:00 AM") - URL: `{{slot3_url}}`

### Variables (10)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `original_date` - e.g., "2026-06-11"
4. `original_time` - e.g., "15:00"
5. `slot1_button_text` - e.g., "📅 Fri 13 Jun, 10:00 AM"
6. `slot1_url` - First slot confirmation endpoint
7. `slot2_button_text` - e.g., "📅 Sat 14 Jun, 2:00 PM"
8. `slot2_url` - Second slot confirmation endpoint
9. `slot3_button_text` - e.g., "📅 Mon 16 Jun, 9:00 AM"
10. `slot3_url` - Third slot confirmation endpoint

---

## 📋 TEMPLATE 6: Booking Alert (Clinic)

**Template Name:** `booking_alert_clinic`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
New Booking Request
```

### Body
```
FOR: {{clinic_name}}

Booking Reference: {{booking_ref}}

Patient Details:
Name: {{patient_name}}
WhatsApp: {{patient_whatsapp}}

Treatment: {{treatment_type}}
Date: {{requested_date}}
Time: {{time_slot}}

⏰ RESPOND BY: {{expires_at}}

Choose an action below. If the original slot isn't available, offer alternatives to extend the deadline by 60 minutes.
```

### Footer
```
OraChope.org
```

### Buttons (3 CTA URL - MAXIMUM!)
1. **Confirm** - URL: `{{confirm_url}}`
2. **Reject** - URL: `{{reject_url}}`
3. **Offer Alternatives** - URL: `{{alternatives_url}}`

### Variables (11)
1. `clinic_name` - e.g., "AllSmiles Dental"
2. `booking_ref` - e.g., "APT-000051"
3. `patient_name` - e.g., "John Tan"
4. `patient_whatsapp` - e.g., "+6588104928"
5. `treatment_type` - e.g., "Root Canal"
6. `requested_date` - e.g., "Friday, 13 June 2026"
7. `time_slot` - e.g., "10:00 AM"
8. `expires_at` - e.g., "1:00 PM, Friday 13 June"
9. `confirm_url` - Confirmation endpoint
10. `reject_url` - Rejection endpoint
11. `alternatives_url` - Alternatives endpoint

---

## 📋 TEMPLATE 7: Urgent Clinic Nudge (Clinic)

**Template Name:** `urgent_clinic_nudge`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
URGENT: Respond Now
```

### Body
```
FOR: {{clinic_name}}

Booking {{booking_ref}} expires in 30 minutes! ⏰

Expiry Time: {{expires_at}}

Patient: {{patient_name}}
Treatment: {{treatment_type}}
Date: {{requested_date}}
Time: {{time_slot}}

⚡ IMPORTANT: Offering alternative times extends your deadline by 60 minutes.

Please respond immediately using one of the buttons below.
```

### Footer
```
OraChope.org
```

### Buttons (3 CTA URL)
1. **Confirm** - URL: `{{confirm_url}}`
2. **Reject** - URL: `{{reject_url}}`
3. **Offer Alternatives** - URL: `{{alternatives_url}}`

### Variables (10)
1. `clinic_name` - e.g., "AllSmiles Dental"
2. `booking_ref` - e.g., "APT-000051"
3. `expires_at` - e.g., "1:00 PM, Friday 13 June"
4. `patient_name` - e.g., "John Tan"
5. `treatment_type` - e.g., "Root Canal"
6. `requested_date` - e.g., "Friday, 13 June 2026"
7. `time_slot` - e.g., "10:00 AM"
8. `confirm_url` - Confirmation endpoint
9. `reject_url` - Rejection endpoint
10. `alternatives_url` - Alternatives endpoint

---

## 📋 TEMPLATE 8: Booking Expired (Patient)

**Template Name:** `booking_expired`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Booking Expired
```

### Body
```
Hi {{patient_name}}, we're sorry but your booking request has expired. 😔

{{clinic_name}} didn't respond within the 3-hour window.

Booking: {{booking_ref}}
Clinic: {{clinic_address}}
Treatment: {{treatment_type}}
Date: {{requested_date}}

Don't worry! You can:
• Browse other nearby clinics
• Contact our support team for help finding alternatives
```

### Footer
```
OraChope.org
```

### Buttons (2 CTA URL)
1. **Browse Clinics** - URL: `{{browse_clinics_url}}`
2. **Contact Support** - URL: `{{support_url}}`

### Variables (8)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `booking_ref` - e.g., "APT-000051"
4. `clinic_address` - e.g., "123 Jalan Maju, Johor Bahru, Malaysia"
5. `treatment_type` - e.g., "Root Canal"
6. `requested_date` - e.g., "Friday, 13 June 2026"
7. `browse_clinics_url` - e.g., "https://orachope.org/clinics?treatment=root_canal"
8. `support_url` - e.g., "https://wa.me/6588104928"

---

## 📋 TEMPLATE 9: 24-Hour Reminder (Patient)

**Template Name:** `appointment_reminder_24h`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
Reminder: Appointment Tomorrow
```

### Body
```
Hi {{patient_name}}, your appointment is in 24 hours! 📅

Clinic: {{clinic_name}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Address: {{clinic_address}}

🚗 Travel info: orachope.org/travel

💡 Tip: Arrive 10-15 minutes early. Bring your ID and any relevant medical documents.

See you soon! 👋
```

### Footer
```
OraChope.org
```

### Buttons (2 CTA URL)
1. **Get Directions 📍** - URL: `{{google_maps_url}}`
2. **Cancel Appointment** - URL: `{{cancel_url}}`

### Variables (8)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `appointment_date` - e.g., "Friday, 13 June 2026"
4. `appointment_time` - e.g., "10:00 AM"
5. `clinic_address` - e.g., "123 Jalan Maju, Johor Bahru, 80100, Malaysia"
6. `google_maps_url` - Google Maps link
7. `cancel_url` - Cancellation endpoint

## 📋 TEMPLATE 6: Urgent Clinic Nudge

**Template Name:** `urgent_clinic_nudge`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
⚠️ URGENT: Respond Now
```

### Body
```
FOR: {{1}}

Booking {{2}} expires in 30 minutes! ⏰

Expiry Time: {{3}}

Patient: {{4}}
Treatment: {{5}}
Date: {{6}}
Time: {{7}}

⚡ IMPORTANT: Offering alternative times extends your deadline by 60 minutes.

Please respond immediately using one of the buttons below.
```

### Footer
```
OraChope.org
```

### Buttons (3 CTA URL)
1. **Confirm** - URL: `{{8}}`
2. **Reject** - URL: `{{9}}`
3. **Offer Alternatives** - URL: `{{10}}`

### Variables (10)
1. `clinic_name` - e.g., "AllSmiles Dental"
2. `booking_ref` - e.g., "APT-000051"
3. `expires_at` - e.g., "1:00 PM, Friday 13 June"
4. `patient_name` - e.g., "John Tan"
5. `treatment_type` - e.g., "Root Canal"
6. `formatted_date` - e.g., "Friday, 13 June 2026"
7. `time_slot` - e.g., "10:00 AM"
8. `confirm_url` - Confirmation endpoint
9. `reject_url` - Rejection endpoint
10. `alternatives_url` - Alternatives endpoint

---

## 📋 TEMPLATE 7: 24-Hour Reminder (Patient)

**Template Name:** `appointment_reminder_24h`  
**Category:** `UTILITY`  
**Language:** `English (en)`

### Header
```
⏰ Reminder: Appointment Tomorrow
```

### Body
```
Hi {{1}}, your appointment is in 24 hours! 📅

Clinic: {{2}}
Date: {{3}}
Time: {{4}}
Address: {{5}}

📍 Travel Guide: {{6}}

💡 Tip: Arrive 10-15 minutes early. Bring your ID and any relevant medical documents.

See you soon! 👋
```

### Footer
```
OraChope.org
```

### Buttons (2 CTA URL)
1. **View Clinic Card** - URL: `{{7}}`
2. **Get Directions** - URL: `{{8}}`

### Variables (8)
1. `patient_name` - e.g., "John Tan"
2. `clinic_name` - e.g., "AllSmiles Dental"
3. `formatted_date` - e.g., "Friday, 13 June 2026"
4. `time_slot` - e.g., "10:00 AM"
5. `clinic_address` - e.g., "123 Jalan Maju, Johor Bahru, 80100, Malaysia"
6. `travel_guide_url` - Travel instructions page
7. `clinic_card_url` - Clinic details page
8. `google_maps_url` - Google Maps link

---

## 🚨 CRITICAL ISSUES TO RESOLVE

### Issue 1: Template 4 (Alternatives Offered) - Inflexible Design

**Problem:**  
Current template requires **exactly 3 alternative slots**. What if clinic can only offer 1 or 2 slots?

**Current Validation:**
- Frontend: Requires all 3 slots filled
- Backend: Rejects if `alternatives.length < 3`
- WhatsApp: Always sends 3 buttons

**Impact:**
- ❌ Clinic offering 1 slot → Validation fails
- ❌ Clinic offering 2 slots → Validation fails
- ✅ Clinic offering 3 slots → Works perfectly

**Solutions (Choose One):**

#### Option A: Create 3 Separate Templates (Recommended)
- `alternatives_offered_1slot` - 1 button
- `alternatives_offered_2slot` - 2 buttons
- `alternatives_offered_3slot` - 3 buttons
- Logic picks template based on slot count
- **Pros:** Clean, flexible, handles all cases
- **Cons:** 3 templates to manage and approve

#### Option B: Fall Back to Email for 1-2 Slots
- WhatsApp only used when exactly 3 slots
- 1-2 slots → Send email instead
- **Pros:** Only 1 WhatsApp template
- **Cons:** Inconsistent channel (patient confusion)

#### Option C: Always Show 3 Slots (Dummy Data)
- Fill missing slots with "No longer available"
- All buttons disabled except valid ones
- **Pros:** Single template
- **Cons:** Poor UX, confusing, violates Meta guidelines

**Recommended:** **Option A** - Submit 3 templates to Meta

---

## 📝 META BUSINESS MANAGER SUBMISSION GUIDE

### Step 1: Access Meta Business Manager

1. Go to: https://business.facebook.com/
2. Log in with your business account
3. Click **"Business Settings"** (gear icon, top right)
4. In left sidebar, find **"Accounts"** section
5. Click **"WhatsApp Business Accounts"**
6. Select your WhatsApp Business account (should show phone number ending in 4928)

### Step 2: Navigate to Message Templates

1. In the WhatsApp account view, look for **"Message Templates"** in the left navigation
   - OR click **"Account Tools"** → **"Message Templates"**
2. Click **"Create Template"** button (blue button, top right)

### Step 3: Create Template (Example: Template 1)

#### 3.1 Template Details
- **Template Name:** `booking_confirmation_patient`
  - ⚠️ **Important:** Use lowercase, underscores only (no spaces, hyphens, or capital letters)
  - Once approved, name CANNOT be changed
- **Category:** Select **"UTILITY"** from dropdown
  - UTILITY = Transactional messages ($0.003/message)
  - Do NOT use MARKETING (requires opt-in, higher cost)
- **Language:** Select **"English"**

Click **"Continue"**

#### 3.2 Build Template

**Header Section:**
1. Click **"Add Header"** (optional but recommended)
2. Select **"Text"**
3. Enter: `✅ Booking Confirmed!`
   - ⚠️ Headers cannot contain variables
   - Keep under 60 characters

**Body Section:**
1. Click in the body text area
2. Copy-paste the body text from Template 1 above
3. For variables, use Meta's format:
   - Type `{{1}}` for first variable
   - Type `{{2}}` for second variable
   - etc.
4. ⚠️ **Character Limit:** 1,024 characters (show count at bottom)

**Footer Section:**
1. Click **"Add Footer"** (optional)
2. Enter: `OraChope.org`
   - ⚠️ No variables allowed
   - Max 60 characters

**Buttons Section:**
- For Template 1: Skip (no buttons)
- For templates with buttons: See "Adding Buttons" section below

#### 3.3 Adding Buttons (For Templates 2-7)

**For CTA URL Buttons:**
1. Click **"Add Button"**
2. Select **"Call to Action"** → **"Visit Website"**
3. **Button Type:** Select **"Dynamic"** (URLs change per message)
4. **Button Text:**
   - For static text: Enter text directly (e.g., "Confirm")
   - For dynamic text: Enter `{{1}}` and increment for each button variable
5. **URL:** Enter `{{1}}` (will be replaced with actual URL at send time)
6. Repeat for each button (max 3 buttons total)

**Important Button Rules:**
- Maximum 3 CTA buttons per template
- Button text max 25 characters
- Cannot mix button types (all must be CTA URL or all must be Quick Reply)
- Button variables count toward total variable limit (20 max)

#### 3.4 Preview & Sample Data

1. Click **"Preview"** tab on right side
2. Fill in sample values for each variable:
   - `{{1}}` = "John Tan"
   - `{{2}}` = "APT-000051"
   - etc.
3. Check how message looks on mobile preview
4. Verify all variables display correctly

#### 3.5 Submit for Review

1. Click **"Submit"** button (bottom right)
2. Meta will review (typically 3-5 business days, can be as fast as 1 hour)
3. You'll receive email notification when approved/rejected

### Step 4: Track Approval Status

1. Return to **"Message Templates"** page
2. Status indicators:
   - 🟡 **Pending** - Under review
   - 🟢 **Approved** - Ready to use
   - 🔴 **Rejected** - See rejection reason, edit and resubmit

### Step 5: After Approval

1. Template name becomes available for API calls
2. Use exact template name in code: `booking_confirmation_patient`
3. Variable count and button count must match exactly
4. Cannot edit approved template (must create new version)

---

## ⚠️ COMMON REJECTION REASONS

1. **Policy Violations:**
   - Offering financial incentives
   - Misleading content
   - Requesting sensitive information (passwords, credit cards)

2. **Format Issues:**
   - Too many variables (max 20)
   - Invalid variable numbering (must be sequential: {{1}}, {{2}}, {{3}}...)
   - Buttons exceed limit (max 3)

3. **Category Mismatch:**
   - Marketing content in UTILITY category
   - Time-sensitive content in MARKETING category

4. **Quality Issues:**
   - Poor grammar/spelling
   - Excessive emojis
   - ALL CAPS text

---

## 🎯 SUBMISSION ORDER RECOMMENDATION

Submit in this order (easier to test incrementally):

1. **Template 1** - Booking Confirmation (simplest, no buttons)
2. **Template 3** - Appointment Confirmed (1 button)
3. **Template 2** - Booking Alert (3 buttons, clinic)
4. **Template 6** - Urgent Nudge (3 buttons, similar to #2)
5. **Template 5** - Booking Expired (2 buttons)
6. **Template 7** - 24h Reminder (2 buttons)
7. **Template 4** - Alternatives Offered (AFTER fixing the 1-3 slot issue)

---

## 📊 COST ESTIMATE

- Category: **UTILITY** ($0.003 USD per message)
- Expected monthly volume: ~500 messages
- **Monthly cost:** ~$1.50 USD

**Breakdown by Template:**
- Template 1 (Patient Confirmation): 100 × $0.003 = $0.30
- Template 2 (Clinic Alert): 100 × $0.003 = $0.30
- Template 3 (Confirmed): 80 × $0.003 = $0.24
- Template 4 (Alternatives): 40 × $0.003 = $0.12
- Template 5 (Expired): 20 × $0.003 = $0.06
- Template 6 (Nudge): 50 × $0.003 = $0.15
- Template 7 (Reminder): 80 × $0.003 = $0.24
- **Total:** ~$1.41/month

---

## ✅ NEXT STEPS

1. **FIRST:** Fix Template 4 validation issue (allow 1-3 slots)
2. **THEN:** Submit templates to Meta in recommended order
3. **TEST:** After approval, test each template with real data
4. **MONITOR:** Check delivery rates and user engagement

**Do you want me to:**
- Fix the validation to allow 1-3 slots? (Recommended)
- Create 3 separate templates for 1/2/3 slots? (More flexible)
- Or use a different approach?

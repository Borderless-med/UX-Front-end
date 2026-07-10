# 🚀 Meta Business Manager - WhatsApp Template Submission Guide

**Complete Step-by-Step Guide for Beginners**  
**Last Updated:** June 12, 2026  
**Total Templates to Submit:** 9 templates (7 unique + 2 alternatives variants)

---

## 📋 TEMPLATES TO SUBMIT (In Recommended Order)

| Order | Template Name | Purpose | Buttons | Priority |
|-------|---------------|---------|---------|----------|
| 1 | booking_request_received | Patient request receipt | 0 | HIGH |
| 2 | appointment_confirmed | Booking confirmed | 2 | HIGH |
| 3 | alternatives_offered_1slot | 1 alternative slot | 1 | MEDIUM |
| 4 | alternatives_offered_2slot | 2 alternative slots | 2 | MEDIUM |
| 5 | alternatives_offered_3slot | 3 alternative slots | 3 | MEDIUM |
| 6 | booking_alert_clinic | New booking alert to clinic | 3 | HIGH |
| 7 | urgent_clinic_nudge | Urgent clinic reminder | 3 | MEDIUM |
| 8 | booking_expired | Booking expired notice | 2 | LOW |
| 9 | appointment_reminder_24h | 24h reminder | 2 | MEDIUM |

**Why this order?**
- Start with simplest (no buttons) to learn the UI
- Progress to more complex (more buttons)
- Test incrementally as each gets approved

---

## 🔐 STEP 1: Access Meta Business Manager

### 1.1 Login

1. **Open Browser:** Chrome, Edge, or Firefox (Safari may have issues)
2. **Navigate to:** https://business.facebook.com/
3. **Login with:**
   - Your Facebook business account credentials
   - If you have multiple businesses, select the one linked to your WhatsApp number

**What you should see:**
- Top navigation bar with "Business Settings", "Ad Manager", "Commerce Manager"
- Left sidebar with your business name
- Main dashboard showing business overview

---

## 🔑 STEP 2: Find WhatsApp Business Account

### 2.1 Navigate to WhatsApp Settings

1. **Click** the **gear icon** (⚙️) in the **top right corner**
   - This opens "Business Settings"
   
2. **In the left sidebar**, scroll down to the **"Accounts"** section
   
3. **Click** on **"WhatsApp Business Accounts"**

**What you should see:**
- Your WhatsApp Business Account listed (should show phone number +65 8810 4928)
- Status: Active (green dot)
- Account ID (long number)

**If you DON'T see WhatsApp Business Accounts:**
- You may not have WhatsApp Business API set up yet
- Contact your WhatsApp Business API provider (e.g., 360Dialog, Twilio, etc.)
- OR visit https://business.whatsapp.com/ to set up

### 2.2 Select Your WhatsApp Account

1. **Click** on your WhatsApp Business Account name/phone number
   
2. This opens the WhatsApp account details page

**What you should see:**
- Account name and phone number at the top
- Left sidebar with options: "Overview", "Message Templates", "Phone Numbers", etc.

---

## 📝 STEP 3: Access Message Templates

### 3.1 Navigate to Templates Section

1. **In the left sidebar** (WhatsApp account page), find and click:
   - **"Message Templates"** 
   - OR **"Account Tools"** → **"Message Templates"**

**What you should see:**
- Page title: "Message Templates"
- Blue **"Create Template"** button (top right)
- List of existing templates (may be empty if this is your first time)
- Filter options: Status (All, Approved, Rejected, Pending)

**Screen Layout:**
```
┌──────────────────────────────────────────────────┐
│ Message Templates        [Create Template] 🔵    │
├──────────────────────────────────────────────────┤
│ [All] [Approved] [Rejected] [Pending]           │
├──────────────────────────────────────────────────┤
│                                                   │
│  No templates yet                                │
│  OR                                              │
│  [Template List]                                 │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 🎨 STEP 4: Create Your First Template

### Template 1: booking_request_received (SIMPLEST - Start Here!)

### 4.1 Start Template Creation

1. **Click** the blue **"Create Template"** button (top right)

2. **Template Details Page Opens:**

**Screen 1: Template Information**

```
┌──────────────────────────────────────────────────┐
│ Create Message Template                          │
├──────────────────────────────────────────────────┤
│ Template Name *                                   │
│ [________________________]                       │
│ Use lowercase letters, numbers, and underscores  │
│                                                   │
│ Category *                                       │
│ [ Select Category ▼ ]                           │
│                                                   │
│ Languages *                                      │
│ [ English ▼ ]                                    │
│                                                   │
│                   [Continue] 🔵                  │
└──────────────────────────────────────────────────┘
```

### 4.2 Fill in Template Details

**Field 1: Template Name**
```
booking_request_received
```

⚠️ **CRITICAL RULES:**
- ✅ Use: lowercase letters (a-z), numbers (0-9), underscores (_)
- ❌ NO: Spaces, hyphens (-), capital letters, special characters
- ⚠️ **Cannot be changed after approval!**
- Examples of VALID names: `booking_confirmed`, `payment_receipt_2024`
- Examples of INVALID names: `Booking-Confirmed`, `payment receipt`, `Payment@Alert`

**Field 2: Category**

Click dropdown and select:
```
UTILITY
```

**Category Options Explained:**
- **UTILITY** ✅ (Use this!)
  - Transactional messages
  - Account updates, order confirmations, appointment reminders
  - $0.003 per message (cheapest)
  - No opt-in required
  
- **MARKETING** ❌ (Don't use)
  - Promotional messages
  - Requires explicit user opt-in
  - Higher cost (~$0.02-0.05 per message)
  - Strict 24-hour window rules
  
- **AUTHENTICATION** ❌ (Don't use)
  - OTP codes, password resets
  - Special pricing
  - Not for general booking confirmations

**Field 3: Language**

Click dropdown and select:
```
English
```

If dropdown shows specific variants, choose:
```
English (US) or English (UK)
```

### 4.3 Continue to Template Builder

1. **Click** the blue **"Continue"** button at the bottom

2. **Template Builder Page Opens** (This is where you build the actual message)

---

## 📱 STEP 5: Build Template Structure

### 5.1 Understanding the Template Builder Interface

**Screen Layout:**
```
┌────────────────────┬──────────────────────────┐
│                    │                          │
│   BUILD TEMPLATE   │   PREVIEW (Phone View)   │
│                    │                          │
│   [+ Header]       │   ┌──────────────┐      │
│   [+ Body]         │   │  📱 Preview  │      │
│   [+ Footer]       │   │              │      │
│   [+ Buttons]      │   │              │      │
│                    │   └──────────────┘      │
│                    │                          │
│   [Submit] 🔵      │                          │
│                    │                          │
└────────────────────┴──────────────────────────┘
```

### 5.2 Add Header (Optional but Recommended)

1. **Click** **"+ Add Header"** button

2. **Header Type Selection Appears:**
   - Text
   - Image
   - Video
   - Document

3. **Select:** **"Text"**

4. **Text Input Box Appears:**
```
┌──────────────────────────────────────┐
│ Header Text (max 60 characters)      │
│                                       │
│ [_________________________________]  │
│                                       │
│ 0 / 60 characters                    │
└──────────────────────────────────────┘
```

5. **Type:**
```
Request Received!
```

⚠️ **Header Rules:**
- ❌ **NO variables allowed** (no {{1}}, {{2}}, etc.)
- ✅ Emojis are allowed
- ✅ Max 60 characters
- ✅ Can use: Letters, numbers, punctuation, emojis
- Examples:
  - ✅ "✅ Booking Confirmed!"
  - ✅ "🔔 New Alert"
  - ❌ "Hi {{1}}, welcome!" (variables not allowed)

### 5.3 Add Body (REQUIRED)

1. **Click** **"+ Add Body"** button (or it may already be open)

2. **Large Text Area Appears:**
```
┌──────────────────────────────────────────────┐
│ Body (max 1,024 characters)                  │
│                                               │
│ [                                          ]  │
│ [                                          ]  │
│ [                                          ]  │
│ [                                          ]  │
│ [                                          ]  │
│                                               │
│ 0 / 1,024 characters                         │
│                                               │
│ [+ Add Variable] [+ Add Sample]              │
└──────────────────────────────────────────────┘
```

3. **Type the body text:**
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

**How to Add Variables:**

**Method 1: Type Manually**
- Just type: `{{patient_name}}`, `{{booking_ref}}`, `{{clinic_name}}`, etc.
- Must use curly braces: `{{` and `}}`
- Use descriptive lowercase names with underscores

**Method 2: Use "Add Variable" Button**
1. **Click** **"Add Variable"** button
2. A placeholder variable is inserted at cursor position
3. Replace with descriptive name (e.g., `{{patient_name}}`)

⚠️ **Body Rules:**
- ✅ Variable names: lowercase letters, numbers, underscores only (e.g., {{patient_name}}, {{booking_ref}})
- ✅ Max 20 variables per template
- ✅ Max 1,024 characters total
- ✅ Emojis allowed
- ✅ Line breaks allowed (press Enter)
- ❌ NO HTML tags
- ❌ NO URLs (unless in buttons)

**Character Counter:**
- Bottom of text box shows: "245 / 1,024 characters"
- Turns red if over limit

### 5.4 Add Footer (Optional)

1. **Click** **"+ Add Footer"** button

2. **Text Input Appears:**
```
┌──────────────────────────────────────┐
│ Footer (max 60 characters)            │
│                                       │
│ [_________________________________]  │
│                                       │
│ 0 / 60 characters                    │
└──────────────────────────────────────┘
```

3. **Type:**
```
OraChope.org
```

⚠️ **Footer Rules:**
- ❌ **NO variables allowed**
- ✅ Max 60 characters
- ✅ Usually used for: Brand name, support email, website
- Examples:
  - "OraChope.org"
  - "Need help? contact@orachope.org"
  - "Reply STOP to unsubscribe"

### 5.5 Add Buttons (For Template 1: SKIP - No Buttons)

**For this first template (booking_confirmation_patient), we have NO buttons.**

**Skip this section. We'll add buttons in Template 2.**

---

## 🔍 STEP 6: Preview & Sample Data

### 6.1 Check Live Preview

1. **Look at the right panel** (Phone Preview)

2. **You should see:**
```
┌──────────────────────┐
│ WhatsApp Preview     │
├──────────────────────┤
│                      │
│  ✅ Booking Confirmed│
│                      │
│  Hi {{1}}, your...   │
│  Booking Reference:  │
│  {{2}}               │
│  ...                 │
│                      │
│  OraChope.org        │
│                      │
└──────────────────────┘
```

**Variables show as `{{1}}`, `{{2}}`, etc. in preview - this is normal!**

### 6.2 Add Sample Values (To See Real Preview)

1. **Below the preview**, look for **"Sample Values"** section

2. **Click** **"Add Sample"** or **"Edit Sample Values"**

3. **Input Form Appears:**
```
Variable {{1}}: [________________]
Variable {{2}}: [________________]
Variable {{3}}: [________________]
...
```

4. **Fill in realistic sample data:**
```
Variable {{patient_name}}: John Tan
Variable {{booking_ref}}: APT-000051
Variable {{clinic_name}}: AllSmiles Dental
Variable {{clinic_address}}: 123 Jalan Maju, Johor Bahru, 80100, Malaysia
Variable {{treatment_type}}: Root Canal
Variable {{requested_date}}: Friday, 13 June 2026
Variable {{time_slot}}: 10:00 AM
```

5. **Click** **"Save"** or **"Apply"**

6. **Preview Updates:**
```
┌──────────────────────┐
│ WhatsApp Preview     │
├──────────────────────┤
│                      │
│  ✅ Booking Confirmed│
│                      │
│  Hi John Tan, your...│
│  Booking Reference:  │
│  APT-000051          │
│  🏥 Clinic: AllSmiles│
│  Dental              │
│  📍 Address: 123...  │
│  ...                 │
│                      │
│  OraChope.org        │
│                      │
└──────────────────────┘
```

**Now you can see how the actual message will look!**

---

## ✅ STEP 7: Submit for Review

### 7.1 Final Checks

**Before submitting, verify:**

- [ ] Template name is correct (lowercase, underscores only)
- [ ] Category is **UTILITY**
- [ ] Language is **English**
- [ ] Header (if used) has NO variables
- [ ] Body has all required variables with descriptive names
- [ ] Variable names use lowercase, underscores, numbers only
- [ ] Footer (if used) has NO variables
- [ ] Character limits not exceeded
- [ ] Sample data shows realistic preview
- [ ] No policy violations (see section 9 below)

### 7.2 Submit

1. **Click** the blue **"Submit"** button (bottom right)

2. **Confirmation Dialog Appears:**
```
┌──────────────────────────────────────┐
│ Submit Template for Review?          │
│                                       │
│ Your template will be reviewed by    │
│ Meta. This usually takes 3-5         │
│ business days. You cannot edit       │
│ after submission.                    │
│                                       │
│   [Cancel]     [Submit] 🔵          │
└──────────────────────────────────────┘
```

3. **Click** **"Submit"**

### 7.3 Success!

**You should see:**
```
┌──────────────────────────────────────┐
│ ✅ Template Submitted                │
│                                       │
│ Your template has been submitted     │
│ for review. You'll receive an email  │
│ notification when it's approved or   │
│ if changes are needed.               │
│                                       │
│   [View Templates]                   │
└──────────────────────────────────────┘
```

**Status Changes:**
- **Immediately:** Status = 🟡 **PENDING** (Under Review)
- **After 1 hour - 5 days:** Status = 🟢 **APPROVED** or 🔴 **REJECTED**

---

## 📬 STEP 8: Track Approval Status

### 8.1 Check Template Status

1. **Go back to** "Message Templates" page

2. **Find your template** in the list:
```
┌────────────────────────────────────────────────┐
│ Template Name         | Status  | Language     │
├────────────────────────────────────────────────┤
│ booking_confirmation  | 🟡 Pending | English   │
│ _patient              |         |              │
└────────────────────────────────────────────────┘
```

### 8.2 Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| 🟡 | Pending | Under review by Meta |
| 🟢 | Approved | Ready to use! |
| 🔴 | Rejected | Needs changes (see rejection reason) |
| ⚫ | Disabled | Paused or violated policy after approval |

### 8.3 Email Notifications

**You'll receive emails at:**
- The email address linked to your Meta Business account

**Approval Email:**
```
Subject: ✅ Message Template Approved

Your template "booking_request_received" has been approved 
and is now ready to use in your WhatsApp Business API.
```

**Rejection Email:**
```
Subject: ❌ Message Template Rejected

Your template "booking_request_received" was not approved.

Reason: [Specific rejection reason]

Please review Meta's policies and resubmit.
```

### 8.4 If Rejected

1. **Click** on the rejected template

2. **View** the rejection reason (shown in red)

3. **Common rejection reasons:**
   - Policy violation (see section 9)
   - Too many variables
   - Invalid format
   - Misleading content

4. **Fix the issue** and **create a new template** (cannot edit rejected one)

5. **Use a slightly different name**, e.g., `booking_confirmation_patient_v2`

---

## 🎯 STEP 9: Submit Remaining Templates

### Template 2: appointment_confirmed (1 BUTTON)

**Follow same steps as Template 1, but add buttons:**

#### Template Details:
```
Name: appointment_confirmed
Category: UTILITY
Language: English
```

#### Header:
```
Appointment Confirmed!
```
(Skip emoji if paste doesn't work)

#### Body:
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

#### Footer:
```
OraChope.org
```

#### Buttons (NEW!):

1. **Click** **"+ Add Buttons"**

2. **Button Type Selection:**
```
┌──────────────────────────────────────┐
│ Select Button Type:                  │
│                                       │
│ ○ Quick Reply                        │
│ ● Call to Action                     │
│                                       │
│   [Continue]                         │
└──────────────────────────────────────┘
```

3. **Select:** **"Call to Action"**

4. **CTA Type:**
```
┌──────────────────────────────────────┐
│ Call to Action Type:                 │
│                                       │
│ ● Visit Website                      │
│ ○ Call Phone Number                  │
│                                       │
│   [Continue]                         │
└──────────────────────────────────────┘
```

5. **Select:** **"Visit Website"**

6. **Button 1 Configuration:**
```
┌──────────────────────────────────────┐
│ Button Text (max 25 characters)      │
│ [Get Directions 📍____________]     │
│ 18 / 25 characters                   │
│                                       │
│ Website URL Type:                    │
│ ● Dynamic URL                        │
│ ○ Static URL                         │
│                                       │
│ URL:                                 │
│ [{{google_maps_url}}_____________]   │
│                                       │
└──────────────────────────────────────┘
```

**Fill in Button 1:**
- **Button Text:** `Get Directions 📍`
- **URL Type:** Select **"Dynamic URL"**
- **URL:** Type `{{google_maps_url}}`

7. **Click** **"Add Button"** again for Button 2

8. **Button 2 Configuration:**

**Fill in Button 2:**
- **Button Text:** `Cancel Appointment`
- **URL Type:** Select **"Dynamic URL"**
- **URL:** Type `{{cancel_url}}`

⚠️ **IMPORTANT:** Meta limits "Visit Website" buttons to 2 maximum per template!

**Understanding Dynamic vs Static URLs:**

**Dynamic URL** ✅ (Use this):
- URL changes for each message
- Use variable: `{{9}}`, `{{10}}`, etc.
- Example: Each patient gets unique cancellation link
- Format: `https://orachope.org/cancel?ref={{booking_ref}}&token={{token}}`

**Static URL** ❌ (Don't use for us):
- Same URL for every message
- Example: `https://orachope.org`
- Use case: Company website, support page

**Sample Values for Buttons:**
```
Variable {{google_maps_url}}: https://maps.google.com/?q=1.4655,103.7578
Variable {{cancel_url}}: https://orachope.org/api/cancel?ref=APT-000051&token=abc123
```

9. **Click** **"Save"** or **"Done"**

**Preview Updates to Show Buttons:**
```
┌──────────────────────┐
│ Great news John Tan! │
│ 🎉                   │
│ ...                  │
│                      │
│ OraChope.org         │
│                      │
│ [Get Directions 📍] │ ← Button 1
│ [Cancel Appointment] │ ← Button 2
│                      │
└──────────────────────┘
```

---

### Template 3: alternatives_offered_1slot (1 BUTTON)

**NEW! First variant for alternative slots**

#### Template Details:
```
Name: alternatives_offered_1slot
Category: UTILITY
Language: English
```

#### Header:
```
Alternative Time Available
```
(Note: "Time" singular, not "Times")

#### Body:
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered this alternative time. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

#### Footer:
```
OraChope.org
```

#### Buttons:
- **Button 1:**
  - **Text:** `{{slot1_button_text}}` (Dynamic text!)
  - **URL Type:** Dynamic
  - **URL:** `{{slot1_url}}`

**Important:** Button text is ALSO a variable! This allows us to show "📅 Fri 13 Jun, 10:00 AM"

**Sample Values:**
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{original_date}}: 2026-06-11
{{original_time}}: 15:00
{{slot1_button_text}}: 📅 Fri 13 Jun, 10:00 AM
{{slot1_url}}: https://orachope.org/api/accept?ref=APT-051&slot=1
```

---

### Template 4: alternatives_offered_2slot (2 BUTTONS)

**Follow same pattern, but with 2 buttons**

#### Template Details:
```
Name: alternatives_offered_2slot
Category: UTILITY
Language: English
```

#### Header:
```
Alternative Times Available
```
(Note: "Times" plural now)

#### Body:
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered these 2 alternative times. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

#### Footer:
```
OraChope.org
```

#### Buttons:
- **Button 1:**
  - Text: `{{slot1_button_text}}`
  - URL: `{{slot1_url}}`
  
- **Button 2:**
  - Text: `{{slot2_button_text}}`
  - URL: `{{slot2_url}}`

**How to Add 2nd Button:**
1. After creating Button 1, click **"+ Add Button"** again
2. Follow same process
3. Maximum 3 buttons allowed per template

**Sample Values:**
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{original_date}}: 2026-06-11
{{original_time}}: 15:00
{{slot1_button_text}}: 📅 Fri 13 Jun, 10:00 AM
{{slot1_url}}: https://orachope.org/api/accept?ref=APT-051&slot=1
{{slot2_button_text}}: 📅 Sat 14 Jun, 2:00 PM
{{slot2_url}}: https://orachope.org/api/accept?ref=APT-051&slot=2
```

---

### Template 5: alternatives_offered_3slot (3 BUTTONS - MAXIMUM!)

**Same pattern, 3 buttons**

#### Body:
```
Hi {{patient_name}}, {{clinic_name}} cannot accommodate your original request:

{{original_date}} at {{original_time}} ❌

They've offered these 3 alternative times. Tap to confirm:

Not interested? Visit orachope.org/clinics
```

#### Buttons:
- **Button 1:** Text: `{{slot1_button_text}}`, URL: `{{slot1_url}}`
- **Button 2:** Text: `{{slot2_button_text}}`, URL: `{{slot2_url}}`
- **Button 3:** Text: `{{slot3_button_text}}`, URL: `{{slot3_url}}`

⚠️ **3 buttons is the MAXIMUM Meta allows!**

**Sample Values:**
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{original_date}}: 2026-06-11
{{original_time}}: 15:00
{{slot1_button_text}}: 📅 Fri 13 Jun, 10:00 AM
{{slot1_url}}: https://orachope.org/api/accept?ref=APT-051&slot=1
{{slot2_button_text}}: 📅 Sat 14 Jun, 2:00 PM
{{slot2_url}}: https://orachope.org/api/accept?ref=APT-051&slot=2
{{slot3_button_text}}: 📅 Mon 16 Jun, 9:00 AM
{{slot3_url}}: https://orachope.org/api/accept?ref=APT-051&slot=3
```

---

### Templates 6-9: Follow Same Pattern

**For complete text of all remaining templates, see:** [WHATSAPP_TEMPLATES_REVIEW.md](WHATSAPP_TEMPLATES_REVIEW.md)

**Key differences:**
- **booking_alert_clinic:** 3 buttons (Confirm, Reject, Offer Alternatives)
- **urgent_clinic_nudge:** 3 buttons (same as booking_alert_clinic)
- **booking_expired:** 2 buttons (Browse Clinics, Contact Support)
- **appointment_reminder_24h:** 2 buttons (View Clinic, Get Directions)

---

## ⚠️ STEP 10: Common Policy Violations to Avoid

### 10.1 Content Policies

**❌ REJECTED - Don't Do This:**

1. **Offering Incentives:**
   - "Get 20% off your next visit!"
   - "Free consultation for new patients!"
   - *Why:* UTILITY templates cannot contain promotional offers

2. **Requesting Sensitive Info:**
   - "Reply with your credit card number"
   - "Send us your password"
   - *Why:* Privacy violation

3. **Misleading Content:**
   - "You've won a prize!"
   - "Urgent: Your account will be closed"
   - *Why:* False urgency or deceptive content

4. **All Caps:**
   - "CONFIRM YOUR APPOINTMENT NOW!!!"
   - *Why:* Considered shouting/spam

5. **Too Many Emojis:**
   - "🔥🔥🔥 SALE 🔥🔥🔥"
   - *Why:* Looks spammy

### 10.2 Format Violations

**❌ REJECTED:**

1. **Invalid Variable Names:**
   ```
   Hi {{Patient-Name}}, your booking {{Booking Ref}} is confirmed
   ```
   Must use lowercase, underscores, no spaces/hyphens!
   Correct: `{{patient_name}}`, `{{booking_ref}}`

2. **Too Many Variables:**
   - Max 20 variables per template

3. **Invalid Button Text:**
   - Button text over 25 characters
   - Button text with newlines

4. **URLs in Body:**
   ```
   Visit https://orachope.org for details
   ```
   URLs must be in buttons, not body text (for UTILITY templates)

### 10.3 Quality Issues

**❌ REJECTED:**

1. **Poor Grammar:**
   - "You appointment are confirm"
   
2. **Typos:**
   - "Appoinment" instead of "Appointment"

3. **No Context:**
   - "Your order is ready" (What order? Which company?)
   - *Fix:* "Your dental appointment with AllSmiles is ready"

---

## 🎓 STEP 11: Pro Tips for Success

### 11.1 Submission Strategy

**Do:**
- ✅ Submit 1-2 templates per day (easier to track)
- ✅ Test simplest templates first
- ✅ Use realistic sample data
- ✅ Keep template names descriptive but concise

**Don't:**
- ❌ Submit all 9 templates at once (hard to track rejections)
- ❌ Use vague names like `template_1`, `test_msg`

### 11.2 Approval Time Hacks

**Faster Approval (Usually):**
- Submit during Meta business hours (9 AM - 5 PM PST, weekdays)
- Avoid weekends (review team offline)
- First 1-2 templates for new account = faster review (~1-2 hours)
- After 5+ templates = slower review (~3-5 days)

### 11.3 Character Optimization

**Save Characters:**
- Use emojis instead of words: "📅" instead of "Date:"
- Abbreviate where clear: "Apt" instead of "Appointment"
- Remove unnecessary pleasantries

**Example Optimization:**
```
Before (102 chars):
"Thank you for booking with us. Your appointment is confirmed. We look forward to seeing you soon!"

After (58 chars):
"Appointment confirmed! We look forward to seeing you 😊"
```

### 11.4 Variable Planning

**Best Practice:**
- List all variables in a comment at top of template (for your own reference)
- Use consistent naming in your code:
  ```typescript
  {{1}} = patient_name
  {{2}} = booking_ref
  {{3}} = clinic_name
  ...
  ```

---

## 📊 STEP 12: After Approval - Testing

### 12.1 Test Template

**Once approved:**

1. **Use WhatsApp Business API** to send test message
2. **Send to your own number first**
3. **Verify:**
   - All variables populate correctly
   - Buttons work (URLs are correct)
   - Formatting looks good on mobile
   - No truncation issues

### 12.2 Update Code

**In your codebase:**

1. Update `templates/whatsapp-templates.ts` template names match Meta exactly
2. Test in staging environment first
3. Deploy to production only after successful test

---

## 🆘 STEP 13: Troubleshooting

### "Can't find WhatsApp Business Accounts"

**Solution:**
- Verify you have WhatsApp Business API (not regular WhatsApp Business app)
- Check you're logged into correct Meta Business account
- Contact your WhatsApp API provider for account link

### "Submit button is greyed out"

**Possible Causes:**
- Template name field empty
- Category not selected
- Body text missing
- Variable sequencing error (e.g., {{1}}, {{3}} but no {{2}})

### "Template rejected immediately (within seconds)"

**Likely Cause:**
- Automated filter caught obvious violation
- Check: Template name format, variable sequencing, character limits

### "Template pending for over 7 days"

**Action:**
- Contact Meta support: https://business.facebook.com/help
- Check if you received email requesting more info
- Resubmit as new template with `_v2` suffix

---

## 📝 STEP 14: Submission Checklist

**Before submitting each template:**

- [ ] Template name: lowercase, underscores only, descriptive
- [ ] Category: UTILITY selected
- [ ] Language: English selected
- [ ] Header: Under 60 chars, NO variables
- [ ] Body: Under 1,024 chars, sequential variables ({{1}}, {{2}}, {{3}}...)
- [ ] Footer: Under 60 chars, NO variables
- [ ] Buttons: Max 3, dynamic URLs, button text under 25 chars
- [ ] Sample values: Realistic, complete, shows good preview
- [ ] Grammar: Proofread for typos and clarity
- [ ] Policy: No promotional offers, no sensitive data requests
- [ ] Preview: Looks good on phone preview

---

## 🎉 You're Ready!

**Next Steps:**

1. **Login to Meta Business Manager** (Step 1)
2. **Navigate to WhatsApp Message Templates** (Steps 2-3)
3. **Create Template 1** (booking_confirmation_patient) using Steps 4-7
4. **Wait for approval** (Check email + dashboard)
5. **Repeat for Templates 2-9** (Use same process)
6. **Test each approved template** before deploying

**Estimated Time:**
- Per template: 10-15 minutes to create
- Total for 9 templates: ~2 hours
- Approval wait: 1-5 days per template

**Good luck! 🚀**

---

## 📚 Additional Resources

- **Meta WhatsApp Business API Docs:** https://developers.facebook.com/docs/whatsapp/
- **Template Guidelines:** https://developers.facebook.com/docs/whatsapp/message-templates/guidelines
- **Business Support:** https://business.facebook.com/help

**Questions? Contact:** contact@orachope.org

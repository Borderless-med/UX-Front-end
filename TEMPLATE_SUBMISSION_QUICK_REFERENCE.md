# 📋 WhatsApp Templates - Quick Copy-Paste Reference

**Last Updated:** June 12, 2026  
**Purpose:** Quick reference for Meta submission - all templates with correct variable format

---

## ✅ TEMPLATE 1: booking_request_received (SUBMITTED ✓)

**Name:** `booking_request_received`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 1

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

### Button
```
View details → https://orachope.org/travel-guide
```

### Footer
```
OraChope.org
```

### Sample Values
```
{{patient_name}}: John Tan
{{booking_ref}}: APT-000051
{{clinic_name}}: AllSmiles Dental
{{clinic_address}}: 123 Jalan Maju, Johor Bahru, 80100, Malaysia
{{treatment_type}}: Root Canal
{{requested_date}}: Friday, 13 June 2026
{{time_slot}}: 10:00 AM
```

---

## 📍 TEMPLATE 2: appointment_confirmed (NEXT TO SUBMIT)

**Name:** `appointment_confirmed`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 2

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

### Button 1
- **Type:** Call to Action → Visit Website
- **Text:** `Get Directions 📍`
- **URL Type:** Dynamic
- **URL:** `{{google_maps_url}}`

### Button 2
- **Type:** Call to Action → Visit Website
- **Text:** `Cancel Appointment`
- **URL Type:** Dynamic
- **URL:** `{{cancel_url}}`

### Sample Values
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{booking_ref}}: APT-000051
{{appointment_date}}: Friday, 13 June 2026
{{appointment_time}}: 10:00 AM
{{clinic_address}}: 123 Jalan Maju, Johor Bahru, 80100, Malaysia
{{google_maps_url}}: https://maps.google.com/?q=1.4655,103.7578
{{cancel_url}}: https://orachope.org/api/cancel?ref=APT-000051&token=abc123xyz
```

---

## 📅 TEMPLATE 3: alternatives_offered_1slot

**Name:** `alternatives_offered_1slot`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 1

### Header
```
Alternative Time Available
```

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

### Button 1
- **Type:** Call to Action → Visit Website
- **Text:** `{{slot1_button_text}}`
- **URL Type:** Dynamic
- **URL:** `{{slot1_url}}`

⚠️ **Note:** Button text is ALSO a variable!

### Sample Values
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{original_date}}: 2026-06-11
{{original_time}}: 15:00
{{slot1_button_text}}: 📅 Fri 13 Jun, 10:00 AM
{{slot1_url}}: https://orachope.org/api/accept?ref=APT-051&slot=1
```

---

## 📅 TEMPLATE 4: alternatives_offered_2slot

**Name:** `alternatives_offered_2slot`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 2

### Header
```
Alternative Times Available
```

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

### Button 1
- **Text:** `{{slot1_button_text}}`
- **URL:** `{{slot1_url}}`

### Button 2
- **Text:** `{{slot2_button_text}}`
- **URL:** `{{slot2_url}}`

### Sample Values
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

## 📅 TEMPLATE 5: alternatives_offered_3slot

**Name:** `alternatives_offered_3slot`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 3 (MAXIMUM!)

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

### Button 1
- **Text:** `{{slot1_button_text}}`
- **URL:** `{{slot1_url}}`

### Button 2
- **Text:** `{{slot2_button_text}}`
- **URL:** `{{slot2_url}}`

### Button 3
- **Text:** `{{slot3_button_text}}`
- **URL:** `{{slot3_url}}`

### Sample Values
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

## 🔔 TEMPLATE 6: booking_alert_clinic

**Name:** `booking_alert_clinic`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 3

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

### Button 1
- **Text:** `Confirm`
- **URL:** `{{confirm_url}}`

### Button 2
- **Text:** `Reject`
- **URL:** `{{reject_url}}`

### Button 3
- **Text:** `Offer Alternatives`
- **URL:** `{{alternatives_url}}`

### Sample Values
```
{{clinic_name}}: AllSmiles Dental
{{booking_ref}}: APT-000051
{{patient_name}}: John Tan
{{patient_whatsapp}}: +6588104928
{{treatment_type}}: Root Canal
{{requested_date}}: Friday, 13 June 2026
{{time_slot}}: 10:00 AM
{{expires_at}}: 1:00 PM, Friday 13 June
{{confirm_url}}: https://orachope.org/api/clinic/confirm?ref=APT-051&token=xyz
{{reject_url}}: https://orachope.org/api/clinic/reject?ref=APT-051&token=xyz
{{alternatives_url}}: https://orachope.org/api/clinic/respond/APT-051?token=xyz
```

---

## ⚠️ TEMPLATE 7: urgent_clinic_nudge

**Name:** `urgent_clinic_nudge`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 3

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

### Button 1
- **Text:** `Confirm`
- **URL:** `{{confirm_url}}`

### Button 2
- **Text:** `Reject`
- **URL:** `{{reject_url}}`

### Button 3
- **Text:** `Offer Alternatives`
- **URL:** `{{alternatives_url}}`

### Sample Values
```
{{clinic_name}}: AllSmiles Dental
{{booking_ref}}: APT-000051
{{expires_at}}: 1:00 PM, Friday 13 June
{{patient_name}}: John Tan
{{treatment_type}}: Root Canal
{{requested_date}}: Friday, 13 June 2026
{{time_slot}}: 10:00 AM
{{confirm_url}}: https://orachope.org/api/clinic/confirm?ref=APT-051&token=xyz
{{reject_url}}: https://orachope.org/api/clinic/reject?ref=APT-051&token=xyz
{{alternatives_url}}: https://orachope.org/api/clinic/respond/APT-051?token=xyz
```

---

## ⏰ TEMPLATE 8: booking_expired

**Name:** `booking_expired`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 2

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

### Button 1
- **Text:** `Browse Clinics`
- **URL:** `{{browse_clinics_url}}`

### Button 2
- **Text:** `Contact Support`
- **URL:** `{{support_url}}`

### Sample Values
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{booking_ref}}: APT-000051
{{clinic_address}}: 123 Jalan Maju, Johor Bahru, Malaysia
{{treatment_type}}: Root Canal
{{requested_date}}: Friday, 13 June 2026
{{browse_clinics_url}}: https://orachope.org/clinics?treatment=root_canal
{{support_url}}: https://wa.me/6588104928
```

---

## 📅 TEMPLATE 9: appointment_reminder_24h

**Name:** `appointment_reminder_24h`  
**Category:** UTILITY  
**Language:** English  
**Buttons:** 2

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

### Button 1
- **Text:** `Get Directions 📍`
- **URL:** `{{google_maps_url}}`

### Button 2
- **Text:** `Cancel Appointment`
- **URL:** `{{cancel_url}}`

### Sample Values
```
{{patient_name}}: John Tan
{{clinic_name}}: AllSmiles Dental
{{appointment_date}}: Friday, 13 June 2026
{{appointment_time}}: 10:00 AM
{{clinic_address}}: 123 Jalan Maju, Johor Bahru, 80100, Malaysia
{{google_maps_url}}: https://maps.google.com/?q=1.4655,103.7578
{{cancel_url}}: https://orachope.org/api/cancel?ref=APT-051&token=abc123
```

---

## ✅ SUBMISSION CHECKLIST

Before submitting each template:

- [ ] Template name: lowercase, underscores only
- [ ] Category: UTILITY selected
- [ ] Language: English selected
- [ ] Header: NO variables, under 60 chars
- [ ] Body: Descriptive variable names ({{patient_name}}, not {{1}})
- [ ] Footer: NO variables, under 60 chars
- [ ] Buttons: Max 2 "Visit Website" buttons per template
- [ ] Sample values: All variables filled with realistic data
- [ ] Preview: Looks good on phone preview

---

## 📊 SUBMISSION ORDER

| Order | Template | Priority | Notes |
|-------|----------|----------|-------|
| ✅ 1 | booking_request_received | HIGH | DONE! |
| 2 | appointment_confirmed | HIGH | Next - has 2 buttons |
| 3 | alternatives_offered_1slot | MEDIUM | After #2 |
| 4 | alternatives_offered_2slot | MEDIUM | After #3 |
| 5 | alternatives_offered_3slot | MEDIUM | After #4 |
| 6 | booking_alert_clinic | HIGH | For clinic notifications |
| 7 | urgent_clinic_nudge | MEDIUM | Reminder to clinic |
| 8 | booking_expired | LOW | Edge case |
| 9 | appointment_reminder_24h | MEDIUM | Day before reminder |

**Estimated Time:** 10-15 minutes per template = ~2 hours total for remaining 8 templates

**Good luck! 🚀**

# Test appointment_reschedule_1 Template

## Step 1: Create New Test Booking

Go to your booking page and create a new booking with these details:

**Patient Details:**
- Name: `Test Reschedule 1 - July 2`
- Email: `gohseowping@gmail.com`
- WhatsApp: `+65 82229202`

**Booking Details:**
- Clinic: `TEST CLINIC - DO NOT BOOK`
- Treatment: `Root Canal` (or any treatment)
- Date: `2026-07-05` (or any future date)
- Time: `14:00` (or any time)

---

## Step 2: Get Clinic Response URL

After booking is created, run this SQL to get the clinic response URL:

```sql
SELECT booking_ref, notifications_sent
FROM appointment_bookings
WHERE patient_name LIKE '%Test Reschedule 1%'
ORDER BY created_at DESC
LIMIT 1;
```

**Look for** the `booking_alert_clinic` notification in the JSON. It will contain:
- `alternatives_url` or `clinic_response_url`

---

## Step 3: Open Clinic Response Page

1. Copy the URL from the notifications_sent JSON
2. Open it in your browser
3. You'll see the clinic response interface

---

## Step 4: Offer 1 Alternative Slot

On the clinic response page:

1. Click **"Suggest Alternative Times"** button
2. **Fill in ONLY Slot 1:**
   - Date: `2026-07-06`
   - Time: `10:00`
3. **Leave Slot 2 and Slot 3 EMPTY**
4. Click **Submit**

---

## Step 5: Verify Results

**Expected:**
- ✅ Patient receives email notification
- ✅ Patient receives WhatsApp with `appointment_reschedule_1` template
- ✅ WhatsApp shows:
  - Original requested: July 5 at 2:00 PM
  - New alternative: July 6 at 10:00 AM
  - "Confirm New Time" button

**Check Vercel Logs for:**
```
WhatsApp sent to +65 82229202
Template: appointment_reschedule_1
```

**Check WhatsApp Business Manager** for delivery status.

---

## Alternative: If You Don't Want to Use Booking Form

If you prefer, I can provide SQL to insert a test booking directly into the database and trigger the clinic notification manually. Let me know!

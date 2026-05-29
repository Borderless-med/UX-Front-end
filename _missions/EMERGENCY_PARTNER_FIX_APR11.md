# Emergency Partner Onboarding Fix
**Date:** April 11, 2026  
**Issue:** Partners cannot complete signup - their clinics missing from dropdown

---

## IMMEDIATE FIX (Do This NOW - 2 minutes)

### Step 1: Run the SQL Script

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/project/[your-project-id]/sql

2. **Copy the SQL from** `20260411_add_partner_clinics_idea_and_pink_white.sql`

3. **Paste and Execute**
   - Click "Run" button
   - You should see confirmation that 2 rows were inserted

4. **Verify Success**
   - The SELECT query at the end will show both clinics
   - Check that `id`, `name`, and `dentist` are correct

### Step 2: Notify Partners

Send WhatsApp/Email:
```
Hi Dr. Khoo / Dr. Lai,

Great news! Your clinic is now in our system. 

Please try the partner signup form again at:
www.orachope.org/partner-application

Your clinic should now appear in the dropdown menu.

Thanks for your patience!
```

### Step 3: Test the Form Yourself

1. Go to your partner application page
2. Select "JB Clinics" as source
3. Verify both clinics appear in dropdown:
   - ✅ Idea Dental
   - ✅ Pink and White Dental

---

## OPTIONAL: Update with Accurate Data Later

After partners complete signup, you can refine their clinic info:

```sql
-- Get accurate info from Google Maps search:
-- 1. Search "Idea Dental 77 Jalan Mutiara Johor"
-- 2. Extract: rating, reviews, Google CID, hours, treatments

UPDATE public.clinics_data
SET 
  rating = [actual rating from Google],
  reviews = [actual review count],
  google_review_url = 'https://maps.google.com/?cid=[CID from Google Maps]',
  operating_hours = '[actual hours]',
  website_url = '[actual website if they have one]',
  address = '[exact full address from Google Maps]'
WHERE name = 'Idea Dental';

-- Repeat for Pink and White Dental
```

---

## PREVENT THIS IN FUTURE

### Option A: Add "Clinic Not Listed" to Form

Modify PartnerForm.tsx to include:
- Option in dropdown: "My clinic is not listed"  
- When selected, show manual entry fields
- Auto-creates clinic record during signup

### Option B: Pre-onboard via Phone/WhatsApp

Before visiting clinics:
1. Get basic details (name, address, dentist name)
2. Add to database beforehand
3. Then give them the signup link

### Option C: Create "Quick Add Clinic" Admin Tool

Build a simple admin page where you can:
- Enter: clinic name, address, dentist
- Click "Add to Database"
- Immediately available in partner form dropdown

---

## What Each Partner Needs to Complete Form

Once clinics are in dropdown, partners need:

✅ **Email address** (will become login)  
✅ **Password** (for account)  
✅ **Phone number**  
✅ **Services offered** (free text for now)  
✅ **Years of experience**  
✅ **Why join** (optional)  

Everything else gets updated from the database!

---

## Troubleshooting

**Q: After running SQL, clinics still don't appear in dropdown?**
- Clear browser cache
- Try incognito/private window
- Check SQL actually succeeded (run the SELECT query manually)

**Q: Partners get "email already exists" error?**
- They may have tried signing up before
- Use Supabase Auth dashboard to delete old user account
- Have them try again

**Q: Want to delete a test clinic?**
```sql
DELETE FROM public.clinics_data 
WHERE name = 'Test Clinic Name';
```

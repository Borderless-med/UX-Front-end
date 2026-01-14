# SG Clinic Inquiry Form - Setup Instructions

## 🎯 Overview
This system allows users to submit inquiries about Singapore clinics via an online form. All inquiries are tracked in Supabase and notifications are sent via SMTP2GO.

---

## 📋 Setup Checklist

### 1. **Create Supabase Table**

Run this SQL in your Supabase SQL Editor:

```bash
# Navigate to: https://supabase.com/dashboard/project/uzppuebjzqxeaygmwtvr/sql
# Execute: supabase/migrations/20260114_create_sg_clinic_inquiries.sql
```

Or run locally:
```powershell
cd "C:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver"
supabase db push
```

---

### 2. **Deploy Edge Function**

```powershell
# Login to Supabase CLI (if not already logged in)
supabase login

# Link your project
supabase link --project-ref uzppuebjzqxeaygmwtvr

# Set SMTP2GO API Key as secret
supabase secrets set SMTP2GO_API_KEY="your-smtp2go-api-key-here"

# Deploy the function
supabase functions deploy send-inquiry-notification
```

**Get your SMTP2GO API Key:**
1. Login to https://app.smtp2go.com/
2. Go to Settings → API Keys
3. Create new API key with "Send Email" permission
4. Copy the key and use in command above

---

### 3. **Test the System**

1. **Start development server:**
```powershell
npm run dev
```

2. **Navigate to:**
http://localhost:5173/clinics?sel=sg

3. **Test inquiry submission:**
   - Click any clinic's "Contact OraChope.org" button
   - Fill form with test data
   - Submit and check:
     - Supabase table for new row
     - contact@orachope.org inbox for notification
     - User's email for confirmation (if provided)

---

### 4. **Deploy to Production**

```powershell
git add .
git commit -m "Add SG clinic inquiry form with Supabase tracking"
git push
```

Vercel will auto-deploy. Wait 2-3 minutes and test on production.

---

## 📧 Email Notifications

### You will receive emails at: `contact@orachope.org`

**Email format:**
- Subject: "🚨 New [WhatsApp/Email] Inquiry: [Clinic Name]"
- Contains: User details, inquiry message, quick action links
- If WhatsApp: Includes clickable WhatsApp link

### Users will receive confirmation (if email provided):
- Subject: "We received your inquiry about [Clinic Name]"
- Includes: Confirmation message, inquiry details, WhatsApp link (if applicable)

---

## 🗄️ Database Structure

**Table:** `sg_clinic_inquiries`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| clinic_id | INT | Reference to clinic |
| clinic_name | TEXT | Clinic name |
| user_name | TEXT | User's name |
| user_email | TEXT | User's email (optional) |
| user_whatsapp | TEXT | User's WhatsApp (optional) |
| inquiry_message | TEXT | User's question |
| preferred_contact | TEXT | email/whatsapp/either |
| status | TEXT | pending/contacted/resolved/closed |
| created_at | TIMESTAMP | Submission time |
| responded_at | TIMESTAMP | When you responded |
| response_notes | TEXT | Your notes |

---

## 📊 Viewing Inquiries

**Supabase Dashboard:**
https://supabase.com/dashboard/project/uzppuebjzqxeaygmwtvr/editor/24057?table=sg_clinic_inquiries

**Query examples:**

```sql
-- View all pending inquiries
SELECT * FROM sg_clinic_inquiries 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- View today's inquiries
SELECT * FROM sg_clinic_inquiries 
WHERE created_at::date = CURRENT_DATE;

-- Update inquiry status after responding
UPDATE sg_clinic_inquiries 
SET status = 'contacted', 
    responded_at = NOW(),
    response_notes = 'Replied via WhatsApp'
WHERE id = 'inquiry-uuid-here';
```

---

## 🔧 Troubleshooting

### Issue: Form submission fails
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies are enabled

### Issue: No email received
- Verify SMTP2GO API key is set correctly
- Check SMTP2GO dashboard for send logs
- Verify contact@orachope.org inbox

### Issue: Edge function not working
- Check function logs: `supabase functions logs send-inquiry-notification`
- Verify function is deployed: `supabase functions list`
- Re-deploy if needed: `supabase functions deploy send-inquiry-notification`

---

## 💰 Costs

- **Supabase:** Free tier (up to 500MB, 2GB bandwidth)
- **SMTP2GO:** Free tier (1,000 emails/month)
- **Total:** $0/month for up to ~500 inquiries/month

---

## 🎉 Done!

Your inquiry system is ready. Users can now contact you about clinics, and you'll track everything in Supabase.

**Next steps:**
1. Monitor inquiries for first week
2. Respond to users within 24 hours
3. Update inquiry status in Supabase
4. Analyze patterns to optimize conversion

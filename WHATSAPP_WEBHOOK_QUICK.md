# 🚀 WhatsApp Webhook Quick Setup

## 🎯 Goal
Unlock **Authentication** template category (OTP with Copy Code button) via Meta's verification handshake.

---

## ✅ Step-by-Step (5 Minutes)

### 1️⃣ Generate Verify Token
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```
**Copy this token** - you'll use it twice.

### 2️⃣ Add to Vercel
1. Go to https://vercel.com → Your Project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `WHATSAPP_VERIFY_TOKEN`
   - **Value:** [paste token from step 1]
   - **Environments:** All
3. Click **Save**

### 3️⃣ Deploy
```bash
git add .
git commit -m "feat: Add WhatsApp webhook endpoint"
git push origin main
```
Wait 2-3 minutes for deployment.

### 4️⃣ Configure in Meta
1. Go to: https://business.facebook.com/latest/whatsapp_manager/
2. Click **Configuration** → **Webhooks**
3. Enter:
   - **Callback URL:** `https://orachope.org/api/webhooks/whatsapp`
   - **Verify Token:** [paste token from step 1]
4. Click **Verify and Save**
   - ✅ Should show: "Webhook verified successfully"

### 5️⃣ Subscribe to Events
1. Click **Subscribe to Fields**
2. Enable:
   - ✅ `messages`
   - ✅ `message_template_status_update`
3. Click **Subscribe**

### 6️⃣ Test Webhook
1. Send test OTP via booking form
2. Check Vercel logs: https://vercel.com/[project]/logs
3. Look for: `📨 Webhook event received`

### 7️⃣ Create Authentication Template
1. **WhatsApp Manager** → **Message Templates** → **Create Template**
2. **Category:** Authentication (now unlocked ✅)
3. **Template Name:** `authentication_otp`
4. **Body:**
   ```
   Your verification code is {{1}}
   
   This code expires in 5 minutes.
   
   Do not share this code with anyone.
   ```
5. **Buttons:** Add Button → **Copy Code**
6. Submit for approval

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Verification failed | Check `WHATSAPP_VERIFY_TOKEN` in Vercel matches exactly |
| URL not responding | Verify deployment completed, test: `curl "https://orachope.org/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"` |
| Category still locked | Wait 24-48 hours after webhook activation |
| No webhook events | Re-subscribe to `messages` field in Meta |

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `api/webhooks/whatsapp/index.ts` | Webhook endpoint (handles GET verification + POST events) |
| `WHATSAPP_WEBHOOK_SETUP.md` | Detailed setup guide |
| `WHATSAPP_WEBHOOK_QUICK.md` | This quick reference |

---

## 🎉 Success Indicators

✅ Meta verification shows "Webhook verified successfully"  
✅ Vercel logs show `📨 Webhook event received` after test message  
✅ Meta Insights → Messaging shows delivery statistics  
✅ Authentication category unlocked in template creation  
✅ OTP template submitted and approved  

**Webhook URL:** `https://orachope.org/api/webhooks/whatsapp`

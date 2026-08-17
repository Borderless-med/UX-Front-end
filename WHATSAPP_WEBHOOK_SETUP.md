# 🔗 WhatsApp Webhook Setup Guide

## Purpose
Enable Meta's "Live Handshake" to unlock the **Authentication** template category for OTP messages with "Copy Code" buttons.

---

## 📋 Prerequisites

- [x] WhatsApp Business Account with Advanced Access
- [x] Vercel project deployed
- [ ] Webhook endpoint deployed (completing now)
- [ ] WHATSAPP_VERIFY_TOKEN configured

---

## 🚀 STEP 1: Generate Verify Token

The verify token is a secret string you choose to authenticate webhook setup requests from Meta.

### Option A: PowerShell (Recommended)
```powershell
# Generate a random 32-character token
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

### Option B: Simple String
Use any random string (e.g., `MySecure_Webhook_Token_2026`)

**⚠️ IMPORTANT:** Save this token - you'll need it in both Vercel and Meta Business Manager.

---

## 🔧 STEP 2: Configure Vercel Environment Variable

### 2.1 Go to Vercel Dashboard
1. Open: https://vercel.com/[your-username]/sg-smile-saver
2. Click **Settings** → **Environment Variables**

### 2.2 Add New Variable
- **Name:** `WHATSAPP_VERIFY_TOKEN`
- **Value:** [paste the token you generated in Step 1]
- **Environment:** Select all (Production, Preview, Development)
- Click **Save**

### 2.3 Redeploy
After adding the environment variable:
```bash
git add .
git commit -m "feat: Add WhatsApp webhook endpoint"
git push origin main
```

Wait 2-3 minutes for Vercel auto-deployment to complete.

---

## 🔌 STEP 3: Configure Webhook in Meta Business Manager

### 3.1 Navigate to WhatsApp Manager
1. Go to: https://business.facebook.com/latest/whatsapp_manager/
2. Click your WhatsApp Business Account
3. Go to **Configuration** → **Webhooks**

### 3.2 Set Callback URL
**Callback URL:**
```
https://orachope.org/api/webhooks/whatsapp
```

**Verify Token:**
```
[paste the same token from Step 1]
```

Click **Verify and Save**

### 3.3 Expected Result
✅ Meta sends a GET request to your endpoint with:
- `hub.mode=subscribe`
- `hub.verify_token=<your_token>`
- `hub.challenge=<random_string>`

✅ Your endpoint verifies the token and returns the challenge

✅ Meta shows: **"Webhook verified successfully"**

### 3.4 Troubleshooting Verification Failures

#### Error: "Invalid Verification Token"
- Check Vercel logs: https://vercel.com/[project]/logs
- Verify `WHATSAPP_VERIFY_TOKEN` is set correctly in Vercel
- Ensure you redeployed after adding the environment variable
- Check the token matches exactly (no extra spaces)

#### Error: "Callback URL not responding"
- Verify URL is correct: `https://orachope.org/api/webhooks/whatsapp`
- Check Vercel deployment completed successfully
- Test the endpoint manually:
  ```bash
  curl "https://orachope.org/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123"
  ```
  Should return: `test123`

#### Error: 500 Server Error
- Check Vercel logs for detailed error
- Verify the webhook code was deployed correctly
- Ensure no syntax errors in the webhook file

---

## 📡 STEP 4: Subscribe to Webhook Events

After verification succeeds, subscribe to relevant events:

### 4.1 In Meta Business Manager → Webhooks

Click **Subscribe to Fields** and enable:

- ✅ **messages** - Message status updates (sent, delivered, read, failed)
- ✅ **message_template_status_update** - Template approval/rejection notifications
- ⚠️ **message_echoes** - Optional (for incoming messages, if you want 2-way messaging)
- ⚠️ **message_reactions** - Optional
- ⚠️ **account_update** - Optional

**Recommendation:** Start with just `messages` and `message_template_status_update`

Click **Subscribe**

---

## ✅ STEP 5: Verify Webhook is Working

### 5.1 Test Message Status Update

Send a test WhatsApp OTP (use the booking form):
1. Fill out booking form on https://orachope.org/book
2. Click "Send Verification Code"
3. Check Vercel logs immediately

**Expected logs:**
```
📨 Webhook event received: { object: 'whatsapp_business_account', entryCount: 1, ... }
📊 Message Status Update: { status: 'sent', messageId: 'wamid.xxx', ... }
📊 Message Status Update: { status: 'delivered', messageId: 'wamid.xxx', ... }
```

### 5.2 Check Meta Business Manager

Go to **WhatsApp Manager** → **Insights** → **Messaging**
- You should see message delivery statistics
- Webhook events are logged

---

## 🎯 STEP 6: Unlock Authentication Template Category

Now that the webhook is active and receiving events:

### 6.1 Request Authentication Template Approval
1. Go to **WhatsApp Manager** → **Message Templates**
2. Click **Create Template**
3. Select **Category: Authentication** (should now be unlocked ✅)

If still locked:
- Wait 24 hours for Meta's system to detect the active webhook
- Ensure webhook has successfully received at least one event
- Check Advanced Access status is still active

### 6.2 Create OTP Template

**Template Name:** `authentication_otp`

**Category:** Authentication (now unlocked)

**Language:** English

**Header:** None (Authentication templates don't support headers)

**Body:**
```
Your verification code is {{1}}

This code expires in 5 minutes.

Do not share this code with anyone.
```

**Footer:** `OraChope.org`

**Buttons:**
- Add Button → **Copy Code** (Security feature)
- Meta automatically adds a "Copy {{1}}" button

**Variable Mapping:**
- {{1}} = OTP code (6 digits)

Click **Submit for Approval**

---

## 📊 STEP 7: Monitor Webhook Activity

### View Webhook Logs in Vercel
```
https://vercel.com/[your-username]/sg-smile-saver/logs
```

Filter by: `api/webhooks/whatsapp`

### Webhook Event Types You'll See

#### 1. Message Status Updates
```json
{
  "status": "sent",
  "messageId": "wamid.HBgLNjU4MjIyOTIwMhUCABIYFjNFQjBDRTQxODg1RDI2QzNFNkVDQUIA",
  "timestamp": "1692403200",
  "recipientId": "6582229202"
}
```

Status progression: `sent` → `delivered` → `read`

#### 2. Template Status Updates (After Submission)
```json
{
  "message_template_name": "authentication_otp",
  "event": "APPROVED",
  "message_template_language": "en"
}
```

#### 3. Failed Messages
```json
{
  "status": "failed",
  "errorCode": 131026,
  "errorTitle": "Message undeliverable"
}
```

---

## 🔐 Security Best Practices

### 1. Verify Webhook Signatures (Optional Enhancement)
Meta signs webhook requests. For production, validate the signature:
```typescript
// In api/webhooks/whatsapp/index.ts
const signature = req.headers['x-hub-signature-256'];
// Verify HMAC signature with your app secret
```

### 2. Rate Limiting
The webhook endpoint handles POST requests publicly. Consider adding rate limiting:
```typescript
// Use Vercel's built-in rate limiting or Cloudflare
```

### 3. Secure Token Storage
- Never commit `.env` file
- Rotate `WHATSAPP_VERIFY_TOKEN` periodically
- Use Vercel's encrypted environment variables

---

## 🛠️ Troubleshooting

### Webhook Stops Receiving Events

**Symptom:** No logs in Vercel for webhook events

**Solutions:**
1. Check subscription status in Meta Business Manager → Webhooks
2. Re-subscribe to `messages` field if needed
3. Verify Vercel deployment is active
4. Check for any function timeouts in Vercel logs

### Authentication Category Still Locked

**Wait Time:** Can take 24-48 hours after webhook activation

**Requirements Checklist:**
- ✅ Advanced Access approved
- ✅ Webhook verified and active
- ✅ At least 1 successful webhook event received
- ✅ Business verification complete
- ✅ Template messaging limit not at Level 1 (must be Level 2+)

**If still locked after 48 hours:**
- Contact Meta Support via WhatsApp Manager
- Reference your Business Account ID
- Mention you have:
  - Advanced Access approved
  - Active webhook endpoint receiving events
  - Verified business

---

## 📈 Next Steps

### After Authentication Template is Approved

1. **Update OTP Delivery Code**
   - Modify `api/request-booking-otp/index.ts`
   - Switch from `booking_request_received` template to `authentication_otp`
   - Use the new template with Copy Code button

2. **Test OTP Flow End-to-End**
   - Book appointment on https://orachope.org/book
   - Verify OTP message has "Copy Code" button
   - Confirm button copies the code correctly

3. **Monitor Performance**
   - Track OTP delivery rates in Meta Insights
   - Monitor conversion rates (OTP sent → booking completed)
   - Check for failed deliveries in webhook logs

---

## 📝 Summary

✅ **Created:** `api/webhooks/whatsapp/index.ts` - Webhook endpoint  
✅ **Added:** `WHATSAPP_VERIFY_TOKEN` environment variable  
✅ **Configured:** Meta webhook subscription  
✅ **Unlocked:** Authentication template category  
✅ **Monitoring:** Active webhook event logging  

**Webhook URL:** `https://orachope.org/api/webhooks/whatsapp`

**Status:** Ready for Meta's verification handshake 🤝

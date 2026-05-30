# GitHub Actions Cron Setup Guide

## ✅ What Was Created

3 GitHub Actions workflows to replace Vercel Cron (which requires Pro plan):

1. **`.github/workflows/check-expired-bookings.yml`** - Runs every 15 minutes
2. **`.github/workflows/send-urgent-nudges.yml`** - Runs every 15 minutes  
3. **`.github/workflows/send-appointment-reminders.yml`** - Runs every hour

Each workflow pings your Vercel endpoints using the CRON_SECRET for authentication.

---

## 🔧 Setup Steps

### Step 1: Add CRON_SECRET to GitHub Secrets

1. Go to: **https://github.com/gohseowping/sg-smile-saver/settings/secrets/actions**
2. Click **"New repository secret"**
3. Name: `CRON_SECRET`
4. Value: `ikMQFwH3eyCf8nXJuSTVbRza71LPlxKD` (your existing secret)
5. Click **"Add secret"**

### Step 2: Deploy to Vercel

```powershell
cd "C:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver"
git add .
git commit -m "feat: Use GitHub Actions for cron jobs (free alternative to Vercel Pro)"
git push origin main
```

This will:
- Deploy new code to Vercel (without cron restriction)
- Activate GitHub Actions workflows
- Start automated job scheduling

### Step 3: Verify GitHub Actions

1. Go to: **https://github.com/gohseowping/sg-smile-saver/actions**
2. You should see 3 workflows listed:
   - ✅ Check Expired Bookings
   - ✅ Send Urgent Nudges  
   - ✅ Send Appointment Reminders

### Step 4: Test Manually (Optional)

Click any workflow → Click **"Run workflow"** dropdown → Click **"Run workflow"** button

This triggers it immediately for testing (instead of waiting for schedule).

---

## 📊 Monitoring

**Check workflow runs:**
- GitHub Actions tab: https://github.com/gohseowping/sg-smile-saver/actions
- Green checkmark ✅ = Success
- Red X ❌ = Failed (click to see error logs)

**Execution logs show:**
- HTTP status code
- Response body
- Success/failure message

---

## 🔄 How It Works

```
GitHub Actions (free)
  ↓ (every 15 min or 1 hour)
  ↓ curl with Authorization: Bearer {CRON_SECRET}
  ↓
Vercel Endpoint (orachope.org/api/cron/...)
  ↓ verifies CRON_SECRET
  ↓ processes bookings
  ↓ sends notifications
  ↓ returns 200 OK
  ↓
GitHub Actions logs success ✅
```

---

## 💰 Cost Analysis

| Item | Cost |
|------|------|
| GitHub Actions (2,000 min/month free) | $0 |
| Your monthly usage (~1,080 min/month) | $0 |
| Vercel Hobby plan | $0 |
| **Total** | **$0** |

**vs. Vercel Pro:** $20/month = $240/year savings

---

## 🚨 Troubleshooting

**If workflows don't run:**
1. Check CRON_SECRET is added to GitHub Secrets
2. Ensure workflows are in `.github/workflows/` folder
3. Verify repository has Actions enabled (Settings → Actions → General)

**If endpoint returns 401 Unauthorized:**
- CRON_SECRET in GitHub doesn't match CRON_SECRET in Vercel Environment Variables

**If endpoint returns 500 Error:**
- Check Vercel Function logs for detailed error
- Verify Supabase credentials in Vercel Environment Variables

---

## 📝 Next Steps

After deploying:
1. Wait 15 minutes for first scheduled run
2. Check GitHub Actions tab for workflow execution
3. Monitor Vercel Function logs for endpoint calls
4. Create test booking to verify end-to-end flow

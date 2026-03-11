# OralLink Integration - Pages Inventory
**Date:** March 3, 2026  
**Status:** ✅ ALL PAGES CREATED - READY FOR INTEGRATION

---

## 📄 What We Have

### 1. **HOMEPAGE WITH AI SCAN INTEGRATION** ✅
**File:** `public/orallink-homepage-final.html`  
**Purpose:** Main OraChope homepage offering 3 pathways  
**Status:** Production-ready

**Features:**
- ✅ 3-card layout: AI Dental Scan | AI Chatbot | Browse All Clinics
- ✅ AI Scan card has "NEW" badge with subtle pulse animation
- ✅ Beautiful gradient design (emerald-50 to green-50)
- ✅ Clear value prop: "Scan → Analyze → Recommend"
- ✅ Co-branded: OralLink × OraChope partnership mentioned
- ✅ Mobile-responsive Tailwind CSS

**Where it fits in action plan:**
- **Week 1, Day 5-6:** Homepage AI scan button implementation
- This page becomes the entry point for users to discover AI scan feature

---

### 2. **PRE-SCAN LANDING PAGE** ✅
**File:** `public/orallink-prescan-option2.html`  
**URL:** Should be hosted at `orachope.org/ai-scan-intro`  
**Status:** Production-ready

**Features:**
- ✅ Dual logo header (OralLink + OraChope "in partnership with")
- ✅ Welcome banner: "Welcome from OraChope!"
- ✅ Value proposition: "2 minutes to scan • Instant AI analysis"
- ✅ Trust signals: 100% Private, Free Forever, No Commitment
- ✅ Sign-up form: Name + Email (minimal friction)
- ✅ "Return to OraChope" message sets expectations
- ✅ Gradient background (blue-100 to cyan-100)
- ✅ Mobile-optimized

**Where it fits in action plan:**
- **Week 1, Day 5-6:** Pre-scan landing page creation
- **Week 2, Day 12-13:** Pre-scan page finalization
- This is the page users see BEFORE clicking "Start Scan" button

---

### 3. **POST-SCAN LANDING PAGE** ⚠️ (MAY NOT BE USED)
**File:** `public/orallink-landing-option2.html`  
**URL:** Would be `orachope.orallink.health` return page  
**Status:** Created but may not be used due to dead-end problem

**Features:**
- ✅ Success banner with checkmark animation
- ✅ Scan ID display (e.g., #OL-2026-4521)
- ✅ Results summary with recommendations
- ✅ "Find Your Dentist" CTA button returns to OraChope
- ✅ Co-branded header

**Why it may not be used:**
- OralLink/Kells has dead-end problem (no automatic redirect back)
- Custom redirect costs $500-2k that OralLink won't pay
- We're accepting 40-50% user abandonment in Phase 1
- Users who return will manually enter Scan ID in chatbot instead

**Potential future use:**
- If we negotiate custom redirect in Phase 3
- If ROI justifies paying for Kells custom redirect
- As reference design for email follow-up templates

---

## 🎯 How to Use These in Week 1 Integration

### **DAY 1-2: Database + API Setup**
No page changes needed - focus on backend:
- Create `ai_scans` table in Supabase
- Build 3 API endpoints (initiate, verify, return)
- Implement Scan ID generation (OL-2026-XXXX format)

### **DAY 3-4: Chatbot Integration**
Files to modify in `sg-jb-chatbot-LATEST`:
- `ChatWindow.tsx` or equivalent: Add "Get AI Scan" button
- Create `ScanIDModal.tsx`: Pop-up that shows Scan ID before redirect
- Add analytics tracking for button clicks

**Scan ID pop-up should:**
1. Display generated Scan ID (OL-2026-XXXX)
2. Have copy button
3. Show warning: "Save this ID to return to OraChope later"
4. Have "Continue to Scan" button
5. Redirect to `orachope.orallink.health` on click

### **DAY 5-6: Landing Page Deployment**
**Use existing files with minor updates:**

**File 1:** `orallink-homepage-final.html`
- Already has AI scan card with correct messaging
- **Action:** Update "Start AI Scan" button to link to `/ai-scan-intro`
- **Replace line ~85:** Update href from `#` to `/ai-scan-intro`

**File 2:** `orallink-prescan-option2.html`
- **Action:** Deploy to `public/ai-scan-intro.html` (or create route)
- **Verify:** OralLink logo image path is correct
- **Update:** "Start Your Scan" button should:
  1. Capture name + email
  2. POST to API endpoint to create scan record
  3. Show Scan ID modal
  4. Redirect to `orachope.orallink.health`

**File 3:** `orallink-landing-option2.html`
- **Action:** Keep as reference/future use
- **No deployment needed** in Phase 1 (dead-end problem)

### **DAY 7: Testing**
- Test full flow: Homepage → Pre-scan page → Scan ID modal → OralLink redirect
- Verify mobile works on iOS + Android
- Check all co-branding displays correctly
- Ensure analytics tracks each step

---

## 📊 File Status Summary

| File | Status | Week 1 Action | Priority |
|------|--------|---------------|----------|
| `orallink-homepage-final.html` | ✅ Done | Update link to `/ai-scan-intro` | HIGH |
| `orallink-prescan-option2.html` | ✅ Done | Deploy + connect to API | HIGH |
| `orallink-landing-option2.html` | ✅ Done | Archive for future use | LOW |

---

## 🔧 Required Modifications

### 1. Homepage Button Link Update
**File:** `public/orallink-homepage-final.html`
**Current:** `<a href="#" ...>Start AI Scan</a>`
**Update to:** `<a href="/ai-scan-intro" ...>Start AI Scan</a>`

### 2. Pre-scan Form Backend Integration
**File:** `public/orallink-prescan-option2.html`
**Current:** Form has `action="#"` placeholder
**Update to:** Connect to API endpoint `/api/ai-scan/initiate`

**Expected flow:**
```javascript
// When user submits name + email
fetch('/api/ai-scan/initiate', {
  method: 'POST',
  body: JSON.stringify({ name, email }),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  // data.scanId = "OL-2026-XXXX"
  // Show ScanIDModal with scanId
  showScanIDModal(data.scanId);
})
```

### 3. Scan ID Return Flow
**File:** Create new component in chatbot
**Purpose:** Input field for users to enter Scan ID when they return
**Location:** ChatWindow or as separate page `/ai-scan-return`

**Expected flow:**
```javascript
// When user enters scan ID
fetch(`/api/ai-scan/${scanId}/return`, {
  method: 'POST',
  body: JSON.stringify({ userSession }),
})
.then(() => {
  // Mark scan as "returned" in database
  // Continue chatbot conversation with scan context
})
```

---

## ✅ Pages Are Production-Ready

**Good news:** All design work is complete. You have:
- ✅ Beautiful, professional designs
- ✅ Co-branded headers (OralLink + OraChope)
- ✅ Trust signals and value props
- ✅ Mobile-responsive layouts
- ✅ Consistent gradient aesthetics

**Week 1 work is 70% visual design (done), 30% backend integration (to do).**

This means you can focus entirely on:
1. Database schema
2. API endpoints
3. Scan ID generation logic
4. Form submission handling
5. Return flow implementation

**No design work needed** - just connect the beautiful pages you already created to working APIs.

---

## 🎯 Next Steps (March 3-4)

**TODAY:**
1. ✅ Inventory complete (this document)
2. Create `ai_scans` table in Supabase
3. Build POST `/api/ai-scan/initiate` endpoint
4. Build GET `/api/ai-scan/:scanId` endpoint
5. Build POST `/api/ai-scan/:scanId/return` endpoint

**TOMORROW (March 4):**
1. Update homepage link to `/ai-scan-intro`
2. Deploy pre-scan page to production
3. Connect pre-scan form to API
4. Test end-to-end flow
5. Verify mobile compatibility

**Result by March 4 EOD:**
Users can click "Start AI Scan" → See pre-scan page → Submit name/email → Get Scan ID → Redirect to OralLink

---

## 🚀 Confidence Level: HIGH

You're ahead of schedule. The action plan estimated 2 days for landing page creation (Day 5-6), but you already have production-quality pages ready.

**Estimated time savings:** 8-10 hours  
**What this means:** Extra polish time for Issue B mitigation (avoiding looking incompetent)

Use saved time for:
- Extra testing rounds
- Mobile device verification
- Analytics integration
- Demo video creation
- External design review

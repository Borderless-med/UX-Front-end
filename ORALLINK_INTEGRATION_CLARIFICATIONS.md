# OralLink Integration - Clarifications (March 3, 2026)

## 🔍 CLARIFICATION #1: Database & API Endpoints

### What You DON'T Have Yet (Need to Build This Week)
❌ **No database table** for AI scans  
❌ **No API endpoints** to handle scan workflow  
❌ **No backend code** connecting to orachope.orallink.health  

**Important:** You don't need to own/control orallink.health or getkells.com  
- **OralLink owns:** orallink.health domain  
- **Kells owns:** getkells.com (actual AI scan provider)  
- **You build:** Database + APIs **on OraChope side** to track your users

---

### What Are "3 API Endpoints"?

**ENDPOINT #1: POST /api/scans/initiate**  
**Location:** Vercel serverless function (like your other APIs)  
**File:** Create `api/scans/initiate/index.ts`

**What it does:**
```typescript
// When user clicks "Get AI Scan" button in chatbot
// 1. Generate unique Scan ID: "OL-2026-4521"
// 2. Save to Supabase ai_scans table
// 3. Return Scan ID to frontend

export default async function handler(req, res) {
  const { userEmail, userSession } = req.body;
  
  // Generate unique ID
  const scanId = generateScanId(); // "OL-2026-4521"
  
  // Save to database
  await supabase.from('ai_scans').insert({
    scan_id: scanId,
    user_session: userSession,
    status: 'initiated',
    initiated_at: new Date()
  });
  
  return res.json({ scanId, message: 'Scan initiated' });
}
```

**Why you need this:**
- Track which users started AI scans
- Generate unique ID to identify users when they return
- Analytics: How many scans initiated vs completed

---

**ENDPOINT #2: GET /api/scans/:scanId**  
**Location:** `api/scans/[scanId]/index.ts`

**What it does:**
```typescript
// When user enters Scan ID after returning from OralLink
// 1. Look up scan in database
// 2. Verify it exists and is valid
// 3. Return scan details

export default async function handler(req, res) {
  const { scanId } = req.query;
  
  // Look up in database
  const scan = await supabase
    .from('ai_scans')
    .select('*')
    .eq('scan_id', scanId)
    .single();
  
  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }
  
  return res.json(scan);
}
```

**Why you need this:**
- Verify Scan ID is real (not fake/typo)
- Check scan status: initiated → completed → returned
- Restore user context in chatbot

---

**ENDPOINT #3: POST /api/scans/:scanId/return**  
**Location:** `api/scans/[scanId]/return/index.ts`

**What it does:**
```typescript
// When user successfully enters Scan ID
// 1. Mark scan as "returned" in database
// 2. Update returned_at timestamp
// 3. Continue chatbot conversation with scan context

export default async function handler(req, res) {
  const { scanId } = req.query;
  const { userSession } = req.body;
  
  // Update database
  await supabase
    .from('ai_scans')
    .update({
      status: 'returned',
      returned_at: new Date(),
      user_session: userSession
    })
    .eq('scan_id', scanId);
  
  return res.json({ message: 'Welcome back!', status: 'returned' });
}
```

**Why you need this:**
- Track return rate (Critical metric: Target 40-50%)
- Analytics: Which users completed scan and came back
- Attribution: Connect scan → booking conversion

---

### Database Table: `ai_scans`

**Location:** Supabase (you already use this for clinics/bookings)  
**File:** Create migration `supabase/migrations/20260303_create_ai_scans.sql`

```sql
CREATE TABLE ai_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id VARCHAR(20) UNIQUE NOT NULL,  -- "OL-2026-4521"
  user_session VARCHAR(255),             -- Link to user session
  user_email VARCHAR(255),               -- Optional: capture email
  status VARCHAR(20) DEFAULT 'initiated', -- initiated | completed | returned | abandoned
  initiated_at TIMESTAMP DEFAULT NOW(),
  returned_at TIMESTAMP,
  scan_results JSONB,                    -- Store scan results if OralLink provides
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scan_id ON ai_scans(scan_id);
CREATE INDEX idx_status ON ai_scans(status);
CREATE INDEX idx_user_session ON ai_scans(user_session);
```

**Why you need this:**
- Store all scan attempts (successful or not)
- Track metrics: Initiation rate, completion rate, return rate
- Analytics dashboard for Dr Gerald demo

---

### Flow Diagram: Where APIs Fit

```
USER JOURNEY                          YOUR APIs                    EXTERNAL SERVICES
─────────────────────────────────────────────────────────────────────────────────
1. User in chatbot                                                
   "I need root canal"                                           
   ↓                                                              
2. Chatbot shows button:                                         
   [Get FREE AI Scan] ←───────────────────────────────┐         
   User clicks                                         │         
   ↓                                                   │         
3. Frontend calls:                                     │         
   POST /api/scans/initiate ──→ API #1                │         
   ↓                            Creates DB record      │         
4. API returns:                 Returns scan_id       │         
   { scanId: "OL-2026-4521" } ←─ "OL-2026-4521"      │         
   ↓                                                   │         
5. Pop-up modal shows:                                │         
   ┌─────────────────────────┐                        │         
   │ YOUR SCAN ID:           │                        │         
   │ OL-2026-4521           │                        │         
   │ [Copy] [Continue]      │                        │         
   └─────────────────────────┘                        │         
   User copies ID                                     │         
   ↓                                                   │         
6. User clicks Continue                               │         
   Redirects to:                                      │         
   orachope.orallink.health ──────────────────→ OralLink Site
   ↓                                                              
7. User creates account                               Kells.ai
   on OralLink, redirected ──────────────────→ (AI Scan Provider)
   to Kells for scan                                             
   ↓                                                              
8. User completes scan                                            
   DEAD END (no auto redirect) ←─── Issue: Kells doesn't redirect
   ↓                                                              
9. User manually returns                                          
   to OraChope chatbot                                           
   ↓                                                              
10. Chatbot asks:                                                
    "Did you complete scan?"                                     
    User enters: OL-2026-4521                                    
    ↓                                                             
11. Frontend calls:                                               
    GET /api/scans/OL-2026-4521 ──→ API #2                      
    ↓                               Verifies ID exists           
12. Frontend calls:                                               
    POST /api/scans/OL-2026-4521/return ──→ API #3              
    ↓                               Marks "returned"             
13. Chatbot says:                                                
    "Welcome back! Your scan results                             
     show you need root canal.                                   
     Here are 3 clinics..."                                      
```

---

## 🔍 CLARIFICATION #2: Chatbot Integration Files

### What You HAVE (Static Mockups - Not Real Code)
✅ **Visual demos only** - These show how it COULD look:
1. `public/chatbot-scan-mockup-option-a.html` (Proactive early offer)
2. `public/chatbot-scan-mockup-option-b.html` (Reactive uncertainty detection)
3. `public/chatbot-scan-mockup-option-c.html` (Always-available button)
4. `public/chatbot-scan-mockup-hybrid.html` (Recommended approach)

**These are NOT integrated** - They're just design references

---

### What You DON'T Have Yet (Need to Build Day 3-4)

❌ **No "Get AI Scan" button** in real ChatWindow.tsx  
❌ **No Scan ID pop-up modal** component  
❌ **No return flow** in chatbot

**Your actual chatbot file:**
- `src/components/chat/ChatWindow.tsx` (479 lines)
- **Current welcome message:** Basic intro to dental services
- **NO mention of AI scan** in current code

---

### What You Need to Build (Day 3-4: March 5-6)

**FILE #1: Create Scan ID Modal Component**  
`src/components/orallink/ScanIDModal.tsx`

```tsx
import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface ScanIDModalProps {
  scanId: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function ScanIDModal({ scanId, onClose, onContinue }: ScanIDModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(scanId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    onContinue();
    // Redirect to OralLink
    window.location.href = `https://orachope.orallink.health?ref=${scanId}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Your Scan ID</h2>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Save this ID:</p>
            <p className="text-3xl font-bold text-blue-600 mb-3">{scanId}</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 mx-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm text-gray-700">
            ⚠️ <strong>Important:</strong> You'll need this ID to return to OraChope 
            after your scan. Keep it somewhere safe!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
          >
            Continue to Scan <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

**FILE #2: Modify ChatWindow.tsx**  
Add AI Scan button to existing chatbot

**Location to modify:** Lines 50-65 (the welcome message)

**Current code:**
```tsx
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: `Hi! I'm your AI dental concierge for Singapore and JB.\n\nPlanning dental treatment? I can help you:\n\n• Find clinics that offer your service\n\n• Explore options in each location...`,
    sender: 'ai',
    timestamp: new Date(),
  },
]);
```

**Add after welcome message (new state):**
```tsx
const [showScanModal, setShowScanModal] = useState(false);
const [currentScanId, setCurrentScanId] = useState<string | null>(null);
```

**Add button component:**
```tsx
// Add this near the top of ChatWindow component
const handleGetAIScan = async () => {
  try {
    // Call API to initiate scan
    const response = await fetch('/api/scans/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userSession: sessionId,
        userEmail: user?.email
      })
    });
    
    const data = await response.json();
    setCurrentScanId(data.scanId);
    setShowScanModal(true);
    
    // Track analytics
    console.log('AI Scan initiated:', data.scanId);
  } catch (error) {
    console.error('Failed to initiate scan:', error);
  }
};
```

**Add to JSX (render section):**
```tsx
{/* Add after first AI message */}
<div className="flex justify-center my-4">
  <button
    onClick={handleGetAIScan}
    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
  >
    ✨ Get FREE AI Dental Scan
  </button>
</div>

{/* Add modal */}
{showScanModal && currentScanId && (
  <ScanIDModal
    scanId={currentScanId}
    onClose={() => setShowScanModal(false)}
    onContinue={() => {
      setShowScanModal(false);
      // User will be redirected to OralLink
    }}
  />
)}
```

---

**FILE #3: Create Scan ID Input Component**  
`src/components/orallink/ScanIDInput.tsx`

```tsx
import { useState } from 'react';

interface ScanIDInputProps {
  onSubmit: (scanId: string) => void;
}

export default function ScanIDInput({ onSubmit }: ScanIDInputProps) {
  const [scanId, setScanId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate format: OL-YYYY-XXXX
    if (!/^OL-\d{4}-\d{4}$/.test(scanId)) {
      setError('Invalid format. Expected: OL-2026-1234');
      return;
    }

    // Call API to verify scan exists
    try {
      const response = await fetch(`/api/scans/${scanId}`);
      if (!response.ok) {
        setError('Scan ID not found. Please check and try again.');
        return;
      }

      // Mark as returned
      await fetch(`/api/scans/${scanId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSession: sessionStorage.getItem('sessionId') })
      });

      onSubmit(scanId);
    } catch (error) {
      setError('Failed to verify scan. Please try again.');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-semibold mb-2">Welcome back! Enter your Scan ID:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={scanId}
          onChange={(e) => setScanId(e.target.value.toUpperCase())}
          placeholder="OL-2026-1234"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

---

## 🔍 CLARIFICATION #3: Co-Branded Pages - Do They Meet Criteria?

### Criteria for Co-Branding:
✅ **Both logos visible** (OraChope + OralLink)  
✅ **Partnership clearly stated** ("in partnership with")  
✅ **Professional design** (matches both brands)  
✅ **Trust signals** (Free, Private, No commitment)  
✅ **Mobile-responsive**  

---

### PAGE #1: Homepage (orallink-homepage-final.html)
**Status:** ✅ **MEETS CRITERIA**

**Co-branding elements:**
- ✅ OraChope logo in nav (line 38)
- ✅ OralLink mentioned in AI Scan card: "Powered by OralLink & Kells AI" (line 90)
- ✅ Gradient design matches OralLink aesthetic (emerald-50, green-50)
- ✅ Clear partnership positioning

**Test:** Open in browser - verify logos display correctly

---

### PAGE #2: Pre-Scan Landing (orallink-prescan-option2.html)
**Status:** ✅ **MEETS CRITERIA**

**Co-branding elements:**
- ✅ **Dual logo header** (lines 28-36)
  - OralLink logo (large, left side)
  - "in partnership with" text
  - OraChope logo (right side, clickable → orachope.org)
- ✅ **Welcome badge:** "Welcome from OraChope!" (green badge, line 45)
- ✅ **Trust signals:** Free Forever, 100% Private, No Commitment (lines 59-75)
- ✅ **Professional gradient:** Blue-100 to cyan-100 (matches OralLink brand)
- ✅ **Mobile-responsive:** Tailwind CSS (works on all devices)

**Only issue:** Line 31 references local file `OralLink Logo.png`
**Fix needed:** Upload logo to public folder or use URL from OralLink

---

### PAGE #3: Post-Scan Landing (orallink-landing-option2.html)
**Status:** ✅ **MEETS CRITERIA** (but may not be used)

**Co-branding elements:**
- ✅ Same dual logo header as pre-scan page
- ✅ Success banner with professional design
- ✅ Scan ID prominently displayed
- ✅ "Return to OraChope" button

**Why it may not be used:**
- OralLink/Kells has dead-end problem (no automatic redirect)
- You're accepting 40-50% user abandonment in Phase 1
- Page exists as reference for future (if custom redirect negotiated)

---

### VERDICT: All 3 Pages Are Co-Branded ✅

**What needs fixing:**
1. **OralLink logo path** in pre-scan/post-scan pages
   - Current: `<img src="OralLink Logo.png">`
   - Fix: Upload logo to `public/orallink-logo.png`
   - Update: `<img src="/orallink-logo.png">`

2. **Homepage button link**
   - Current: `<a href="#">Start AI Scan</a>`
   - Fix: `<a href="/ai-scan-intro">Start AI Scan</a>`

---

## 🔍 CLARIFICATION #4: Internal Testing Timeline

### When Do We Perform Internal Testing?

**ANSWER: Day 7 (March 9) + Day 14 (March 16)**

---

### **ROUND 1: Day 7 (March 9) - Internal Testing**

**What you're testing:**
- ✅ All components built (database, APIs, chatbot, pop-up, landing pages)
- ❌ **NOT using real OralLink site yet** (they haven't created subdomain)
- ✅ Simulated flow with mock data

**Test checklist:**
```
□ Chatbot loads without errors
□ "Get AI Scan" button appears
□ Click button → Pop-up shows with Scan ID
□ Copy button works (ID copied to clipboard)
□ Continue button works (console logs redirect URL)
□ Pre-scan landing page loads
□ Form submission works (POST /api/scans/initiate)
□ Database record created (verify in Supabase)
□ Mobile testing: iOS Safari, Android Chrome
□ No console errors
```

**How to test without OralLink subdomain:**
- Modify redirect URL to point to placeholder:
  ```typescript
  // Temporary for testing
  window.location.href = `https://example.com?scanId=${scanId}`;
  ```
- After 5 seconds, manually navigate back to chatbot
- Test Scan ID entry → verify "returned" status updates in database

**Pass criteria:** All checkboxes checked, zero critical bugs

---

### **ROUND 2: Day 14 (March 16) - Integration Testing with OralLink**

**What you're testing:**
- ✅ Real OralLink subdomain (orachope.orallink.health)
- ✅ Real Kells.ai scan process
- ✅ Full end-to-end user journey

**Test checklist:**
```
□ User clicks "Get AI Scan" in chatbot
□ Pop-up shows with real Scan ID
□ Redirect to orachope.orallink.health works
□ OralLink signup page loads correctly
□ Create test account (use your email)
□ OralLink redirects to Kells for scan
□ Complete scan with test photos
□ Document: Where does Kells leave user? (the dead-end)
□ Manually navigate back to OraChope chatbot
□ Enter Scan ID → chatbot recognizes return
□ Database shows: status = "returned", returned_at timestamp
```

**Expected issues to document:**
- Dead-end after scan completion (no auto redirect)
- Percentage of real users who return (track this)

**Pass criteria:** Full flow works, dead-end documented, workaround validated

---

### **ROUND 3: Day 17-23 (Soft Launch) - Real User Testing**

**What you're testing:**
- ✅ Real users (5% traffic → 20% traffic)
- ✅ Real metrics (completion rate, return rate, booking rate)
- ✅ VIP support for first 10 scans

**Not "internal testing" anymore - this is production monitoring**

---

## 🗺️ CLARIFICATION #5: How the 3 Pages Fit Into User Journey

### Full User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE USER FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: Discovery
─────────────────────────────────────────────────────────────────────────
🌐 PAGE #1: Homepage (orallink-homepage-final.html)
├─ URL: orachope.org
├─ User sees 3 options:
│  • AI Dental Scan (NEW badge)  ← Entry point for OralLink
│  • AI Chatbot
│  • Browse All Clinics
├─ User clicks: [Start AI Scan] button
└─ Browser navigates to → /ai-scan-intro


STEP 2: Pre-Scan Preparation
─────────────────────────────────────────────────────────────────────────
🌐 PAGE #2: Pre-Scan Landing (orallink-prescan-option2.html)
├─ URL: orachope.org/ai-scan-intro
├─ User sees:
│  • Dual logo header (OralLink + OraChope)
│  • "Welcome from OraChope!" badge
│  • Value prop: "2 minutes to scan • Instant AI analysis"
│  • Trust signals: Free Forever, 100% Private, No Commitment
│  • Form: Name + Email (2 fields only)
├─ User enters: John Doe, john@example.com
├─ User clicks: [Start Your Scan] button
├─ JavaScript calls: POST /api/scans/initiate
│  Backend generates: "OL-2026-4521"
│  Database saves: ai_scans table (status: initiated)
├─ Pop-up modal appears on same page:
│  ┌─────────────────────────────────────┐
│  │ YOUR SCAN ID:                       │
│  │ OL-2026-4521                       │
│  │ [Copy to Clipboard] [Continue]     │
│  └─────────────────────────────────────┘
├─ User clicks: Copy (ID saved to clipboard)
└─ User clicks: Continue
   Browser redirects to → orachope.orallink.health?ref=OL-2026-4521


STEP 3: OralLink Account Creation (External - Not Your Page)
─────────────────────────────────────────────────────────────────────────
🌐 OralLink Site (orachope.orallink.health)
├─ Hosted by: OralLink (Dr Gerald's company)
├─ User sees:
│  • OralLink branding
│  • "Welcome from OraChope" (they track referral)
│  • Signup form: Email + Password
├─ User creates account: john@example.com, password123
├─ OralLink says: "Continue to AI scan"
└─ OralLink redirects to → getkells.com (Kells.ai scan provider)


STEP 4: AI Scan Process (External - Not Your Page)
─────────────────────────────────────────────────────────────────────────
🌐 Kells.ai Site (getkells.com)
├─ Hosted by: Kells (actual AI provider)
├─ User completes scan:
│  1. Upload 4 photos (front, sides, teeth)
│  2. AI analyzes (2-3 minutes)
│  3. Results displayed: "Possible cavity, needs root canal"
├─ ⚠️ DEAD END: Kells doesn't redirect back to OraChope
├─ User sees: "Scan complete" page (Kells branding)
└─ ❌ No automatic return path


STEP 5: User Manually Returns (40-50% Expected)
─────────────────────────────────────────────────────────────────────────
🌐 Back to OraChope Chatbot
├─ URL: orachope.org (user navigates back manually)
├─ User opens chatbot widget
├─ Chatbot detects: "Did you complete your AI scan?"
├─ Chatbot shows: [Enter your Scan ID]
├─ User enters: OL-2026-4521 (from clipboard)
├─ JavaScript calls: GET /api/scans/OL-2026-4521 (verify exists)
├─ JavaScript calls: POST /api/scans/OL-2026-4521/return (mark returned)
├─ Database updates: status = "returned", returned_at = NOW()
├─ Chatbot says:
│  "Welcome back! Based on your scan results, you need root canal.
│   Here are 3 clinics near you that specialize in root canal..."
└─ User proceeds to book appointment


──────────────────────────────────────────────────────────────────────────
UNUSED PAGE #3: Post-Scan Landing (orallink-landing-option2.html)
─────────────────────────────────────────────────────────────────────────
🌐 Would be used IF Kells allowed custom redirect (they don't)
├─ URL: Would be orachope.orallink.health/complete
├─ User would see:
│  • Success banner: "Scan Complete!"
│  • Scan ID displayed: OL-2026-4521
│  • Big button: [Return to OraChope]
│  • Click → redirects back to orachope.org
├─ This would boost return rate to 85-90%
└─ But costs $500-2k that OralLink won't pay (Phase 1)
```

---

### Summary: 3 Pages = 3 Stages

| Page | Stage | User Location | Status |
|------|-------|---------------|--------|
| **Homepage** | Discovery | orachope.org | ✅ Entry point |
| **Pre-Scan Landing** | Preparation | orachope.org/ai-scan-intro | ✅ Used always |
| **Post-Scan Landing** | Return | Would be orachope.orallink.health/complete | ⚠️ Not used (dead-end) |

---

## 📋 QUICK REFERENCE: What Exists vs What to Build

### ✅ ALREADY EXISTS (Design Complete)
1. Homepage with AI Scan card
2. Pre-scan landing page (co-branded)
3. Post-scan landing page (archive for future)
4. Mockup HTML files (visual reference)

### ❌ NEEDS TO BE BUILT (Week 1 Work)
1. **Database:** ai_scans table in Supabase
2. **API #1:** POST /api/scans/initiate
3. **API #2:** GET /api/scans/:scanId
4. **API #3:** POST /api/scans/:scanId/return
5. **Component #1:** ScanIDModal.tsx (pop-up)
6. **Component #2:** Modify ChatWindow.tsx (add button)
7. **Component #3:** ScanIDInput.tsx (return flow)
8. **Fix:** OralLink logo path in landing pages
9. **Fix:** Homepage button link to /ai-scan-intro

---

## 🎯 This Week's Priorities (March 3-9)

### TODAY (Day 1 - March 3):
1. ✅ Read this document (you're doing it now)
2. Create database migration file
3. Create 3 API endpoint folders/files
4. Test database connection

### TOMORROW (Day 2 - March 4):
1. Implement API logic (generate ID, store, retrieve)
2. Test APIs with Postman or curl
3. Fix OralLink logo path in landing pages

### WEDNESDAY (Day 3 - March 5):
1. Create ScanIDModal.tsx component
2. Modify ChatWindow.tsx (add button)
3. Create ScanIDInput.tsx component

### THURSDAY (Day 4 - March 6):
1. Connect all components together
2. Test button → modal → redirect flow
3. Test return flow → ID entry → verification

### FRIDAY (Day 5 - March 7):
1. Deploy pre-scan landing page to production
2. Update homepage button link
3. Mobile testing

### SATURDAY (Day 6 - March 8):
1. Polish UI/UX
2. Add analytics tracking
3. Create demo video

### SUNDAY (Day 7 - March 9):
1. **INTERNAL TESTING DAY**
2. Fix all bugs found
3. Prepare for Week 2 (OralLink coordination)

---

## Questions Answered ✅

✅ **Q1: Database & API - What are they?**  
A: Backend code on YOUR side to track scans. 3 endpoints = initiate, verify, return.

✅ **Q2: Chatbot integration - Do we have it?**  
A: NO. Mockups exist (visual reference). Real code needs to be built (Day 3-4).

✅ **Q3: Do 3 pages meet co-branding criteria?**  
A: YES. All have dual logos, partnership messaging, professional design. Only fix needed: OralLink logo file path.

✅ **Q4: When is internal testing?**  
A: Day 7 (March 9) = Internal only. Day 14 (March 16) = With real OralLink site.

✅ **Q5: Where do 3 pages fit?**  
A: Homepage = Discovery → Pre-scan = Prep → Post-scan = Unused (dead-end problem)

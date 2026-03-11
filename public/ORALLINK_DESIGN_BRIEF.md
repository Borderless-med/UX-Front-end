# OralLink × OraChope Landing Pages - Design Brief

## 📄 PAGE 1: PRE-SCAN SIGNUP PAGE

### **Main Goal**
Convert OraChope visitors into OralLink scan users with minimal friction while setting clear expectations about the partnership journey.

---

### **Key Design Elements & Rationale**

**1. DUAL LOGO HEADER (OralLink + OraChope)**
- **Why:** Establishes immediate trust and legitimacy
- **Benefit to OralLink:** Leverages OraChope's existing user trust (5,000+ patient reviews)
- **Benefit to OraChope:** Associates brand with cutting-edge AI technology
- **Design note:** OralLink logo is larger (primary service provider), OraChope logo clickable (return path)

**2. "WELCOME FROM ORACHOPE" BADGE**
- **Why:** Reinforces that this is a referred, trusted experience (not random paid ad)
- **Psychology:** Users feel guided, not sold to
- **Result:** Higher completion rates vs cold traffic

**3. QUICK SIGNUP FORM (Email + Password Only)**
- **Why:** Minimal friction = higher conversion
- **OralLink benefit:** Captures leads with just 2 fields (can collect more data post-scan)
- **Industry standard:** 30-second signup vs 3-minute forms = 3x conversion rate

**4. "AFTER YOUR SCAN" RETURN MESSAGE**
- **Why:** Sets expectation that user will return to OraChope (transparency = trust)
- **OralLink benefit:** Users understand the full journey, less confusion/abandonment
- **OraChope benefit:** Confirms we'll receive users back with scan data

**5. "WHAT WE DETECT" SECTION**
- **Why:** Manages expectations (screening tool, not diagnosis)
- **Risk mitigation:** Clear about AI capabilities prevents disappointment/complaints
- **OraChope benefit:** Users arrive back knowing what treatments to ask about

---

### **Win-Win Partnership Design**

| Element | OralLink Wins | OraChope Wins |
|---------|---------------|----------------|
| Co-branding | Credibility from established platform | Association with AI innovation |
| Return path clarity | Less user confusion = better reviews | Guaranteed traffic return |
| Treatment detection | Users understand AI value | Users arrive with specific needs (better conversions) |
| Transparent pricing mention | Sets expectation for paid services later | Users know OraChope helps compare costs |

---

## 📄 PAGE 2: POST-SCAN RESULTS PAGE

### **Main Goal**
Deliver scan results clearly while seamlessly guiding users back to OraChope to convert insights into clinic bookings.

---

### **Key Design Elements & Rationale**

**1. SCAN ID IN BODY (Not header)**
- **Why:** Easy for users to reference in chatbot ("My scan ID is OL-2026-4521")
- **OralLink benefit:** Reduces support tickets ("Where's my scan ID?")
- **OraChope benefit:** Users can resume conversation later with ID

**2. RESULTS SUMMARY (Top 3 findings)**
- **Why:** Prioritizes actionable insights over overwhelming data
- **Psychology:** 3 items = memorable, actionable
- **Both parties benefit:** Clear findings = clear booking intent

**3. PROMINENT "RETURN TO ORACHOPE" CTA (After results, no scrolling)**
- **Why:** Strikes while iron is hot - user just got concerning findings, wants solutions NOW
- **OralLink benefit:** Higher return rate = proves partnership value = ongoing collaboration
- **OraChope benefit:** Users arrive with urgency, higher booking conversion
- **Placement:** Immediately after scan results (not buried in footer) = 5x higher click rate

**4. TWO RETURN PATHWAYS EXPLANATION**
- **Mobile:** "Tell chatbot what was detected" (90% of users)
- **Desktop:** "Upload PDF report" (power users)
- **Why:** Flexibility reduces friction - users choose their preferred method
- **OraChope benefit:** Chatbot can handle both = no manual support needed

**5. ORACHOPE BENEFITS PREVIEW (Pricing, Reviews, SG+JB options)**
- **Why:** Pre-sells OraChope value before user clicks
- **Psychology:** "What's in it for me?" answered upfront = higher click rates
- **OralLink benefit:** Less "Why am I being sent away?" confusion

**6. CLICKABLE ORACHOPE LOGO (Header)**
- **Why:** Provides secondary return path if user misses main CTA
- **Fail-safe design:** User can always get back, even if confused

---

### **Win-Win Partnership Design**

| Element | OralLink Wins | OraChope Wins |
|---------|---------------|----------------|
| Clear results display | Users appreciate AI = positive reviews | Users arrive knowing what treatment they need |
| Immediate return CTA | Proves scan-to-booking conversion value | Captures users at peak motivation |
| Two return pathways | Accommodates all user types = less drop-off | Flexible intake = fewer support requests |
| "Compare clinics" messaging | Positions scan as first step in journey | Sets expectation for platform value |
| Scan ID prominent | Reduces "lost result" support tickets | Easy for chatbot to reference |

---

## 🚀 NEXT STEPS UPON APPROVAL

### **Required from OralLink:**

**Technical Setup (Week 1-2):**
- [ ] **Subdomain provisioning:** Create `orachope.orallink.health`
- [ ] **Return URL parameters:** Confirm structure: `https://orachope.org/?from_scan=true&scan_id=OL-2026-4521`
- [ ] **Staging environment:** Provide test URL for end-to-end flow testing
- [ ] **Test credentials:** Sample accounts for integration testing

**Design Implementation (Week 2-3):**
- [ ] **Build pages:** Implement approved designs in OralLink platform
- [ ] **Logo integration:** Add OraChope logo to header/footer
- [ ] **Return button:** Configure "Return to OraChope" with correct URL parameters
- [ ] **Mobile optimization:** Ensure responsive design (90% of traffic mobile)

**Data & Analytics (Week 3):**
- [ ] **Webhook/API (optional):** If OralLink can push scan results to OraChope automatically
- [ ] **UTM tracking:** Add `?utm_source=orachope` to all links for analytics
- [ ] **Conversion tracking:** Share metrics (scans started → completed → returned)

**Legal/Compliance (Parallel track):**
- [ ] **Partnership agreement:** Revenue share, referral terms, exclusivity
- [ ] **PDPA compliance:** Data processing agreement (Singapore jurisdiction)
- [ ] **User consent language:** Joint privacy policy or separate disclosure
- [ ] **Liability disclaimer:** Who's responsible if AI scan incorrect

---

### **Required from OraChope:**

**Technical Setup (Week 1-2):**
- [ ] **Return URL handler:** Detect `?from_scan=true` parameter → auto-open chatbot
- [ ] **Welcome message:** "I see you completed your scan! Tell me what it found..."
- [ ] **Session preservation:** Pass `session_id` in outbound URL to maintain context
- [ ] **Mobile testing:** Verify flow on Safari (iOS) and Chrome (Android)

**Chatbot Training (Week 2):**
- [ ] **Scan finding prompts:** Train bot to recognize "I have cavities" / "Gum disease"
- [ ] **Scan ID handling:** If user provides ID, acknowledge and assist
- [ ] **Treatment matching:** Map scan findings → relevant clinics
- [ ] **Fallback responses:** If user unclear, guide them to describe findings

**Marketing Materials (Week 3):**
- [ ] **Homepage CTA:** Update "AI Dental Scan" card with OralLink partnership
- [ ] **Chatbot welcome:** Add scan offer (Option A): "Not sure what you need? Take a FREE 2-minute AI scan..."
- [ ] **Persistent button:** Add scan button to chatbot header (Option C)
- [ ] **Email templates:** Confirmation emails mentioning OralLink partnership

**Analytics Setup (Week 3):**
- [ ] **Track scan clicks:** How many users click scan CTA from chatbot
- [ ] **Track returns:** How many users complete scan and return
- [ ] **Track bookings:** Do scan users book more clinics?
- [ ] **Compare conversion:** Scan users vs non-scan users booking rate

---

## 📊 SUCCESS METRICS (First 3 Months)

### **Shared KPIs:**
- **Primary:** Scan completion → clinic booking conversion rate (target: 15%+)
- **Engagement:** Return rate from OralLink → OraChope (target: 70%+)
- **Quality:** User satisfaction with AI scan accuracy (target: 4.0+ / 5.0)
- **Volume:** 200+ scans completed per month by Month 3

### **OralLink-specific KPIs:**
- Scan abandonment rate (target: <30%)
- Photo upload quality/success rate (target: 90%+)
- AI processing time (target: <5 seconds)
- Support ticket volume (target: <5% of scans)

### **OraChope-specific KPIs:**
- Chatbot conversation quality post-scan (target: 80%+ successful matching)
- Clinic booking conversion from scan users (target: 2x vs non-scan users)
- Revenue per scan user (target: 15%+ higher than average)
- User retention (scan users return for future treatments)

---

## 🤝 PARTNERSHIP PHILOSOPHY

**These designs embody three core principles:**

1. **Transparency Over Tricks**
   - Users know they're in a partnership flow (not hidden redirect)
   - Clear about what happens next (return to OraChope)
   - Honest about AI capabilities (screening, not diagnosis)

2. **User-First, Revenue-Second**
   - Minimal friction (quick signup, clear return path)
   - Mobile-optimized (where users actually are)
   - Flexible options (tell chatbot OR upload PDF)

3. **Mutual Value Creation**
   - OralLink gets qualified leads + brand exposure
   - OraChope gets users with specific needs + conversion data
   - Users get free AI scan + easier clinic matching

**When both parties win, users win. When users win, everyone wins.**

---

## ❓ QUESTIONS FOR ORALLINK?

Please confirm or provide feedback on:

1. **Timeline:** Can you implement these designs within 3-4 weeks?
2. **Subdomain:** Is `orachope.orallink.health` feasible? Alternative naming?
3. **URL parameters:** Can you pass scan findings back in URL? (e.g., `&findings=cavities,gum_disease`)
4. **API access:** Can OraChope access scan results later if user provides ID?
5. **Analytics:** Can you share conversion metrics (scans started → completed → returned)?
6. **Branding:** Any concerns with logo sizing, color scheme, or partnership language?
7. **Legal:** Who will draft partnership agreement? What terms are non-negotiable?
8. **Support:** How should we handle user issues that span both platforms?

---

**Contact:** [Your Name] | OraChope | [Your Email]

**Next Meeting:** Schedule technical integration call to align on API specs, timelines, and testing plan.

# Clinic Card Compliance - Q&A for Partners
**Date:** January 13, 2026  
**Re:** SDA Prototype Submission (Jan 20 deadline)  
**Your Goal:** Submit compliant prototype showing both SG & JB clinics without authorization delays

---

## 🎯 YOUR CONSTRAINTS (Understood)

✅ **Timeline:** 7 days to SDA submission (Jan 20)  
✅ **Cannot:** Get authorization from 100 SG clinics in time  
✅ **Must:** Show both SG and JB clinics (avoid bias appearance)  
✅ **Solution:** Two-tier system (JB full, SG minimal)

---

## EVIDENCE-BASED ANSWERS

### 1. ✅ YES - Minimal "Bare Facts" Listing is Compliant

**Can we strip SG clinics to bare minimum?**

**Answer: ABSOLUTELY YES**

**Legal Basis (HCSA 2020):**

**Section 2 - Definition:**
> "healthcare advertisement" means any communication, whether in written, printed, pictorial, visual or other form, that **promotes or is intended to promote, directly or indirectly, or that solicits or is calculated to solicit** the provision of any healthcare service

**Key Phrase:** "promotes or solicits"

**Analysis:**
- Minimal directory (name/address/phone/website) = **factual information only**
- No promotion = NOT advertisement
- No solicitation = No Section 31 violation

**What Constitutes "Promotion/Solicitation":**
- ❌ "Book Now" button (active solicitation)
- ❌ Google ratings display (implied endorsement)
- ❌ Service categories ("We offer X, Y, Z") (marketing)
- ❌ Verification badges ("✓ Verified") (endorsement)
- ✅ Name, address, phone, website link (factual directory info)

**Conclusion:** Minimal cards = compliant directory listing, NOT advertisement

---

## 📋 SUMMARY OF DECISIONS

| Question | Decision | Evidence-Based Rationale |
|----------|----------|-------------------------|
| **Strip SG cards to minimum?** | ✅ YES | HCSA Section 2: Minimal directory (no promotion/solicitation) ≠ advertisement |
| **Book Now button?** | 🗑️ DELETE | Reg 5(1)(g): Direct solicitation violates "must not solicit patronage" |
| **Google Reviews button?** | 🗑️ DELETE | Reg 14: Display of ratings = testimonial/endorsement |
| **Website button?** | ✅ RETAIN | Informational link to clinic's own site (they control content) |
| **Details button?** | 🗑️ DELETE | Unnecessary for minimal cards, requires auth |
| **Update button?** | ⚠️ MODIFY | Rename to "Claim/Remove" - operational, not promotional |
| **Display Google ratings?** | ❌ NO | Reg 14: Ratings = testimonials/endorsements |
| **Display review volume?** | ❌ NO | Same rationale - promotional function |
| **Opt-out placement?** | ✅ Two locations: On card + Page banner | Maximum visibility |
| **"Pending Verification" badge?** | 🗑️ REMOVE | Implies endorsement, doesn't provide legal protection |

**Bottom Line:** Strip SG cards to name, address, phone, website only. Remove ALL promotional elements.

---

## 2. DETAILED CTA ANALYSIS (Retain/Modify/Delete)

### ❌ DELETE: "Book Now" Button

**Current Function:** Links to /book-now page with clinic name pre-filled

**Why Delete:**
**HCSA Reg 5(1)(g) - Soliciting Patronage:**
> "A healthcare advertisement must not... **solicit the patronage of any person** or members of the public generally in relation to the provision of any healthcare service"

**Legal Analysis:**
- "Book Now" = active solicitation for appointments
- Button creates conversion funnel (user → booking)
- Transforms directory listing into advertisement
- Direct violation of "must not solicit" prohibition

**Risk:** 🔴 HIGH - This single button makes entire card an "advertisement"

**Action:** Remove from SG clinic cards entirely

---

### ❌ DELETE: "Google Reviews" Button/Link

**Current Function:** Links to Google Maps reviews page for clinic

**Why Delete:**
**HCSA Reg 14 - Testimonials:**
> "(1) A healthcare advertisement must not contain any **testimonial or endorsement**, whether express or implied, by any person of the healthcare services...  
> (2) ...whether the testimonial or endorsement is **given by a person** in Singapore or elsewhere"

**Legal Analysis:**
- Google ratings = aggregated patient testimonials
- Displaying star ratings = implied endorsement
- Even third-party reviews become testimonial when platform promotes them
- MOH/SDC interpret "testimonial" VERY broadly

**Precedent:**
- MOH Healthcare Services (Advertisement) Regulations 2007 explicitly prohibited "ratings of healthcare services"
- 2020 HCSA maintains same intent

**Counter-Argument (Weak):**
- "It's third-party data, not our testimonial"
- "Other platforms show Google ratings"

**Rebuttal:**
- Platform CHOOSES to display ratings → editorial decision
- Displaying ratings influences patient choice → promotional function
- SDC guidance (Jan 6 meeting): No ranking/rating displays

**Risk:** 🔴 HIGH - Reg 14 violation, SDA will flag

**Action:** Remove rating display AND review link from SG cards

**Alternative (If User Still Wants):**
Add text: "Reviews available on Google Maps - search clinic name to verify independently"

---

### ✅ RETAIN: "Website" Button

**Current Function:** Opens clinic's own website in new tab

**Why Retain:**
**Informational Link (Not Promotional):**
- Directs to clinic's own site (they control content)
- OraChope doesn't vouch for or endorse clinic
- User leaves platform to verify independently
- Similar to phone number listing (informational contact method)

**Legal Analysis:**
- Website link = neutral directory information
- Not different from displaying phone number
- Clinic is responsible for own website content
- Platform merely provides link (like phone book)

**Precedent:**
- HealthHub, MOH directories include website links
- Standard practice for directory listings

**Risk:** 🟢 LOW - Compliant

**Action:** Keep website button on SG cards

**Design:**
```
[🌐 Visit Website]
```

---

### ❌ DELETE: "Details" Button

**Current Function:** Shows practitioner details (dentist names, MDA licenses) - requires user login

**Why Delete for Minimal Cards:**
- Unnecessary for minimal directory listing
- Adds complexity (authentication required)
- Implies detailed vetting/endorsement by platform
- Not core to factual directory information

**Alternative:**
If clinic has authorized listing in future, practitioner details can be shown on full cards

**Risk:** 🟡 MEDIUM (not prohibited, but unnecessary)

**Action:** Remove from minimal SG cards

---

### ⚠️ MODIFY: "Update" Button

**Current Function:** Allows clinic to claim/update listing

**Why Modify (Not Delete):**
- **Operational button** (not promotional)
- Serves compliance function (opt-out mechanism)
- Demonstrates respect for practitioner autonomy
- Required for HCSA Section 31 mitigation

**Changes Needed:**
1. **Rename:** "Update" → "Claim/Remove" or "Manage Listing"
2. **Styling:** Use orange/warning color (not promotional blue/green)
3. **Tooltip:** "Update clinic info or request removal"

**Legal Basis:**
- Allows clinics to exercise control over listing
- Opt-out mechanism shows good faith
- Not promotional (operational necessity)

**Risk:** 🟢 LOW - Compliant operational button

**Action:** Keep but modify styling/wording

**Design:**
```
[📝 Claim/Remove]
(orange border, links to /opt-out-report?clinic=NAME)
```

---

## 3. GOOGLE RATINGS DISPLAY - DETAILED ANALYSIS

### ❌ NO - Do Not Display Ratings or Review Counts

**Should minimal cards show: "5.0 ★★★★★ (452 reviews)"?**

**Answer: ABSOLUTELY NOT**

### Legal Analysis (HCSA Reg 14)

**Regulation Text:**
> "(1) A healthcare advertisement must not contain any **testimonial or endorsement**, whether express or implied...  
> (2) For the purposes of subsection (1), it does not matter whether the testimonial or endorsement is given by a person in Singapore or elsewhere, or **in the form of personal experiences or the gratitude** of any person"

**Why Ratings = Testimonials:**
1. **Personal experiences** - Each review is patient experience
2. **Gratitude** - Positive ratings express satisfaction
3. **Endorsement** - 5.0 stars = "We recommend this clinic"
4. **Whether express or implied** - Even passive display counts

### Arguments FOR Display (All Weak):

**Argument 1:** "It's third-party data from Google"
**Rebuttal:** Reg 14(2) says "it does not matter...given by a person in Singapore or elsewhere." Source doesn't matter - display is what matters.

**Argument 2:** "We're just showing factual information"
**Rebuttal:** Testimonials ARE factual (real patient feedback), but Reg 14 prohibits them anyway. "Factual" ≠ "permitted."

**Argument 3:** "Other platforms show Google ratings"
**Rebuttal:** 
- Most platforms are NOT healthcare directories (avoid HCSA)
- Those that are may be non-compliant (DXD precedent)
- SDC specifically flagged ratings in Jan 6 meeting

**Argument 4:** "It helps users make informed decisions"
**Rebuttal:** Reg 14 prioritizes preventing inducement over consumer information. Legislative intent is clear.

### Arguments AGAINST Display (Strong):

**Argument 1: Promotional Function**
- Star ratings influence patient choice
- "5.0 stars" → "This clinic must be good"
- Drives traffic to higher-rated clinics = solicitation

**Argument 2: Platform Endorsement**
- By choosing to display ratings, platform editorializes
- Platform says "We think ratings are important for you to see"
- This is implied endorsement

**Argument 3: SDC/SDA Sensitivity**
- Jan 6, 2026 meeting: SDA explicitly concerned about "ranking/rating displays"
- Dr. Kelvin/Gerald warned against public comparisons
- SDA will VIEW this as promotional, regardless of legal technicality

**Argument 4: Regulatory Precedent**
- MOH 2007 Regulations explicitly prohibited "ratings of healthcare services"
- 2020 HCSA maintains same policy intent
- Compliance officers will interpret ratings as testimonials

### Risk Assessment

| Scenario | Legal Risk | SDA Perception | Recommendation |
|----------|-----------|----------------|----------------|
| **Show ratings on SG cards** | 🔴 **HIGH** (Reg 14 violation) | "Promotional comparison, not neutral" | ❌ DO NOT |
| **Show ratings on JB only** | 🟡 MEDIUM (inconsistency) | "Why different? Suggests bias" | ❌ AVOID |
| **Hide all ratings** | 🟢 LOW (compliant) | "Neutral directory approach" | ✅ RECOMMENDED |
| **Show text "Reviews on Google"** | 🟢 LOW (informational) | "Reasonable transparency" | ✅ ACCEPTABLE |

### Pros of Hiding Ratings:

✅ **Compliance:** No Reg 14 violation  
✅ **SDA approval:** Demonstrates good faith  
✅ **Neutral positioning:** All clinics equal treatment  
✅ **Defensible:** Clear regulatory basis

### Cons of Hiding Ratings:

❌ **User experience:** Less information for decision-making  
❌ **Competitive disadvantage:** Other platforms may show ratings  
❌ **Lower engagement:** Users may prefer directories with ratings  
❌ **Clinic feedback:** High-rated clinics may object

### RECOMMENDATION:

**For SG Minimal Cards:** 🗑️ **Remove ratings display entirely**

**Alternative Text (If Needed):**
```
"Reviews available on Google Maps. Search clinic name to verify independently."
```

**For JB Cards:** Keep ratings (outside SDC jurisdiction)

---

## 4. OPT-OUT BUTTON PLACEMENT - TWO LOCATIONS

### Location A: On Every SG Clinic Card (Primary)

**Visual Design:**
```
┌────────────────────────────────────┐
│ ADVANCED DENTAL SIMEI             │
│ 3 Simei Street 6 #02-31           │
│ Singapore 528833                   │
│ ☎️ +65 6123 4567                   │
│                                    │
│ ┌─────────────┐  ┌──────────────┐│
│ │ 🌐 Website  │  │ 📝 Claim/    ││
│ │             │  │    Remove    ││
│ └─────────────┘  └──────────────┘│
│                                    │
│ Clinic owner? Claim or remove      │
│ listing → [link]                   │
└────────────────────────────────────┘
```

**Button Behavior:**
- Clicks "Claim/Remove" button OR footer link
- Navigates to: `/opt-out-report?clinic=CLINIC_NAME&clinicId=ID`
- Form pre-fills with clinic details
- Clinic can request removal or claim for updates

**Why This Works:**
✅ **Maximum visibility** - Clinic owners see button immediately  
✅ **Low friction** - 1 click from card to opt-out form  
✅ **Demonstrates compliance** - SDA reviewers see proactive opt-out  
✅ **Respects autonomy** - Clinics control their presence

**Styling:**
- Orange/warning color (not promotional blue/green)
- Border outline style (not solid fill)
- Clear icon (📝 or 🚫)
- Accessible font size

---

### Location B: Page-Level Banner (Secondary)

**Visual Design:**
```
┌──────────────────────────────────────────────────────┐
│ ℹ️ For Clinic Owners                                 │
│                                                       │
│ Listings are based on publicly available             │
│ information. [Claim Your Listing] to update details  │
│ or [Request Removal] to opt-out.                     │
│                                                       │
│ Questions? Contact us at support@orachope.org        │
└──────────────────────────────────────────────────────┘
```

**Placement:** Top of /clinics page, above clinic grid

**Banner Behavior:**
- Persistent (sticky position or fixed at top)
- Collapsible with "X" button (user can dismiss)
- Links to `/opt-out-report` or `/contact-us`

**Why This Works:**
✅ **Persistent visibility** - Always visible as users scroll  
✅ **Clear communication** - Explains basis for listings  
✅ **Professional** - Shows platform respects clinics  
✅ **Alternative access** - If user misses card button

**Styling:**
- Blue background (informational, not warning)
- Subtle border
- Non-intrusive (doesn't block content)
- Mobile responsive (collapses on small screens)

---

### Implementation Code Snippets

**Card Footer (Location A):**
```tsx
{/* Opt-Out Notice */}
<div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
  Clinic owner?{' '}
  <button
    onClick={() => navigate(`/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id}`)}
    className="text-orange-600 hover:text-orange-700 underline font-medium"
  >
    Claim or remove listing
  </button>
</div>
```

**Page Banner (Location B):**
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-blue-900 font-medium mb-1">
        For Clinic Owners
      </p>
      <p className="text-xs text-blue-700">
        Listings are based on publicly available information.{' '}
        <a 
          href="/opt-out-report" 
          className="underline font-medium hover:text-blue-900"
        >
          Claim your listing
        </a> to update details or{' '}
        <a 
          href="/opt-out-report" 
          className="underline font-medium hover:text-blue-900"
        >
          request removal
        </a>.
      </p>
    </div>
  </div>
</div>
```

---

## 5. "PENDING VERIFICATION" BADGE - ANALYSIS

### ⚠️ What It Means (Currently)

**Technical Definition:**
- Orange badge: "🟠 Pending Verification"
- Green badge: "✅ Verified"
- Indicates clinic has/hasn't completed OraChope's internal verification process

**Verification Process (Assumed):**
- Clinic provides MDA license number
- Clinic signs partnership agreement
- Clinic confirms listing details
- OraChope validates information

### ❌ Does It Protect Us? NO

**Why "Pending" Doesn't Provide Legal Protection:**

**Problem 1: Implies Endorsement System**
- "✅ Verified" = OraChope vouches for quality/legitimacy
- Platform becomes gatekeeper of clinic quality
- Creates implied ranking: Verified > Pending
- **SDC 4.1.1 violation:** Cannot make superiority/inferiority claims

**Problem 2: Doesn't Exempt from Section 31**
- "Pending" ≠ "We don't have authorization to advertise"
- Badge still appears on promotional card (with Book Now, ratings, etc.)
- HCSA Section 31 applies regardless of verification status
- "Pending verification" isn't a legal safe harbor

**Problem 3: Creates Two-Tier Perception**
- Verified clinics = premium treatment
- Pending clinics = second-class/unvetted
- **SDA concern:** "Why are some SG clinics verified and others not?"
- Implies OraChope is quality arbiter (jurisdictional overreach)

**Problem 4: No Regulatory Basis**
- HCSA doesn't recognize "platform verification" as exemption
- MOH licensing is official verification (not OraChope's)
- Platform verification ≠ regulatory compliance

### Legal Analysis

**HCSA Section 31:**
> "A person, not being a licensee, must not publish or cause to be published any healthcare advertisement unless the person has the **written approval of the licensee** to whom the advertisement relates."

**Key Questions:**
1. Does "Pending Verification" mean "We don't have written approval"?
   - If YES: You're admitting Section 31 violation
   - If NO: Then what does it mean?

2. Does badge make it "not an advertisement"?
   - NO - Advertisement is determined by content (Book Now, ratings, etc.), not verification status

3. Does it protect OraChope from liability?
   - NO - Doesn't change legal classification of card
   - Clinic can still complain: "I never authorized this listing"

### RECOMMENDATION for Minimal SG Cards

**🗑️ REMOVE ALL VERIFICATION BADGES**

**Rationale:**
1. **Neutrality:** Minimal directory = all clinics equal
2. **Avoid Ranking:** No implied quality hierarchy
3. **Simplicity:** Factual info only (name/address/website)
4. **Compliance:** No endorsement or disparagement

**For JB Cards:** Can keep badges (outside SDC jurisdiction)

### Alternative Approach (If Verification Matters Later)

**Post-Authorization (Full Cards):**
Instead of "Verified" badge, use:
- "✓ Partner Clinic" (indicates business relationship)
- "✓ Authorized Listing" (indicates written consent obtained)
- Remove quality implication, focus on authorization status

---

## 6. RECOMMENDED MINIMAL CARD STRUCTURE

### Final Design (SG Clinics Only)

```
┌────────────────────────────────────────┐
│ ADVANCED DENTAL SIMEI                 │
│                                        │
│ 3 Simei Street 6 #02-31               │
│ Singapore 528833                       │
│ ☎️ +65 6123 4567                       │
│                                        │
│ ┌────────────┐  ┌──────────────────┐ │
│ │ 🌐 Website │  │ 📝 Claim/Remove  │ │
│ └────────────┘  └──────────────────┘ │
│                                        │
│ ──────────────────────────────────────│
│ Clinic owner? Claim or remove listing │
└────────────────────────────────────────┘
```

### Elements INCLUDED:
✅ Clinic name (large, bold)  
✅ Full address (street, postal code)  
✅ Phone number (if available)  
✅ Website button (opens clinic's site)  
✅ Claim/Remove button (links to opt-out form)  
✅ Footer opt-out notice (text link)

### Elements REMOVED:
❌ "Book Now" button  
❌ Google rating (5.0 ★★★★★)  
❌ Review count ((452))  
❌ Google Reviews link  
❌ Service category badges  
❌ Verification status badge  
❌ "Details" button  
❌ Distance from user (if shown)  
❌ Any promotional text

### Why This Is Compliant:

**HCSA Section 2 (Advertisement Definition):**
> "promotes or is intended to promote, directly or indirectly, or that solicits..."

**Minimal Card Analysis:**
- ✅ Name/Address/Phone = Directory information (NOT promotion)
- ✅ Website link = Informational contact method (NOT solicitation)
- ✅ Claim/Remove button = Operational (NOT promotional)
- ❌ No promotional elements = NOT advertisement

**Conclusion:** Minimal card is directory listing, not advertisement. No Section 31 violation.

---

## 7. SDA DEMONSTRATION STRATEGY

### When SDA Reviews Your Prototype:

**Show Two Cards Side-by-Side:**

**Left: JB Clinic Card (Full Features)**
```
┌─────────────────────────────────────┐
│ JDental Specialists                │
│ 71 Jalan Harimau Tarum, JB         │
│ 2.6km from CIQ                     │
│                                     │
│ ⭐ 4.9 ★★★★★ (187 reviews)         │
│                                     │
│ Services: Basic, Restorative,      │
│ Orthodontic, Surgical              │
│                                     │
│ ✅ Verified                         │
│                                     │
│ [📅 Book Now]                      │
│ [👤 Details] [🌐 Website]          │
│ [📝 Update]                         │
└─────────────────────────────────────┘
```

**Right: SG Clinic Card (Minimal)**
```
┌─────────────────────────────────────┐
│ ADVANCED DENTAL SIMEI              │
│                                     │
│ 3 Simei Street 6 #02-31            │
│ Singapore 528833                    │
│ ☎️ +65 6123 4567                    │
│                                     │
│ [🌐 Website] [📝 Claim/Remove]     │
│                                     │
│ Clinic owner? Claim or remove →    │
└─────────────────────────────────────┘
```

**Talking Points:**

1. **Highlight Difference:**
> "Notice the difference: JB cards (left) have full features - Book Now, ratings, service categories. SG cards (right) show only factual directory information - name, address, phone, website."

2. **Explain Rationale:**
> "We've implemented this two-tier system to comply with HCSA Section 31. SG cards are minimal directory listings, not advertisements, so they don't require prior written authorization. JB cards can maintain full features since they're outside SDC jurisdiction."

3. **Demonstrate Opt-Out:**
> "Every SG card has a prominent 'Claim/Remove' button. Any clinic can request removal within 48 hours. This respects practitioner autonomy and demonstrates our commitment to compliance."

4. **Show Neutrality:**
> "SG cards have no promotional elements - no ratings, no rankings, no solicitation. Just factual information, like a phone book. Users can click through to the clinic's own website to learn more."

5. **Path Forward:**
> "Post-SDA approval, we'll launch an authorization campaign. Clinics that provide written consent can be upgraded to full featured cards. For now, this prototype ensures immediate compliance while maintaining platform utility."

---

## ✅ FINAL RECOMMENDATIONS

### Implementation Priority:

**Week 1 (Jan 13-15) - CRITICAL:**
1. ✅ Create MinimalClinicCard component (2 hours)
2. ✅ Implement conditional rendering (SG vs JB) (1 hour)
3. ✅ Add opt-out buttons and page banner (0.5 hours)
4. ✅ Test and deploy to staging (0.5 hours)

**Week 2 (Jan 16-19) - HIGH:**
5. ✅ Internal review and compliance check (1 hour)
6. ✅ Deploy to production (0.5 hours)
7. ✅ Prepare SDA demo materials (2 hours)
8. ✅ Final QA and submission prep (1 hour)

**Total Time:** ~8.5 hours

**Total Cost:** ~$850 @ $100/hr

**Risk Level:** 🟢 LOW - Compliant for SDA submission

---

## 🎤 WHAT TO SAY TO SDA (Script)

**Opening:**
> "Thank you for reviewing our prototype. We've conducted a comprehensive compliance audit and implemented significant changes based on HCSA 2020 and SDC Ethical Code guidance."

**Core Message:**
> "We've resolved all promotional language violations on our homepage and compare pages. For clinic listings, we've implemented a two-tier system: Singapore clinics display minimal directory information only - no promotional elements, no solicitation. JB clinics maintain full features since they're outside SDC jurisdiction."

**Demonstrate Good Faith:**
> "We've added prominent opt-out buttons on every Singapore clinic card. Any clinic can request removal or claim their listing for updates. This respects practitioner autonomy and demonstrates our commitment to responsible operation."

**Request Guidance:**
> "We're seeking SDA's feedback on this approach. Post-approval, we plan to launch an authorization campaign to obtain written consent from Singapore clinics who wish to have full featured listings. For now, this prototype ensures compliance while maintaining platform utility for users comparing regional dental options."

**Close:**
> "We value SDA's partnership and are committed to adjusting our platform based on your guidance. Our goal is to support Singapore's dental ecosystem responsibly while providing valuable information to patients."

---

**Document Purpose:** Evidence-based answers to partner questions  
**Created:** January 13, 2026  
**For:** SDA prototype submission (Jan 20, 2026)  
**Status:** ✅ Ready for implementation
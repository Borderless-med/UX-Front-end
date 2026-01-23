# Chatbot Compliance: HCSA & SDA Ethics Rules
**Date:** January 16, 2026  
**Purpose:** Regulatory guidance for AI chatbot responses about Singapore dental clinics  
**Status:** Pre-Gerald Tan SDA Review

---

## Executive Summary

The OraChope chatbot currently violates HCSA 2020 and SDA Ethics Code 2018 when discussing Singapore clinics by:
- ❌ Using words like "best," "top," "recommended" (laudatory claims)
- ❌ Ranking clinics by Google ratings/review volume (testimonial-based promotion)
- ❌ Making superiority comparisons between clinics
- ❌ Using promotional language that solicits patient visits

**CRITICAL:** These violations apply **ONLY to Singapore clinics**. JB clinics can use promotional language (outside Singapore jurisdiction).

---

## Applicable Regulations

### 1. HCSA (Healthcare Services Act) 2020

#### **Regulation 14: Prohibition on Testimonials & Ratings**

**Full Text:**
> "No person shall publish any healthcare advertisement containing any testimonial, endorsement, or statement that refers to the benefits or quality of any healthcare service by way of any person's experience of receiving such healthcare service."

**Applies To Chatbot:**
- ❌ "Dr. Lee has 4.8 stars from 200+ reviews" → Uses patient testimonials to promote
- ❌ "This clinic is highly rated by patients" → Endorsement based on patient experience
- ❌ "Most reviewed clinic for implants in Singapore" → Rankings based on testimonials

**Compliant Alternatives:**
- ✅ "This clinic offers dental implants" (factual service listing)
- ✅ "3 Singapore clinics match your criteria" (neutral matching)
- ✅ "Clinic has 200+ Google reviews" (factual stat without value judgment - **debatable**, avoid if possible)

---

#### **Section 31: Advertisement Restrictions for Non-Licensees**

**Full Text:**
> "A person who is not a licensee shall not publish a healthcare advertisement unless the person has obtained the prior written approval of the licensee."

**Applies To Chatbot:**
If the chatbot makes **promotional statements** about a clinic (vs. neutral directory info), it constitutes publishing an advertisement on behalf of the clinic.

**What Counts as "Promotional":**
- ❌ "I recommend Clinic X for your needs" → Active solicitation
- ❌ "Clinic X is the best choice for implants" → Superiority claim
- ❌ "You should visit Clinic X" → Direct encouragement

**Safe Harbor (Directory Function):**
- ✅ "3 clinics offer this service: [list]" → Factual matching
- ✅ "Here are clinics in your area" → Geographic filtering
- ✅ "These clinics match your service preferences" → Preference-based matching

---

### 2. SDC (Singapore Dental Council) Ethical Code 2018

#### **Guideline 4.1.1: Prohibition on Superiority Claims**

**Full Text:**
> "A dentist shall not make claims of superiority over other dentists or dental practices, whether explicitly or by implication."

**Applies To Chatbot:**
Since the platform represents clinics, any superiority claim the chatbot makes implicates the featured clinic.

**Violations:**
- ❌ "Clinic A is better than Clinic B" → Explicit superiority
- ❌ "Top 3 clinics for orthodontics" → Implied ranking superiority
- ❌ "Most skilled implantologist in Singapore" → Professional competence claim
- ❌ "Best clinic for families" → Categorical superiority

**Compliant Alternatives:**
- ✅ "Clinics matching your orthodontics preference" → Neutral matching
- ✅ "Clinic specializes in implants" → Factual specialty
- ✅ "Clinic suitable for families" → Attribute without comparison

---

#### **Guideline 4.2.3: Prohibition on Laudatory Statements**

**Full Text:**
> "Advertisements shall not contain laudatory or self-laudatory statements... including terms such as 'best', 'most advanced', 'leading', or similar superlatives."

**Applies To Chatbot:**
The chatbot acts as the clinic's representative when displaying/recommending them.

**Prohibited Words & Phrases:**
- ❌ Best, top, leading, premier, finest
- ❌ Most advanced, most experienced, most skilled
- ❌ Renowned, celebrated, acclaimed, award-winning
- ❌ Excellence, superior, exceptional, outstanding
- ❌ State-of-the-art, cutting-edge, world-class
- ❌ #1, highest-rated, top-ranked

**Safe Alternatives:**
- ✅ Suitable, appropriate, matching, fitting
- ✅ Available, offering, providing
- ✅ Specializes in, focuses on
- ✅ Experienced in, familiar with

---

## Chatbot-Specific Violation Scenarios

### Scenario 1: Ranking by Google Ratings

**Current Chatbot Behavior (VIOLATION):**
```
User: "Find me a good dentist in Singapore"
Bot: "Here are the top 3 highest-rated clinics:
      1. Clinic A (4.9★, 300 reviews)
      2. Clinic B (4.8★, 250 reviews)  
      3. Clinic C (4.7★, 200 reviews)"
```

**Why Illegal:**
- Uses testimonials (Google reviews) to rank clinics → HCSA Reg 14 violation
- Creates superiority hierarchy ("top 3") → SDC 4.1.1 violation
- "Highest-rated" = laudatory language → SDC 4.2.3 violation

**Compliant Alternative:**
```
User: "Find me a good dentist in Singapore"
Bot: "3 clinics in Singapore offer general dental services. 
     Would you like to filter by location or specific treatments?"
     
     [Shows clinics in alphabetical or random order, NO ratings displayed]
```

---

### Scenario 2: Using "Best" Language

**Current Chatbot Behavior (VIOLATION):**
```
User: "Which clinic is best for implants?"
Bot: "Based on your needs, I recommend Clinic X - they're 
     the best choice for dental implants in your area."
```

**Why Illegal:**
- "Best" = prohibited laudatory term → SDC 4.2.3
- "I recommend" = active solicitation → HCSA Sec 31
- Implies Clinic X superior to others → SDC 4.1.1

**Compliant Alternative:**
```
User: "Which clinic is best for implants?"
Bot: "5 Singapore clinics offer dental implants. I can help you 
     compare based on location or other preferences. What area 
     are you looking for?"
```

---

### Scenario 3: Volume-Based Recommendations

**Current Chatbot Behavior (VIOLATION):**
```
Bot: "Clinic A has the most reviews for root canals in Singapore,
     with 180+ patients sharing their experiences."
```

**Why Illegal:**
- "Most reviews" = ranking based on testimonial volume → HCSA Reg 14
- "Patients sharing experiences" = explicit testimonial reference → HCSA Reg 14

**Compliant Alternative:**
```
Bot: "Clinic A offers root canal treatment in [Location]."

[No mention of review volume or patient experiences]
```

---

### Scenario 4: Cross-Border Comparisons (SG vs JB)

**LEGAL (JB clinic promotion):**
```
User: "Compare Singapore vs JB clinics"
Bot: "For JB clinics: Clinic X is highly rated (4.9★) and offers 
     competitive pricing for implants at RM3500."
```
✅ **ALLOWED** - JB clinics outside Singapore jurisdiction

**ILLEGAL (SG clinic promotion):**
```
Bot: "For Singapore: Clinic Y is the top-rated implant specialist 
     with 4.8★ from 200+ patients."
```
❌ **VIOLATION** - Applies HCSA/SDC rules to SG clinic

**Compliant Hybrid:**
```
Bot: "JB Option: Clinic X offers implants at RM3500 (4.9★, highly rated)
     SG Option: 3 clinics offer implants, including Clinic Y in [Location]"
```
✅ **ALLOWED** - Promotional language only for JB, neutral directory for SG

---

## Implementation Rules for Chatbot

### Rule 1: Country Detection Logic
```python
def get_clinic_country(clinic_id):
    # Check clinic location
    if clinic.country == "Singapore":
        return "SG"
    elif clinic.country == "Malaysia":
        return "JB"
```

### Rule 2: Response Generation Logic
```python
def format_clinic_response(clinic, country):
    if country == "SG":
        # STRICT MODE - Compliance required
        return f"{clinic.name} offers {service} in {location}."
        # No ratings, no "best", no rankings
    
    elif country == "JB":
        # PROMOTIONAL MODE - Full features allowed
        return f"{clinic.name} is highly rated (★{rating}) for {service}. 
                 Book now for RM{price}!"
```

### Rule 3: Prohibited Words Filter (SG Only)
```python
SG_PROHIBITED_WORDS = [
    "best", "top", "leading", "premier", "finest",
    "most advanced", "highest-rated", "top-rated",
    "recommended", "excellent", "superior", "outstanding",
    "#1", "award-winning", "renowned", "celebrated"
]

def sanitize_sg_response(text):
    for word in SG_PROHIBITED_WORDS:
        if word.lower() in text.lower():
            raise ComplianceError(f"Prohibited word '{word}' in SG clinic response")
```

### Rule 4: Ranking Prohibition (SG Only)
```python
def display_clinics(clinics, country):
    if country == "SG":
        # Alphabetical or random order ONLY
        random.shuffle(clinics)
        return clinics
    
    elif country == "JB":
        # Can sort by ratings, reviews, etc.
        return sorted(clinics, key=lambda x: x.rating, reverse=True)
```

---

## DXD Precedent Warning

**Case:** DentistryXperience Dental (DXD) - 2024  
**Violation:** Used comparative pricing ("SG $500 vs Malaysia $200")  
**Outcome:** SDC investigation, clinic withdrew advertising voluntarily  

**Key Lesson for Chatbot:**
Even if technically compliant with HCSA law, the **SDA can recommend dentists avoid your platform** if it creates "political" concerns about patient diversion to Malaysia.

**Implication:**
- Legal compliance ≠ Professional acceptance
- Must be "beyond reproach" for SDA Board endorsement
- Conservative interpretation safer than aggressive legal reading

---

## Summary: Chatbot Dual-Mode Operation

| Feature | Singapore Clinics | JB Clinics |
|---------|------------------|------------|
| **Use "best/top/recommended"** | ❌ Prohibited | ✅ Allowed |
| **Display Google ratings** | ⚠️ Avoid (debatable) | ✅ Allowed |
| **Rank by ratings/reviews** | ❌ Prohibited | ✅ Allowed |
| **Sort by review volume** | ❌ Prohibited | ✅ Allowed |
| **Make superiority claims** | ❌ Prohibited | ✅ Allowed |
| **Show pricing comparisons** | ⚠️ Sensitive | ✅ Allowed |
| **"I recommend Clinic X"** | ❌ Prohibited | ✅ Allowed |
| **Alphabetical/random order** | ✅ Required | ⚠️ Optional |

---

## Compliance Checklist for New Chatbot

### Pre-Deployment Testing
- [ ] Test query: "Find best dentist in Singapore" → Bot does NOT use "best" in response
- [ ] Test query: "Top rated clinic for implants" → Bot shows unranked list
- [ ] Test query: "Most reviewed clinic in JB" → Bot CAN show ratings/rankings for JB
- [ ] Verify SG clinic responses contain ZERO prohibited words
- [ ] Verify SG clinic responses do NOT mention Google ratings
- [ ] Verify SG clinic responses presented in alphabetical or random order
- [ ] Verify cross-border queries apply different rules to SG vs JB clinics
- [ ] Review 50 sample SG clinic responses for compliance

---

## Next Steps

1. **Export to New Chat Thread** - This document + migration doc
2. **Implement Dual-Mode Logic** - Country-based response filtering
3. **Update System Prompts** - Add SG compliance constraints
4. **Test Compliance** - 100+ query scenarios for SG clinics
5. **Gerald Tan Review** - Demo compliant chatbot before SDA presentation

**Timeline:** 2-3 hours implementation + 1 hour testing = Ready for Gerald Tan review

---

## Reference Documents
- HCSA 2020: Healthcare Services Act (Singapore)
- SDC Ethical Code 2018: Singapore Dental Council Professional Conduct Guidelines
- COMPLIANCE_SUMMARY_FINAL.md: Previous analysis (3 AI consensus)
- COMPLIANCE_STATUS_REPORT_JAN2026.md: Frontend compliance status

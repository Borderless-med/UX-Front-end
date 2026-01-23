# Chatbot Compliance Migration - Technical Briefing
**Date:** January 16, 2026  
**Purpose:** Complete context transfer for chatbot compliance implementation  
**Target:** New AI chat session for focused implementation work

---

## SITUATION OVERVIEW

### What We Just Completed (This Session)
✅ **Frontend HCSA/SDA Compliance** - Fully deployed to production
- Removed rating/review/license filters for Singapore clinics
- Hid Advanced Filters section for SG
- Added Location/Name sort options (neutral sorting only)
- Removed "Min Rating" and "License Status" from results summary
- Fixed treatment filter matching (aligned constants with database schema)
- All changes live at https://www.orachope.org/clinics?sel=sg

### What Needs Doing Next
❌ **Chatbot HCSA/SDA Compliance** - NOT YET IMPLEMENTED
- Chatbot currently uses prohibited language ("best," "top," "recommended")
- Chatbot ranks Singapore clinics by Google ratings/reviews
- Chatbot makes superiority claims between clinics
- **BLOCKING:** Cannot present to Dr. Gerald Tan (SDA) until chatbot is compliant

---

## PROJECT CONTEXT

### Timeline
- **Today:** January 16, 2026
- **Target:** January 20, 2026 - SDA Board presentation
- **Urgency:** 4 days remaining
- **Effort Estimate:** 2-3 hours chatbot implementation + 1 hour testing

### Stakeholders
- **Dr. Gerald Tan:** SDA Council member - Will review informally before full SDA presentation
- **SDA (Singapore Dental Association):** Professional body - Must approve platform for dentist adoption
- **You (Developer):** SP - Frontend complete, need to fix chatbot backend

### Regulatory Environment
- **HCSA 2020:** Healthcare Services Act (Singapore law) - Criminal penalties
- **SDC Ethical Code 2018:** Professional conduct rules - Dentists face disciplinary action
- **DXD Precedent:** 2024 case where dental platform faced SDC investigation for price comparisons

---

## TECHNICAL ARCHITECTURE

### Chatbot Stack
- **Framework:** FastAPI (Python)
- **LLM:** Google Gemini Pro (via Vertex AI)
- **Database:** Supabase (PostgreSQL)
- **Location:** `sg-jb-chatbot-LATEST/main.py`

### Current Chatbot Structure
```python
# main.py - Key Components:

1. Gemini Models (from src/services/gemini_service.py):
   - gatekeeper_model: Intent classification
   - factual_brain_model: Retrieves clinic data
   - ranking_brain_model: Scores/ranks clinics
   - generation_model: Generates natural language responses

2. Flow Handlers:
   - handle_find_clinic() - Clinic search flow
   - handle_booking_flow() - Appointment booking
   - handle_qna() - General dental questions
   - handle_travel_query() - Travel FAQ

3. Data Sources:
   - sg_clinics table (Singapore clinics)
   - jb_clinics table (JB, Malaysia clinics)
   - clinic_embeddings (vector search)
```

### Compliance Problem Areas
```python
# Current violations in chatbot code:

Line 578: search_keywords = ["find", "recommend", "suggest", "best"]
          ^^^^^^^^^^^^^^^^^ - "best" triggers ranking logic

Line 659: search_keywords = ["best", "top", "good", "clinic"]
          ^^^^^^^^^^^^^ - Uses prohibited words

Line 680: # Comment: "best implant clinic"
          ^^^^ - Shows intent to use prohibited language

# ranking_brain_model likely sorts by:
- Google ratings (testimonials - HCSA Reg 14 violation)
- Review volume (testimonial-based ranking - HCSA Reg 14)
- Creates "top 3" lists (superiority claims - SDC 4.1.1)
```

---

## REGULATORY REQUIREMENTS

### Critical Rules (SG Clinics Only)

**1. HCSA Regulation 14: No Testimonial-Based Promotion**
- ❌ Cannot rank by Google ratings
- ❌ Cannot mention review volume
- ❌ Cannot say "highly rated by patients"

**2. SDC 4.2.3: No Laudatory Language**
- ❌ Cannot use: best, top, leading, premier, finest, excellent, superior, outstanding, #1, highest-rated, recommended

**3. SDC 4.1.1: No Superiority Claims**
- ❌ Cannot rank clinics ("Top 3")
- ❌ Cannot say "Clinic A is better than B"
- ❌ Cannot imply one clinic superior to another

**4. HCSA Section 31: No Promotional Advertisements (unless authorized)**
- ❌ Cannot actively recommend specific clinic ("I recommend Clinic X")
- ✅ CAN provide neutral directory matching ("3 clinics match your criteria")

### JB Clinics = No Restrictions
✅ All promotional language ALLOWED for Malaysian clinics (outside Singapore jurisdiction)

---

## IMPLEMENTATION STRATEGY

### Dual-Mode Chatbot Architecture

**Concept:** Chatbot operates in two modes based on clinic location

```python
def get_response_mode(clinic):
    if clinic.country == "Singapore":
        return "COMPLIANCE_MODE"  # Strict rules
    elif clinic.country == "Malaysia" or clinic.country == "JB":
        return "PROMOTIONAL_MODE"  # Full features
```

### Compliance Mode Features (SG Only)

**1. Response Language Filter**
```python
SG_PROHIBITED_WORDS = [
    "best", "top", "leading", "premier", "finest",
    "recommended", "excellent", "superior", "outstanding",
    "highest-rated", "top-rated", "most advanced",
    "#1", "award-winning", "renowned"
]

def sanitize_sg_response(text, clinic_country):
    if clinic_country == "Singapore":
        for word in SG_PROHIBITED_WORDS:
            if word.lower() in text.lower():
                # Replace with neutral alternative
                text = text.replace(word, get_neutral_alternative(word))
    return text
```

**2. Ranking Prohibition**
```python
def display_clinics(clinics, country):
    if country == "Singapore":
        # NO sorting by ratings/reviews
        # Use alphabetical or random order
        random.shuffle(clinics)
        return clinics
    else:
        # JB clinics can be ranked
        return sorted(clinics, key=lambda x: x.rating, reverse=True)
```

**3. Factual-Only Presentation**
```python
# COMPLIANT SG Response:
"3 Singapore clinics offer dental implants:
 - Clinic A (Orchard Road)
 - Clinic B (Tampines)  
 - Clinic C (Jurong East)
 
 Would you like to filter by location?"

# PROHIBITED SG Response:
"Top 3 implant clinics in Singapore:
 1. Clinic A (4.9★, 200 reviews) - Best choice
 2. Clinic B (4.7★, 150 reviews) - Highly recommended
 3. Clinic C (4.5★, 100 reviews) - Great option"
```

---

## DATABASE SCHEMA

### Clinic Tables

**sg_clinics (Singapore):**
```sql
- id (uuid)
- name (text)
- address (text)
- township (text) 
- country (text) = 'Singapore'
- rating (float) - Google rating
- reviews (int) - Google review count
- treatments (jsonb) - Services offered
- latitude, longitude
```

**jb_clinics (Malaysia):**
```sql
- Same structure
- country (text) = 'Malaysia' or 'JB'
```

### Key Query Pattern
```python
# Current (VIOLATES for SG):
clinics = supabase.from_("sg_clinics")\
    .select("*")\
    .order("rating", desc=True)\  # ❌ Testimonial ranking
    .limit(5)

# Compliant (SG):
clinics = supabase.from_("sg_clinics")\
    .select("*")\
    .order("name", asc=True)\  # ✅ Alphabetical
    .limit(10)
```

---

## GEMINI PROMPT MODIFICATIONS

### Current System Prompt (PROBLEMATIC)
```python
system_prompt = """
You are a dental concierge that helps users find the best dental clinics.
When users ask for recommendations, provide the top-rated clinics based on 
Google reviews and patient feedback.
"""
```

### Compliant System Prompt (DUAL-MODE)
```python
system_prompt = """
You are a dental concierge that helps users find suitable dental clinics.

CRITICAL COMPLIANCE RULES FOR SINGAPORE CLINICS:
- NEVER use words: best, top, recommended, excellent, superior, leading
- NEVER rank clinics by ratings or reviews
- NEVER mention Google ratings or review counts
- Present clinics in neutral order (alphabetical or random)
- Use only factual, directory-style information

For Malaysian/JB clinics: You may use promotional language and rankings.

When responding about Singapore clinics, use neutral language:
- "3 clinics offer this service" (NOT "top 3 clinics")
- "Clinic A specializes in implants" (NOT "best implant clinic")
- "Suitable for your needs" (NOT "highly recommended")
"""
```

---

## CODE MODIFICATION PLAN

### Phase 1: Add Country-Aware Logic

**File:** `main.py`

**Modification 1: Update search keywords**
```python
# Current (Line 578):
search_keywords = ["find", "recommend", "suggest", "best", "top"]

# Replace with:
search_keywords_neutral = ["find", "suggest", "clinic", "dentist", "nearby"]
search_keywords_promotional = ["best", "top", "recommended"]  # Only for JB
```

**Modification 2: Filter prohibited words**
```python
def filter_prohibited_language(text, clinic_country):
    """Remove HCSA/SDC prohibited words for Singapore clinics"""
    if clinic_country != "Singapore":
        return text  # No filtering for JB clinics
    
    prohibited = {
        "best": "suitable",
        "top": "available",
        "recommended": "matching your preferences",
        "excellent": "appropriate",
        "superior": "fitting",
        "highest-rated": "",
        "top-rated": "",
        "#1": ""
    }
    
    for word, replacement in prohibited.items():
        text = re.sub(rf'\b{word}\b', replacement, text, flags=re.IGNORECASE)
    
    return text
```

**Modification 3: Update ranking logic**
```python
def rank_clinics(clinics, country):
    """
    Singapore: Random/alphabetical order (no ranking)
    JB/Malaysia: Can rank by ratings
    """
    if country == "Singapore":
        random.shuffle(clinics)
        return clinics
    else:
        # Sort by rating for JB clinics
        return sorted(clinics, key=lambda x: x.get('rating', 0), reverse=True)
```

### Phase 2: Update Flow Handlers

**File:** `flows/find_clinic_flow.py`

**Modification 4: Detect clinic country**
```python
def handle_find_clinic(query, clinics, applied_filters):
    # Determine if search is for SG or JB
    query_lower = query.lower()
    
    if "singapore" in query_lower or "sg" in query_lower:
        target_country = "Singapore"
        compliance_mode = True
    elif "jb" in query_lower or "johor" in query_lower or "malaysia" in query_lower:
        target_country = "JB"
        compliance_mode = False
    else:
        # Default based on candidate pool
        if clinics and clinics[0].get('country') == 'Singapore':
            target_country = "Singapore"
            compliance_mode = True
        else:
            target_country = "JB"
            compliance_mode = False
    
    # Apply compliance filtering if SG
    if compliance_mode:
        clinics = rank_clinics(clinics, "Singapore")  # Random order
        response = generate_compliant_response(clinics)
    else:
        clinics = rank_clinics(clinics, "JB")  # Can rank
        response = generate_promotional_response(clinics)
    
    return response
```

**Modification 5: Generate compliant responses**
```python
def generate_compliant_response(clinics):
    """Singapore-compliant clinic listing"""
    count = len(clinics)
    
    # Neutral language only
    intro = f"{count} Singapore clinic{'s' if count != 1 else ''} offer this service:"
    
    clinic_list = []
    for clinic in clinics[:5]:  # Limit to 5
        # NO ratings, NO reviews, NO promotional language
        clinic_list.append(
            f"- {clinic['name']} ({clinic['township']})"
        )
    
    return intro + "\n" + "\n".join(clinic_list) + "\n\nWould you like to filter by location?"

def generate_promotional_response(clinics):
    """JB promotional listing (full features)"""
    count = len(clinics)
    
    intro = f"Top {count} JB clinics for your treatment:"
    
    clinic_list = []
    for i, clinic in enumerate(clinics[:5], 1):
        # CAN show ratings, reviews, promotional language
        clinic_list.append(
            f"{i}. {clinic['name']} - {clinic['rating']}★ ({clinic['reviews']} reviews)"
        )
    
    return intro + "\n" + "\n".join(clinic_list)
```

### Phase 3: Update Gemini Prompts

**File:** `src/services/gemini_service.py`

**Modification 6: Add compliance instructions to system prompt**
```python
# Add to generation_model system prompt:
COMPLIANCE_INSTRUCTIONS = """
CRITICAL: Singapore Dental Compliance Rules

When discussing Singapore dental clinics, you MUST:
1. NEVER use these words: best, top, recommended, excellent, superior, leading, premier, finest, outstanding, highest-rated, top-rated, #1
2. NEVER rank clinics by ratings or reviews
3. NEVER mention Google ratings or review counts
4. Present clinics in neutral, unranked order
5. Use only factual directory information

Safe phrases for Singapore:
- "suitable for your needs"
- "offers this service"
- "specializes in"
- "available in [location]"
- "matches your preferences"

For Malaysian/JB clinics: Normal promotional language is allowed.
"""

generation_model_config["system_instruction"] = base_prompt + COMPLIANCE_INSTRUCTIONS
```

---

## TESTING PROTOCOL

### Test Scenarios (Singapore Clinics)

**Test 1: "Best dentist" query**
```
Input: "Find me the best dentist in Singapore"
Expected: "Several Singapore clinics offer general dental services. Would you like to filter by location or treatment type?"
Prohibited: Any response using "best," "top," "recommended"
```

**Test 2: Ranking query**
```
Input: "Top 3 clinics for implants in Singapore"
Expected: "5 Singapore clinics offer dental implants: [alphabetical list]"
Prohibited: Numbered list, ratings mentioned, "top" language
```

**Test 3: Rating-based query**
```
Input: "Highest rated clinic in Orchard"
Expected: "3 clinics in Orchard area offer dental services: [list]"
Prohibited: Any mention of ratings, reviews, or rankings
```

**Test 4: Cross-border comparison**
```
Input: "Compare Singapore vs JB clinics for root canal"
Expected SG: "Singapore option: Clinic A (Orchard) offers root canal treatment"
Expected JB: "JB option: Clinic B (4.8★, highly rated) offers root canal at RM800"
```

### Test Scenarios (JB Clinics - Should Allow Promotion)

**Test 5: JB "best" query**
```
Input: "Best dentist in JB"
Expected: "Top 3 JB clinics: 1. Clinic A (4.9★)..." ✅ ALLOWED
```

---

## FILES TO MODIFY

### Primary Changes
1. **`main.py`** (Lines 578, 659, 680, 742)
   - Update search keywords
   - Add prohibited word filter
   - Add country detection logic

2. **`flows/find_clinic_flow.py`**
   - Add compliance mode switching
   - Implement dual response generation
   - Remove rating-based sorting for SG

3. **`src/services/gemini_service.py`**
   - Update system prompts with compliance instructions
   - Add prohibited word validation

4. **`flows/ranking_logic.py`** (if exists)
   - Disable rating/review ranking for SG clinics
   - Use alphabetical/random order

### Supporting Changes
5. **Add new file:** `utils/compliance_filter.py`
   - Centralized prohibited word list
   - Country detection helper
   - Response sanitization function

---

## SUCCESS CRITERIA

### Pre-Gerald Tan Demo Checklist
- [ ] 20+ test queries about Singapore clinics return compliant responses
- [ ] Zero uses of prohibited words ("best," "top," etc.) in SG responses
- [ ] Singapore clinics never ranked by ratings/reviews
- [ ] JB clinics still show full promotional features (ratings, "best" language)
- [ ] Cross-border queries apply different rules to SG vs JB
- [ ] Gemini system prompts include compliance instructions
- [ ] Prohibited word filter tested on 50+ sample responses

### Deployment Checklist
- [ ] Changes deployed to chatbot backend
- [ ] Frontend already compliant (completed this session)
- [ ] End-to-end test: SG clinic search shows neutral language
- [ ] End-to-end test: JB clinic search shows promotional language
- [ ] Demo prepared for Gerald Tan (2-3 example queries)

---

## RISK MITIGATION

### What If Gemini Still Uses Prohibited Words?

**Solution 1: Post-Processing Filter**
```python
def sanitize_response(text, country):
    if country == "Singapore":
        # Force replace prohibited words
        for word in PROHIBITED_WORDS:
            if word in text.lower():
                text = re.sub(rf'\b{word}\b', 'suitable', text, flags=re.IGNORECASE)
    return text

final_response = sanitize_response(gemini_output, clinic_country)
```

**Solution 2: Validation + Regeneration**
```python
def validate_compliance(text, country):
    if country == "Singapore":
        violations = [w for w in PROHIBITED_WORDS if w in text.lower()]
        if violations:
            # Regenerate with stricter prompt
            return generate_response_strict_mode()
    return text
```

**Solution 3: Template Fallback**
```python
if compliance_mode and contains_prohibited_language(response):
    # Use pre-written compliant template
    return COMPLIANT_TEMPLATE.format(
        count=len(clinics),
        clinics=format_clinic_list(clinics)
    )
```

---

## REFERENCE MATERIALS

### Key Documents to Review
1. **CHATBOT_COMPLIANCE_REGULATIONS.md** (just created)
   - Full HCSA/SDC rule breakdown
   - Scenario examples
   - Dual-mode operation guide

2. **COMPLIANCE_SUMMARY_FINAL.md** (sg-jb-chatbot-LATEST/)
   - 3-AI consensus analysis
   - DXD precedent details
   - Original violation identification

3. **COMPLIANCE_STATUS_REPORT_JAN2026.md** (sg-smile-saver/)
   - Frontend compliance status
   - Minimal clinic card specification
   - SDA presentation timeline

### Regulatory Source Documents
- HCSA 2020: Healthcare Services Act (Singapore Statutes)
- SDC Ethical Code 2018: Singapore Dental Council Professional Guidelines
- SDA Jan 6, 2026 Meeting Notes: Specific guidance on price comparisons

---

## NEXT STEPS FOR NEW CHAT SESSION

1. **Start Fresh Chat Thread**
   - Import this migration document
   - Import CHATBOT_COMPLIANCE_REGULATIONS.md
   - Reference: I have frontend compliance complete, need chatbot backend fixes

2. **Implementation Phase** (2-3 hours)
   - Add country detection logic
   - Implement prohibited word filter
   - Update Gemini system prompts
   - Modify find_clinic_flow.py for dual-mode responses
   - Add compliance validation

3. **Testing Phase** (1 hour)
   - Test 20+ Singapore clinic queries
   - Test 10+ JB clinic queries (ensure promotion still works)
   - Verify zero prohibited words in SG responses
   - Verify alphabetical/random order for SG

4. **Gerald Tan Demo Prep** (30 min)
   - Prepare 3 demo queries showing compliance
   - Document before/after examples
   - Schedule informal review with Gerald Tan

---

## CRITICAL SUCCESS FACTORS

✅ **Singapore clinics: NO promotional language**  
✅ **JB clinics: Full promotional features retained**  
✅ **Dual-mode operation: Different rules for different countries**  
✅ **Testing: Comprehensive validation before Gerald Tan review**  
✅ **Timeline: Complete by Jan 19 for Jan 20 SDA presentation**

---

**READY TO EXPORT TO NEW CHAT THREAD** ✅

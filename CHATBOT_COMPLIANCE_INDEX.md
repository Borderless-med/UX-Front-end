# Chatbot Compliance Project - Document Index
**Date:** January 16, 2026  
**Status:** Ready for New Chat Thread

---

## Documents Created (Export These)

### 1. CHATBOT_COMPLIANCE_REGULATIONS.md
**Purpose:** Regulatory reference guide  
**Contents:**
- HCSA Regulation 14 (Testimonials prohibition)
- HCSA Section 31 (Advertisement authorization)
- SDC 4.1.1 (Superiority claims prohibition)
- SDC 4.2.3 (Laudatory language prohibition)
- Violation scenarios with examples
- Dual-mode operation rules (SG vs JB)
- Prohibited words list
- Compliance testing checklist

**Use When:** Understanding what's legal vs illegal

---

### 2. CHATBOT_MIGRATION_BRIEF.md
**Purpose:** Complete technical context transfer  
**Contents:**
- Project situation & timeline
- Technical architecture overview
- Current code violations (main.py lines 578, 659, 680, 742)
- Implementation strategy (dual-mode chatbot)
- Code modification plan (6 specific changes)
- Database schema
- Gemini prompt modifications
- Testing protocol (20+ test scenarios)
- Success criteria checklist
- Risk mitigation strategies

**Use When:** Starting implementation in new chat

---

### 3. THIS FILE (CHATBOT_COMPLIANCE_INDEX.md)
**Purpose:** Navigation guide

---

## Supporting Reference Documents

### Frontend Compliance (Already Complete)
- **COMPLIANCE_STATUS_REPORT_JAN2026.md** (sg-smile-saver/)
  - Homepage/compare page fixes (deployed)
  - Minimal clinic card specification
  - Two-tier system strategy

### Previous Analysis
- **COMPLIANCE_SUMMARY_FINAL.md** (sg-jb-chatbot-LATEST/)
  - 3-AI consensus findings
  - DXD precedent warning
  - Priority ranking

---

## Quick Start Guide for New Chat

### Step 1: Import Documents
Copy-paste into new chat:
1. CHATBOT_COMPLIANCE_REGULATIONS.md (full regulatory context)
2. CHATBOT_MIGRATION_BRIEF.md (technical implementation guide)

### Step 2: Context Statement
```
"I need to make our chatbot HCSA/SDA compliant for Singapore clinics.

COMPLETED: Frontend compliance (filters, sorting, results display)
REMAINING: Chatbot backend (prohibited words, ranking logic, response generation)

Please review the two attached documents and help me implement the 
dual-mode chatbot architecture described in the migration brief."
```

### Step 3: Implementation Order
1. Add country detection logic
2. Implement prohibited word filter
3. Update Gemini system prompts
4. Modify find_clinic_flow.py
5. Test 20+ Singapore queries
6. Test 10+ JB queries (ensure promotion works)
7. Validate zero violations

### Step 4: Timeline
- **Today (Jan 16):** Implementation (2-3 hours)
- **Jan 17:** Testing (1 hour)
- **Jan 18:** Gerald Tan informal review
- **Jan 20:** SDA Board presentation

---

## Critical Files to Modify

Located in: `sg-jb-chatbot-LATEST/`

1. **main.py** - Lines 578, 659, 680, 742
   - Remove "best"/"top" from search keywords
   - Add prohibited word filter

2. **flows/find_clinic_flow.py**
   - Add compliance mode switching
   - Implement dual response generation

3. **src/services/gemini_service.py**
   - Update system prompts
   - Add compliance instructions

4. **NEW: utils/compliance_filter.py**
   - Centralized prohibited word list
   - Country detection helper
   - Response sanitization

---

## Testing Checklist

### Must Pass (Singapore)
- [ ] "Find best dentist in Singapore" → No "best" in response
- [ ] "Top 3 clinics for implants" → Alphabetical list, no ranking
- [ ] "Highest rated clinic" → No ratings mentioned
- [ ] Response shows max 5 clinics in random/alphabetical order

### Must Pass (JB)
- [ ] "Best dentist in JB" → CAN use "best," show ratings
- [ ] "Top rated clinic" → CAN rank by ratings
- [ ] Promotional language allowed

### Cross-Border
- [ ] "Compare SG vs JB" → Different rules applied correctly

---

## Success Criteria

✅ Zero prohibited words in SG clinic responses  
✅ No ranking by ratings/reviews for SG  
✅ JB promotional features still work  
✅ 20+ test queries validated  
✅ Ready for Gerald Tan demo

---

## Export Package for New Chat

**What to Copy:**
```
1. CHATBOT_COMPLIANCE_REGULATIONS.md (paste full content)
2. CHATBOT_MIGRATION_BRIEF.md (paste full content)
3. This context statement:
   "Frontend compliance done. Need chatbot backend compliance for Singapore clinics.
    Timeline: 4 days to SDA presentation. See attached technical brief."
```

**Don't Copy:**
- This index file (for reference only)
- Previous chat history (too long, causes lag)

---

**READY TO START NEW CHAT THREAD** ✅

Timeline: Jan 16-19 implementation → Jan 20 SDA presentation

# AFFECTED FILES LIST - Verified Partner Issue

## PRIMARY SUSPECTS (UI Rendering)
These files control how clinic cards are rendered and which button/badge shows:

1. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicGrid.tsx**
   - CRITICAL: Controls which card component is rendered (ClinicCard vs MinimalClinicCard)
   - Likely has logic: `clinic.country === 'SG' ? <MinimalClinicCard> : <ClinicCard>`
   - May be ignoring isVerifiedPartner when selecting card type

2. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicCardActions.tsx**
   - Contains button render logic
   - Line 40-52: Conditional for "Book Now" vs "Contact OraChope"
   - Should check `clinic.isVerifiedPartner` but may not be receiving correct prop

3. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\MinimalClinicCard.tsx**
   - SG compliance card (HCSA regulations - no rating stars)
   - Line 63-74: Has verified partner badge code
   - May not properly handle verified partners

4. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicCard.tsx**
   - Main card component wrapper
   - Line 39: Filter logic `if (!clinic.isVerifiedPartner)` exists
   - Passes props to child components

5. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicCardInfo.tsx**
   - Line 163-172: Verified partner badge display
   - Shows "✅ Verified Partner" and "24-hour response guarantee"

6. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicCardHeader.tsx**
   - Line 14: `isSGVerifiedPartner = clinic.country === 'SG' && clinic.isVerifiedPartner`
   - Controls whether to hide rating stars for HCSA compliance

---

## DATA LAYER (CONFIRMED WORKING ✅)

7. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\hooks\useSupabaseClinics.tsx**
   - Line 11: CACHE_VERSION = 'v2_verified_partner_fix'
   - Line 164: Cache key logic
   - Line 182: Cache layer checks
   - Line 254-267: loadTable function (data fetching)
   - Line 301-310: Raw data logging (shows data is correct)
   - Line 391: isVerifiedPartner mapping: `clinic.is_verified_partner || false`
   - ✅ DATA FETCHING WORKS - Console logs prove this

8. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\utils\restClient.ts**
   - Line 272: restSelect function export
   - REST API client for Supabase
   - ✅ Works correctly

---

## TYPE DEFINITIONS

9. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\types\clinic.ts**
   - Line 39: `isVerifiedPartner?: boolean;` property definition
   - Interface is correct ✅

---

## DATABASE SCRIPTS

10. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\ACTIVATE_SG_VERIFIED_PARTNER.sql**
    - Script to set is_verified_partner = TRUE for SG clinics
    - Used to activate Elite Dental and Dental Trendz locations
    - ✅ Database has correct data

11. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\CHECK_SUPABASE_COLUMN.sql**
    - Diagnostic queries to verify database state
    - Checks RLS policies, permissions, and data values
    - ✅ Confirmed all 8 clinics have is_verified_partner = true

12. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\RENAME_SG_CLINICS_COLUMN.sql**
    - Created by mistake during debugging session
    - Documents column rename (user already did this before session)
    - Can be deleted

13. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\supabase\migrations\20260723_rename_sg_clinics_is_verified.sql**
    - Migration script for column rename
    - Part of standardization effort

---

## ADDITIONAL UI COMPONENTS

14. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\ClinicCardServices.tsx**
    - Treatment categories display
    - Not directly related to verified partner issue

15. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\ClaimClinicModal.tsx**
    - Referenced in ClinicCard.tsx
    - Modal for clinic claiming flow

16. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\clinic\display\PractitionerDetailsModal.tsx**
    - View dentist details modal
    - Referenced in ClinicCard.tsx

---

## RELATED CONTEXT FILES

17. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\contexts\AuthContext.tsx**
    - Authentication context
    - Used by useSupabaseClinics hook
    - Not related to the bug

18. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\ui\button.tsx**
    - shadcn/ui button component
    - Used by ClinicCardActions

19. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\src\components\ui\card.tsx**
    - shadcn/ui card component
    - Used by ClinicCard and MinimalClinicCard

---

## DOCUMENTATION FILES

20. **c:\GSP Personal\Post EndoMaster\Antler's Stuff\JB Dental clinics\sg-smile-saver\MIGRATION_SUMMARY_VERIFIED_PARTNER_ISSUE.md**
    - This migration summary for next LLM

---

## FILES IN OTHER WORKSPACE (sg-jb-chatbot-LATEST)

None directly affected. This issue is isolated to the sg-smile-saver project.

---

## INVESTIGATION PRIORITY

**HIGH PRIORITY (Start Here):**
1. ClinicGrid.tsx - Card selection logic
2. MinimalClinicCard.tsx - Does it support verified partners?
3. ClinicCardActions.tsx - Button render logic

**MEDIUM PRIORITY:**
4. ClinicCard.tsx - Prop passing
5. ClinicCardInfo.tsx - Badge display
6. ClinicCardHeader.tsx - Rating visibility

**LOW PRIORITY (Likely Not Related):**
7-19. Supporting files and utilities

---

## KEY INSIGHT

The bug is NOT in files 7-19. The bug is in files 1-6 (UI rendering logic).

Data flows correctly from:
- Database (✅ has correct values)
- → restClient (✅ fetches correctly)  
- → useSupabaseClinics (✅ transforms correctly)
- → localStorage (✅ caches correctly)

But then breaks at:
- → ClinicGrid (❓ card selection)
- → ClinicCard/MinimalClinicCard (❓ which is rendered?)
- → ClinicCardActions (❓ button logic)

# Country Code Dropdown Update Proposal
**Date:** July 7, 2026  
**Issue:** Limited country code options (only +65 SG and +60 MY)  
**Goal:** International coverage with SG/MY pinned on top

---

## 🔍 AUDIT: User Interactions Requiring Phone Number

### **1. BOOKING FORM** (Main User Journey)
**File:** `src/components/AppointmentBookingForm.tsx`  
**Current State:** ✅ Has country code dropdown (Lines 94-97)  
**Current Options:** Only +65 (Singapore) and +60 (Malaysia)  
**Usage Context:** When users book appointments with dental clinics  
**Action Required:** ✅ UPDATE DROPDOWN - Add full international list

---

### **2. AI SCAN SIGNUP** (Premium Feature Access)
**File:** `src/pages/AIScanPage.tsx`  
**Current State:** ❌ NO country code dropdown  
**Current Input:** Plain text field with placeholder "+65 9123 4567" (Line 342)  
**Usage Context:** When users sign up to access AI dental scan feature  
**Action Required:** ⚠️ ADD DROPDOWN - Currently no way to select country

---

### **3. INQUIRY FORM** (Clinic Contact)
**File:** `src/components/clinic/InquiryForm.tsx`  
**Current State:** ❌ NO country code dropdown  
**Current Input:** Plain text field with placeholder "+65 9123 4567" (Line 192)  
**Usage Context:** When users send inquiries to specific clinics  
**Action Required:** ⚠️ ADD DROPDOWN - Currently no way to select country

---

### **4. PARTNER SIGNUP FORM** (Clinic Onboarding)
**File:** `src/components/partner/PartnerFormFields.tsx`  
**Current State:** ❌ NO country code dropdown  
**Current Input:** Plain text field with placeholder "+60 12 345 6789" (Line 70)  
**Usage Context:** When dental clinics sign up as partners  
**Action Required:** ⚠️ ADD DROPDOWN - Currently assumes Malaysia

---

### **5. WAITLIST FORM** (Early Access Signups)
**File:** `src/components/WaitlistSection.tsx`  
**Current State:** ❌ NO country code dropdown  
**Current Input:** Plain text field labeled "mobile"  
**Usage Context:** When users join waitlist for new features  
**Action Required:** ⚠️ ADD DROPDOWN - Currently no country code support

---

### **6. REGULAR MEMBER SIGNUP** (PDPARegistrationForm)
**File:** `src/components/auth/PDPARegistrationForm.tsx`  
**Current State:** ✅ NO PHONE FIELD - Email-based registration only  
**Action Required:** ✅ NONE - This form doesn't collect phone numbers

---

## 📋 COMPLETE INTERNATIONAL COUNTRY CODE LIST

### **Priority Countries (Pinned on Top)**
```typescript
// Singapore & Malaysia - 99% of users
{ value: '+65', label: '🇸🇬 +65 Singapore', flag: '🇸🇬' },
{ value: '+60', label: '🇲🇾 +60 Malaysia', flag: '🇲🇾' },
```

### **Common ASEAN Countries**
```typescript
{ value: '+62', label: '🇮🇩 +62 Indonesia' },
{ value: '+66', label: '🇹🇭 +66 Thailand' },
{ value: '+84', label: '🇻🇳 +84 Vietnam' },
{ value: '+63', label: '🇵🇭 +63 Philippines' },
{ value: '+95', label: '🇲🇲 +95 Myanmar' },
{ value: '+855', label: '🇰🇭 +855 Cambodia' },
{ value: '+856', label: '🇱🇦 +856 Laos' },
{ value: '+673', label: '🇧🇳 +673 Brunei' },
```

### **Major Global Markets (Alphabetical)**
```typescript
{ value: '+61', label: '🇦🇺 +61 Australia' },
{ value: '+1', label: '🇨🇦 +1 Canada' },
{ value: '+86', label: '🇨🇳 +86 China' },
{ value: '+33', label: '🇫🇷 +33 France' },
{ value: '+49', label: '🇩🇪 +49 Germany' },
{ value: '+852', label: '🇭🇰 +852 Hong Kong' },
{ value: '+91', label: '🇮🇳 +91 India' },
{ value: '+39', label: '🇮🇹 +39 Italy' },
{ value: '+81', label: '🇯🇵 +81 Japan' },
{ value: '+82', label: '🇰🇷 +82 South Korea' },
{ value: '+64', label: '🇳🇿 +64 New Zealand' },
{ value: '+7', label: '🇷🇺 +7 Russia' },
{ value: '+966', label: '🇸🇦 +966 Saudi Arabia' },
{ value: '+34', label: '🇪🇸 +34 Spain' },
{ value: '+886', label: '🇹🇼 +886 Taiwan' },
{ value: '+971', label: '🇦🇪 +971 UAE' },
{ value: '+44', label: '🇬🇧 +44 United Kingdom' },
{ value: '+1', label: '🇺🇸 +1 United States' },
```

---

## ✅ PROPOSED SOLUTION

### **Step 1: Create Reusable Country Code Constant**
**New File:** `src/data/countryCodes.ts`

This centralizes the country code list for use across all forms:
- ✅ Pinned SG & Malaysia at top
- ✅ Separated by divider for visual clarity
- ✅ Comprehensive international coverage (150+ countries)
- ✅ Consistent format across all forms
- ✅ Easy to maintain in one place

### **Step 2: Update AppointmentBookingForm.tsx**
**Change:** Replace hardcoded 2-country array with full international list
- ✅ Import from centralized constant
- ✅ Maintain existing UI/UX behavior
- ✅ Default remains +65 for Singapore users

### **Step 3: Add Dropdowns to Forms Without Country Code**
**Files to Update:**
1. ✅ `AIScanPage.tsx` - Add country code dropdown + mobile field
2. ✅ `InquiryForm.tsx` - Add country code dropdown + WhatsApp field  
3. ✅ `PartnerFormFields.tsx` - Add country code dropdown + phone field
4. ✅ `WaitlistSection.tsx` - Add country code dropdown + mobile field

**UI Pattern:**
```tsx
<div className="flex gap-2">
  <Select value={countryCode} onValueChange={setCountryCode}>
    <SelectTrigger className="w-[140px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {countryCodes.map(code => (
        <SelectItem key={code.value} value={code.value}>
          {code.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <Input type="tel" placeholder="9123 4567" />
</div>
```

---

## 📊 IMPACT ANALYSIS

### **User Experience Improvements**
✅ **International Users:** Can now book appointments from any country  
✅ **Reduced Friction:** No need to manually type country code  
✅ **Data Quality:** Validated phone number format with proper country code  
✅ **Consistency:** Same UI pattern across all forms  

### **Business Benefits**
✅ **Market Expansion:** Support for medical tourists from all countries  
✅ **Compliance:** Proper phone number format for WhatsApp API  
✅ **Analytics:** Better tracking of user demographics by country  
✅ **Scalability:** Easy to add/remove countries in one place  

---

## 🚀 IMPLEMENTATION CHECKLIST

- [ ] **Create** `src/data/countryCodes.ts` with full international list
- [ ] **Update** `AppointmentBookingForm.tsx` to import country codes
- [ ] **Add dropdown** to `AIScanPage.tsx` mobile field
- [ ] **Add dropdown** to `InquiryForm.tsx` WhatsApp field
- [ ] **Add dropdown** to `PartnerFormFields.tsx` phone field
- [ ] **Add dropdown** to `WaitlistSection.tsx` mobile field
- [ ] **Test** all forms with different country codes
- [ ] **Verify** database stores country code + phone number correctly
- [ ] **Git commit** with descriptive message
- [ ] **Git push** to repository

---

## 🔍 FILES TO MODIFY

1. ✅ **CREATE:** `src/data/countryCodes.ts` (NEW FILE)
2. ✅ **UPDATE:** `src/components/AppointmentBookingForm.tsx`
3. ✅ **UPDATE:** `src/pages/AIScanPage.tsx`
4. ✅ **UPDATE:** `src/components/clinic/InquiryForm.tsx`
5. ✅ **UPDATE:** `src/components/partner/PartnerFormFields.tsx`
6. ✅ **UPDATE:** `src/components/WaitlistSection.tsx`

**Total Files:** 6 files (1 new, 5 updates)

---

## ⚠️ TESTING REQUIREMENTS

### **Functional Testing**
- [ ] Booking form selects country code correctly
- [ ] AI Scan signup accepts international numbers
- [ ] Inquiry form sends correct WhatsApp format
- [ ] Partner signup validates phone format
- [ ] Waitlist captures country code in database

### **Database Validation**
- [ ] `country_code` field stores value correctly
- [ ] WhatsApp API accepts formatted numbers
- [ ] Email templates display phone numbers correctly

### **Cross-Browser Testing**
- [ ] Dropdown renders on Chrome/Safari/Firefox
- [ ] Mobile browsers display dropdown correctly
- [ ] Touch interactions work on iOS/Android

---

**Ready for your approval to proceed with implementation!**

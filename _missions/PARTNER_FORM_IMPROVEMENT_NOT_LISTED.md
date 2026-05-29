# Partner Form Improvement: "Clinic Not Listed" Option

**Purpose:** Prevent embarrassing situations where partners can't sign up because their clinic isn't in the database yet.

---

## The Problem

Currently, the partner signup flow has a chicken-and-egg issue:
1. Partner tries to sign up via form
2. Form requires selecting clinic from dropdown
3. **If clinic not in database → Partner cannot proceed**
4. 😞 Embarrassing for both parties

## The Solution

Add a **"My clinic is not listed"** option that allows partners to:
1. Select "Not listed" from dropdown
2. Manually enter clinic details  
3. Auto-creates clinic record during signup
4. ✅ No pre-work needed, seamless experience

---

## Implementation Options

### **OPTION A: Simple Fallback** (Recommended - 30 mins)

Add special option to end of dropdown:

```tsx
<select
  {...form.register('clinicId', { required: true })}
  className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">-- Select Clinic --</option>
  {form.watch('clinicSource') === 'jb'
    ? sortedJbClinics.map((clinic) => (
        <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
      ))
    : sortedSgClinics.map((clinic) => (
        <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
      ))}
  
  {/* NEW: Add "Not Listed" option */}
  <option value="NOT_LISTED" className="font-bold text-blue-600">
    ➕ My clinic is not listed - Add manually
  </option>
</select>

{/* NEW: Show manual entry fields when "NOT_LISTED" selected */}
{form.watch('clinicId') === 'NOT_LISTED' && (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md space-y-4">
    <p className="text-sm text-blue-800 font-medium">
      Please enter your clinic details manually:
    </p>
    
    <FormField
      control={form.control}
      name="clinicName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Clinic Name *</FormLabel>
          <FormControl>
            <Input placeholder="e.g., Idea Dental" {...field} required />
          </FormControl>
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Clinic Address *</FormLabel>
          <FormControl>
            <Input placeholder="77, Jalan Mutiara, Johor Bahru" {...field} required />
          </FormControl>
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="contactName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Principal Dentist *</FormLabel>
          <FormControl>
            <Input placeholder="Dr. Samuel Khoo" {...field} required />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
)}
```

Then update the `onSubmit` function:

```tsx
const onSubmit = async (data: PartnerFormData) => {
  try {
    let selectedClinicName = '';
    let clinicIdNum: number | null = null;

    // Handle "NOT_LISTED" case - create new clinic first
    if (data.clinicId === 'NOT_LISTED') {
      // Insert new clinic into database
      const { data: newClinic, error: clinicError } = await supabase
        .from('clinics_data')
        .insert([
          {
            name: data.clinicName,
            address: data.address,
            dentist: data.contactName,
            country: data.clinicSource === 'jb' ? 'MY' : 'SG',
            rating: 4.0, // Default placeholder
            reviews: 0,
            mda_license: 'PENDING',
            credentials: 'Verified Partner',
            // All treatment flags default to true for now
            tooth_filling: true,
            root_canal: true,
            dental_crown: true,
            dental_implant: true,
            teeth_whitening: true,
            braces: true,
            wisdom_tooth: true,
            gum_treatment: true,
          }
        ])
        .select()
        .single();

      if (clinicError) {
        toast({
          title: "Error Creating Clinic",
          description: "Could not add your clinic to database. Please try again.",
          variant: "destructive",
        });
        return;
      }

      selectedClinicName = newClinic.name;
      clinicIdNum = newClinic.id;
    } else {
      // Existing logic for selected clinic
      if (data.clinicSource === 'jb') {
        const found = jbClinics.find((c) => String(c.id) === data.clinicId);
        selectedClinicName = found ? found.name : '';
      } else {
        const found = sgClinics.find((c) => String(c.id) === data.clinicId);
        selectedClinicName = found ? found.name : '';
      }
      clinicIdNum = Number(data.clinicId);
    }

    // Continue with auth signup...
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    const ownerUserId = signUpData.user?.id;

    // ... rest of existing signup flow
  } catch (error) {
    // ... error handling
  }
};
```

---

### **OPTION B: Two-Step Flow** (More complex - 1 hour)

1. **Step 1:** "Is your clinic already listed?"
   - YES → Show dropdown
   - NO → Show manual entry form

2. **Step 2:** Rest of partner application

**Pros:** Cleaner UX, clearer intent  
**Cons:** More complex flow, extra step

---

### **OPTION C: Search + Add** (Advanced - 2 hours)

Replace dropdown with searchable combobox:
- Type to search existing clinics
- If not found, click "Add new clinic"
- Inline manual entry

**Pros:** Best UX, scalable for many clinics  
**Cons:** Requires additional UI library (e.g., Radix Combobox)

---

## Recommended Next Steps

1. **SHORT TERM (Today):**
   - ✅ Run the SQL script to add Idea Dental and Pink & White
   - ✅ Notify partners to try again
   - ✅ Form works for current partners

2. **MEDIUM TERM (This Week):**
   - Implement Option A above
   - Test with dummy clinic entry
   - Deploy to production

3. **LONG TERM (Optional):**
   - Add admin approval for manually-added clinics
   - Send notification when new clinic auto-created
   - Implement clinic verification workflow

---

## Testing Checklist

After implementing Option A:

- [ ] Select "NOT_LISTED" → Manual fields appear
- [ ] Fill manual fields → Clinic gets created in database
- [ ] Partner signup completes successfully
- [ ] New clinic appears in dropdown for future partners
- [ ] Existing clinic selection still works normally
- [ ] Form validation works for manual fields
- [ ] Error handling works if clinic creation fails

---

## Admin Notification

When a partner adds clinic manually, send yourself an email:

```tsx
// After creating clinic
await fetch('/api/send-admin-notification', {
  method: 'POST',
  body: JSON.stringify({
    subject: '🆕 New Clinic Added via Partner Form',
    message: `
      A new clinic was added to the database:
      
      Name: ${data.clinicName}
      Address: ${data.address}
      Dentist: ${data.contactName}
      Source: ${data.clinicSource}
      
      Please verify details and update:
      - Google rating & reviews
      - MDA license number
      - Operating hours
      - Website URL
    `
  })
});
```

---

## Future Enhancement Ideas

1. **Google Places API Integration**
   - As partner types clinic name, search Google Places
   - Auto-populate address, phone, rating, reviews
   - One-click import

2. **SMS Verification**
   - Verify clinic phone number
   - Ensures legitimate clinic ownership

3. **Document Upload**
   - Upload MDA license certificate
   - Upload clinic photos
   - Build trust with patients

4. **Preview Before Submit**
   - Show how clinic card will appear
   - Let partner review and edit
   - Approve and publish

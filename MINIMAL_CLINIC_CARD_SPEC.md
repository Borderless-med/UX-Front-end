# Minimal Clinic Card - Technical Specification
**Purpose:** HCSA Section 31 compliant directory listing for non-authorized Singapore clinics  
**Created:** January 13, 2026  
**Target:** SDA prototype submission (Jan 20)

---

## Component Design

### File: `src/components/clinic/display/MinimalClinicCard.tsx`

**Props Interface:**
```tsx
interface MinimalClinicCardProps {
  clinic: {
    name: string;
    address: string;
    phone?: string;
    websiteUrl?: string;
    country?: string; // 'Singapore' | 'Malaysia'
  };
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────┐
│ ADVANCED DENTAL SIMEI                      │
│ 3 Simei Street 6 #02-31                    │
│ Singapore 528833                            │
│ ☎️ +65 6xxx xxxx                            │
│                                             │
│ ┌─────────────┐  ┌─────────────────────┐  │
│ │ 🌐 Website  │  │ 📝 Claim/Remove     │  │
│ └─────────────┘  └─────────────────────┘  │
│                                             │
│ Clinic owner? Update or remove listing →   │
└─────────────────────────────────────────────┘
```

---

## Code Implementation

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MinimalClinicCardProps {
  clinic: {
    name: string;
    address: string;
    phone?: string;
    websiteUrl?: string;
  };
}

const MinimalClinicCard = ({ clinic }: MinimalClinicCardProps) => {
  const navigate = useNavigate();

  const handleWebsiteClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '') {
      window.open(clinic.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOptOutClick = () => {
    navigate(`/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id || ''}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-200">
      <CardContent className="p-4">
        {/* Clinic Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {clinic.name}
        </h3>

        {/* Address */}
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          <p>{clinic.address}</p>
          {clinic.phone && (
            <p className="flex items-center">
              <span className="mr-1">☎️</span> {clinic.phone}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          {/* Website Button */}
          <Button
            onClick={handleWebsiteClick}
            variant="outline"
            size="sm"
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            disabled={!clinic.websiteUrl || clinic.websiteUrl === 'N/A' || clinic.websiteUrl.trim() === ''}
          >
            <Globe className="h-3 w-3 mr-1" />
            Website
          </Button>

          {/* Claim/Opt-Out Button */}
          <Button
            onClick={handleOptOutClick}
            variant="outline"
            size="sm"
            className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
          >
            <FileEdit className="h-3 w-3 mr-1" />
            Update
          </Button>
        </div>

        {/* Opt-Out Notice */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
          Clinic owner?{' '}
          <button
            onClick={handleOptOutClick}
            className="text-orange-600 hover:text-orange-700 underline font-medium"
          >
            Claim or remove listing
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalClinicCard;
```

---

## Conditional Rendering Logic

### Update `ClinicGrid.tsx`:

```tsx
import ClinicCard from './ClinicCard';
import MinimalClinicCard from './MinimalClinicCard';

// Helper function
const isSingaporeClinic = (clinic: Clinic) => {
  // Option 1: Check country field
  if (clinic.country) {
    return clinic.country.toLowerCase() === 'singapore';
  }
  
  // Option 2: Check address/township
  if (clinic.address) {
    return clinic.address.toLowerCase().includes('singapore');
  }
  
  // Option 3: Check township (if using existing logic)
  return isSGTownship(clinic.township);
};

// In render:
{clinics.map((clinic) => (
  <div key={clinic.id}>
    {isSingaporeClinic(clinic) ? (
      <MinimalClinicCard clinic={clinic} />
    ) : (
      <ClinicCard 
        clinic={clinic}
        isAuthenticated={isAuthenticated}
        onSignInClick={onSignInClick}
        onViewPractitionerDetails={onViewPractitionerDetails}
        hideDistance={hideDistance}
        selection={selection}
      />
    )}
  </div>
))}
```

---

## Database Changes (Optional)

### Add `country` field to clinics table:

```sql
ALTER TABLE clinics 
ADD COLUMN country VARCHAR(50) DEFAULT 'Malaysia';

-- Update existing SG clinics
UPDATE clinics 
SET country = 'Singapore' 
WHERE address LIKE '%Singapore%' 
   OR township IN ('Central', 'North', 'South', 'East', 'West');
```

---

## Page Banner Implementation

### Add to top of `/clinics` page:

```tsx
// In FindClinicsPrototype1.tsx or Clinics.tsx

<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <div className="flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-blue-900 font-medium mb-1">
        For Clinic Owners
      </p>
      <p className="text-xs text-blue-700">
        Listings are based on publicly available information. 
        <a 
          href="/opt-out-report" 
          className="underline font-medium hover:text-blue-900 ml-1"
        >
          Claim your listing
        </a> to update details or 
        <a 
          href="/opt-out-report" 
          className="underline font-medium hover:text-blue-900 ml-1"
        >
          request removal
        </a>.
      </p>
    </div>
  </div>
</div>
```

---

## Testing Checklist

**Functional Tests:**
- [ ] All 100 SG clinics render as MinimalClinicCard
- [ ] All 105 JB clinics render as full ClinicCard
- [ ] Website button works (opens in new tab)
- [ ] Update button navigates to opt-out form with pre-filled clinic name
- [ ] Opt-out notice link also works
- [ ] Card styling matches design system
- [ ] Mobile responsive (buttons stack properly)

**Compliance Verification:**
- [ ] No "Book Now" on SG cards
- [ ] No Google ratings displayed
- [ ] No service category badges
- [ ] No verification status badges
- [ ] No "Details" button requiring auth
- [ ] Only name, address, phone, website visible
- [ ] Opt-out mechanism clearly visible

**Edge Cases:**
- [ ] Clinic with no website URL (button disabled)
- [ ] Clinic with no phone number (phone line hidden)
- [ ] Very long clinic names (text wraps properly)
- [ ] Very long addresses (doesn't break layout)

---

## Deployment Steps

1. **Create component** (30 min)
2. **Update ClinicGrid conditional logic** (15 min)
3. **Add page banner** (10 min)
4. **Test on staging** (30 min)
5. **Deploy to production** (5 min)
6. **Verify live site** (15 min)

**Total Time:** ~2 hours

---

## SDA Demo Screenshots

**Capture these views:**

1. **Homepage** - Show no promotional language
2. **Compare Page** - Balanced framework, no price table
3. **Clinics Page** - Show JB clinic (full) vs SG clinic (minimal)
4. **Single SG Clinic Card** - Close-up of minimal design
5. **Opt-Out Form** - Show easy removal process

**Annotate screenshots:**
- Highlight removed elements (Book Now, ratings)
- Show opt-out button prominence
- Note factual-only information

---

**End of Specification**

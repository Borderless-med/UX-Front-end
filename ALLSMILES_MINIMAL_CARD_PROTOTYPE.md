# ALLSMILES DENTAL CARE PLUS - Minimal Card Prototype

**Date:** January 13, 2026  
**Purpose:** Visual reference for SG clinic card redesign  
**Status:** Compliant with HCSA 2020 Section 31

---

## BEFORE (Current - Non-Compliant)

```
┌──────────────────────────────────────────────────┐
│ ALLSMILES DENTAL CARE PLUS                      │
│                                                  │
│ 502 JURONG WEST AVENUE 1 #01-80...              │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ Google Reviews  ⭐ 5.0  (452)            │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ 🟠 Pending Verification                         │
│                                                  │
│ Available Services:                              │
│ [Basic Treat] [Restorative] [Cosmetic]          │
│ [Orthodontic] [+1]                               │
│                                                  │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│ ┃         📅  Book Now                    ┃   │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│                                                  │
│ [👤 Details] [🌐 Website] [📝 Update]           │
└──────────────────────────────────────────────────┘
```

**Problems:**
- ❌ "Book Now" = solicitation (Reg 5(1)(g) violation)
- ❌ Rating display "5.0 ⭐" = testimonial (Reg 14 violation)
- ❌ Service badges = promotional categorization
- ❌ "Pending Verification" = implied quality ranking
- ❌ Overall = Advertisement requiring Section 31 authorization

---

## AFTER (Minimal - Compliant)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ALLSMILES DENTAL CARE PLUS                     │
│                                                  │
│  📍 502 Jurong West Avenue 1 #01-80             │
│      Singapore 640502                            │
│                                                  │
│  ☎️  +65 6794 8022                               │
│                                                  │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │ 🌐 Visit Website │  │ ⭐ Google Reviews  │  │
│  └──────────────────┘  └────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │          📝  Claim or Remove Listing       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ────────────────────────────────────────────   │
│  Clinic owner? Update info or request removal → │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Features:**
- ✅ Name (prominent, large font)
- ✅ Full address with postal code
- ✅ Phone number (clickable on mobile)
- ✅ Website link (opens clinic's own site)
- ✅ Google Reviews link (no rating shown - opens Google search)
- ✅ Claim/Remove button (operational, not promotional)
- ✅ Footer opt-out text
- ✅ Clean, neutral design

**Compliance:**
- ✅ No solicitation (no Book Now)
- ✅ No testimonials (no rating display)
- ✅ No promotional language
- ✅ No quality/verification badges
- ✅ Factual directory information only
- ✅ NOT an advertisement (no Section 31 violation)

---

## HTML/React Component Structure

```tsx
interface MinimalClinicCardProps {
  clinic: {
    id: string;
    name: string;
    address: string;
    postalCode: string;
    phone?: string;
    website?: string;
    googleSearchQuery?: string;
  };
}

export function MinimalClinicCard({ clinic }: MinimalClinicCardProps) {
  const googleReviewsUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${clinic.name} reviews Singapore`
  )}`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Clinic Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {clinic.name}
      </h3>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-700">
          <p>{clinic.address}</p>
          <p>{clinic.postalCode}</p>
        </div>
      </div>

      {/* Phone */}
      {clinic.phone && (
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-gray-500" />
          <a 
            href={`tel:${clinic.phone}`}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {clinic.phone}
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Website Button */}
        {clinic.website && (
          <a
            href={clinic.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            Visit Website
          </a>
        )}

        {/* Google Reviews Link - NO RATING DISPLAY */}
        <a
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Star className="h-4 w-4" />
          Google Reviews
        </a>
      </div>

      {/* Claim/Remove Button - Orange/Warning Style */}
      <button
        onClick={() => {
          window.location.href = `/opt-out-report?clinic=${encodeURIComponent(
            clinic.name
          )}&clinicId=${clinic.id}`;
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-400 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors mb-3"
      >
        <FileEdit className="h-4 w-4" />
        Claim or Remove Listing
      </button>

      {/* Footer Opt-Out Notice */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Clinic owner?{' '}
          <button
            onClick={() => {
              window.location.href = `/opt-out-report?clinic=${encodeURIComponent(
                clinic.name
              )}&clinicId=${clinic.id}`;
            }}
            className="text-orange-600 hover:text-orange-700 underline font-medium"
          >
            Update info or request removal
          </button>
        </p>
      </div>
    </div>
  );
}
```

---

## CSS Styling Details

```css
/* Minimal Clinic Card Container */
.minimal-clinic-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.minimal-clinic-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Clinic Name */
.clinic-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.4;
}

/* Address & Phone */
.contact-info {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.contact-info a {
  color: #2563eb;
  text-decoration: none;
}

.contact-info a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Action Buttons */
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #f9fafb;
}

/* Claim/Remove Button - Distinct Styling */
.claim-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #fb923c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #c2410c;
  background: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.claim-button:hover {
  background-color: #fff7ed;
}

/* Footer Text */
.opt-out-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.opt-out-footer a {
  color: #ea580c;
  text-decoration: underline;
  font-weight: 500;
}

.opt-out-footer a:hover {
  color: #c2410c;
}
```

---

## Visual Design Principles

### 1. **Neutrality**
- No promotional colors (blue "Book Now" removed)
- White background, gray borders
- Equal visual weight for all buttons

### 2. **Clarity**
- Large clinic name (focal point)
- Icons for quick scanning (📍 ☎️ 🌐 ⭐)
- Clear hierarchy: Name → Contact → Actions → Opt-out

### 3. **Compliance Indicators**
- Orange "Claim/Remove" button (operational, not promotional)
- Footer text emphasizes clinic owner control
- No ratings/badges (no implied endorsement)

### 4. **Accessibility**
- Clickable phone number (mobile-friendly)
- Clear button labels
- Sufficient color contrast (WCAG AA compliant)
- Touch-friendly button sizes (min 44x44px)

---

## User Flow Comparison

### BEFORE (Current Flow):
1. User sees "5.0 ★★★★★ (452)" → Impressed
2. Sees "Book Now" button → Clicks
3. Taken to booking page → Converts
4. **Result:** OraChope facilitates transaction = Advertisement

### AFTER (Compliant Flow):
1. User sees clinic name/address → Interested
2. Clicks "Google Reviews" → Opens Google search
3. Verifies clinic independently → Makes decision
4. Clicks "Visit Website" → Goes to clinic's site
5. **Result:** User verifies independently = Directory

---

## Side-by-Side Comparison

| Feature | BEFORE | AFTER | Compliant? |
|---------|--------|-------|------------|
| **Clinic Name** | ✅ Shown | ✅ Shown | ✅ |
| **Address** | ✅ Partial | ✅ Full + Postal | ✅ |
| **Phone** | ❌ Hidden | ✅ Clickable | ✅ |
| **Rating Display** | ❌ "5.0 ⭐ (452)" | ✅ Removed | ✅ |
| **Reviews Link** | ❌ With rating | ✅ Text only | ✅ |
| **Book Now** | ❌ Prominent CTA | ✅ Removed | ✅ |
| **Service Badges** | ❌ Promotional | ✅ Removed | ✅ |
| **Verification Badge** | ❌ "Pending" | ✅ Removed | ✅ |
| **Website Link** | ✅ Present | ✅ Present | ✅ |
| **Opt-Out** | ❌ Hidden | ✅ Prominent | ✅ |
| **Classification** | ❌ Advertisement | ✅ Directory | ✅ |

---

## Implementation Checklist

### Development Tasks:
- [ ] Create `MinimalClinicCard.tsx` component
- [ ] Add country detection logic (SG vs JB)
- [ ] Update `ClinicGrid.tsx` conditional rendering
- [ ] Style claim/remove button (orange theme)
- [ ] Test Google Reviews link generation
- [ ] Verify mobile responsiveness
- [ ] Add accessibility attributes (aria-labels)

### Testing Scenarios:
- [ ] Card displays correctly for ALLSMILES DENTAL CARE PLUS
- [ ] Phone number is clickable on mobile
- [ ] Google Reviews opens correct search query
- [ ] Website link opens in new tab
- [ ] Claim/Remove navigates to opt-out form
- [ ] Footer text is readable
- [ ] Card works on 320px width (mobile)
- [ ] All 100 SG clinics render as minimal cards

### Deployment:
- [ ] Deploy to staging (Jan 14-15)
- [ ] Screenshot for SDA demo
- [ ] Deploy to production (Jan 17)
- [ ] Monitor for clinic owner feedback

---

## SDA Demo Screenshot

**For Submission on Jan 20:**

Take screenshot showing:
1. **Left:** JB clinic card (full features - Book Now, ratings, badges)
2. **Right:** ALLSMILES minimal card (name, address, website only)

**Caption:**
> "Two-tier system: JB clinics maintain full features (outside SDC jurisdiction). SG clinics display minimal directory information only - no promotional elements, no solicitation. Users can verify clinics independently via Google Reviews link."

---

## FAQ for Stakeholders

**Q: Why remove the rating?**  
A: HCSA Reg 14 prohibits testimonials. Displaying "5.0 ★★★★★" = implied endorsement. We keep the link so users can verify independently.

**Q: Won't this hurt conversions?**  
A: Short-term: possibly. Long-term: avoids $2M penalty and SDC suspension. Compliance is non-negotiable.

**Q: Do other platforms do this?**  
A: Most platforms either (1) operate outside healthcare, or (2) risk non-compliance. We choose compliance first.

**Q: Can we show ratings later?**  
A: Yes, IF we obtain written authorization from each clinic per HCSA Section 31.

**Q: What if clinic owners complain?**  
A: Prominent "Claim/Remove" button addresses concerns. We respond within 48 hours.

---

**Status:** ✅ Ready for implementation  
**Timeline:** 2-3 hours development  
**Risk:** 🟢 LOW - Compliant for SDA submission  
**Next Step:** SP to implement component (Jan 14, 2026)

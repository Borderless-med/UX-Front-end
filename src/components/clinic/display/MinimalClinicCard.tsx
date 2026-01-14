import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star, MessageCircle } from 'lucide-react';
import { Clinic } from '@/types/clinic';
import { InquiryForm } from '@/components/clinic/InquiryForm';
import { useState } from 'react';

interface MinimalClinicCardProps {
  clinic: Clinic;
}

/**
 * Minimal clinic card for Singapore clinics (HCSA compliant)
 * Features:
 * - Name, address, postal code (directory info only)
 * - Website link (neutral gateway) with subtle bg-gray-50
 * - Google Reviews link (no rating display) with subtle bg-gray-50
 * - WhatsApp/Email OraChope.org concierge (emerald-700/slate-600 - softer colors)
 * - Claim/Remove button (opt-out mechanism)
 * 
 * Removed (non-compliant):
 * - Book Now button (solicitation)
 * - Phone number (direct bypass)
 * - Rating display (testimonials)
 * - Service badges (promotional)
 * - Verification status (ranking)
 * - Redundant footer text under Claim button
 */
const MinimalClinicCard = ({ clinic }: MinimalClinicCardProps) => {
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  
  const googleReviewsUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${clinic.name} reviews Singapore`
  )}`;

  const handleClaimRemove = () => {
    window.location.href = `/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id}`;
  };

  return (
    <Card className="relative flex flex-col h-[22rem] w-full shadow-sm hover:shadow-md transition-shadow border-gray-200">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Clinic Name - FIXED HEIGHT for alignment */}
        <div className="mb-2 h-[2.5rem]">
          <h3 className="text-base font-bold text-gray-900 leading-tight break-words line-clamp-2">
            {clinic.name}
          </h3>
        </div>

        {/* Address - FIXED HEIGHT for alignment */}
        <div className="flex items-start gap-2 mb-2 h-[3.5rem]">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700 leading-tight line-clamp-3 overflow-hidden">
            <p>{clinic.address}</p>
          </div>
        </div>

        {/* Primary Action Buttons - Website & Google Reviews - ALWAYS 2 columns for alignment */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Website Button - Always render, disable if no URL */}
          <a
            href={clinic.websiteUrl && clinic.websiteUrl !== 'N/A' ? clinic.websiteUrl : '#'}
            target={clinic.websiteUrl && clinic.websiteUrl !== 'N/A' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!clinic.websiteUrl || clinic.websiteUrl === 'N/A') {
                e.preventDefault();
              }
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium transition-colors ${
              clinic.websiteUrl && clinic.websiteUrl !== 'N/A' 
                ? 'text-gray-700 hover:bg-gray-200 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <Globe className="h-3 w-3" />
            <span>Website</span>
          </a>

          {/* Google Reviews Link - Strong Google Blue */}
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 border border-blue-600 rounded-md text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Star className="h-3 w-3 fill-white" />
            <span>Google Reviews</span>
          </a>
        </div>

        {/* Spacer to push footer group to bottom */}
        <div className="flex-grow"></div>

        {/* Footer Group - Contact Form Button */}
        <div className="mt-auto">
          {/* Contact Button */}
          <div className="mb-2">
            <p className="text-xs text-gray-600 text-center mb-2 leading-tight">
              Have questions?
            </p>
          
            <button
              onClick={() => setIsInquiryFormOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact OraChope.org</span>
            </button>
          </div>

          {/* Claim/Remove Button */}
          <button
            onClick={handleClaimRemove}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-400 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors"
          >
            <span>📝 Claim or Remove</span>
          </button>
        </div>
      </CardContent>
    </Card>
    
    <InquiryForm
      clinic={clinic}
      isOpen={isInquiryFormOpen}
      onClose={() => setIsInquiryFormOpen(false)}
    />
  );
};

export default MinimalClinicCard;

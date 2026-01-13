import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star, MessageCircle, Mail } from 'lucide-react';
import { Clinic } from '@/types/clinic';

interface MinimalClinicCardProps {
  clinic: Clinic;
}

/**
 * Minimal clinic card for Singapore clinics (HCSA compliant)
 * Features:
 * - Name, address, postal code (directory info only)
 * - Website link (neutral gateway)
 * - Google Reviews link (no rating display)
 * - WhatsApp/Email OraChope.org concierge (lead capture)
 * - Claim/Remove button (opt-out mechanism)
 * 
 * Removed (non-compliant):
 * - Book Now button (solicitation)
 * - Phone number (direct bypass)
 * - Rating display (testimonials)
 * - Service badges (promotional)
 * - Verification status (ranking)
 */
const MinimalClinicCard = ({ clinic }: MinimalClinicCardProps) => {
  const googleReviewsUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${clinic.name} reviews Singapore`
  )}`;

  const whatsappNumber = '+6591234567'; // Replace with actual OraChope.org WhatsApp number
  const whatsappMessage = `Hi! I'd like to learn more about ${clinic.name} and compare dental options.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleClaimRemove = () => {
    window.location.href = `/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:support@orachope.org?subject=Inquiry about ${encodeURIComponent(clinic.name)}`;
  };

  return (
    <Card className="relative flex flex-col h-[26rem] w-full shadow-sm hover:shadow-md transition-shadow border-gray-200">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Clinic Name */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-gray-900 leading-tight break-words line-clamp-2">
            {clinic.name}
          </h3>
        </div>

        {/* Address - Fixed Height */}
        <div className="flex items-start gap-2 mb-3 h-[3rem]">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700 leading-tight line-clamp-3">
            <p>{clinic.address}</p>
          </div>
        </div>

        {/* Primary Action Buttons - Website & Google Reviews */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Website Button */}
          {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && (
            <a
              href={clinic.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span>Website</span>
            </a>
          )}

          {/* Google Reviews Link - NO RATING DISPLAY */}
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Star className="h-3 w-3" />
            <span>Google Reviews</span>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-1"></div>

        {/* OraChope.org Concierge Section - Lead Capture */}
        <div className="mb-2">
          <p className="text-xs text-gray-600 text-center mb-2 leading-relaxed">
            💡 Need help booking or comparing clinics?<br />
            <span className="font-medium">Contact OraChope.org concierge:</span>
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              <span>WhatsApp</span>
            </a>

            {/* Email Button */}
            <button
              onClick={handleEmailClick}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>Email Us</span>
            </button>
          </div>
        </div>

        {/* Footer Section - Pinned to Bottom */}
        <div className="mt-auto pt-4">
        {/* Claim/Remove Button - Orange Warning Style */}
        <button
          onClick={handleClaimRemove}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-400 rounded-md text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors mb-2"
        >
          <span>📝 Claim or Remove</span>
        </button>

        {/* Footer Opt-Out Notice */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Clinic owner?{' '}
            <button
              onClick={handleClaimRemove}
              className="text-orange-600 hover:text-orange-700 underline font-medium"
            >
              Claim or remove listing
            </button>
          </p>
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalClinicCard;

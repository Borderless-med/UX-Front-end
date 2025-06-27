
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="mb-6">
      {/* Legal Disclaimer Banner - Compressed */}
      <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/60 border border-blue-200/50 rounded-lg shadow-sm">
        <div className="px-4 py-3">
          {/* Header with Icon - Reduced spacing */}
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-blue-600/80 flex-shrink-0" />
            <h3 className="text-base font-semibold text-blue-900">Legal Disclaimers</h3>
          </div>

          {/* Consolidated Content - Single column on mobile, two columns on larger screens */}
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            {/* Left Column - Data Sources & Directory Policy */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-1">Data Sources & Directory Policy</h4>
                <div className="space-y-1">
                  <p className="text-xs text-blue-800/90 leading-tight">
                    <strong>Treatment & Ratings:</strong> Sourced from public listings and Google Business (as of {currentDate}). 
                    Information may not reflect current services - confirm directly with clinics.
                    <a 
                      href="https://support.google.com/business/answer/3474050" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline ml-1 inline-flex items-center gap-1"
                    >
                      Rating policy
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </p>
                  <p className="text-xs text-blue-800/90 leading-tight">
                    <strong>Verification:</strong> We have not verified credentials or services. Users must conduct due diligence when selecting providers.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - No Endorsement & Liability */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-1">No Endorsement & Liability</h4>
                <div className="space-y-1">
                  <p className="text-xs text-blue-800/90 leading-tight">
                    Listing does not imply endorsement, professional relationship, or guarantee of quality. 
                    Information compiled from publicly available sources only.
                  </p>
                  <p className="text-xs text-blue-800/90 leading-tight">
                    <strong>Liability:</strong> Platform not responsible for outcomes from user interactions with listed clinics. 
                    Users are advised to verify all information independently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar - Reduced padding */}
          <div className="flex justify-end pt-2 border-t border-blue-200/40">
            <Button
              onClick={onOptOutClick}
              variant="outline"
              size="sm"
              className="bg-white/80 border-orange-400/60 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-200 text-xs px-3 py-1 h-auto"
            >
              Opt-out or Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerSection;

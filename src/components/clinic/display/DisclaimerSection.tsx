
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
      {/* Legal Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/60 border border-blue-200/50 rounded-lg shadow-sm">
        <div className="px-5 py-4">
          {/* Header with Icon */}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-blue-600/80 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-blue-900">Legal Disclaimers</h3>
          </div>

          {/* 2x2 Grid Layout - Removed Medical Notice */}
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Data Sources & Attribution */}
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-2">Data Sources & Attribution</h4>
                <div className="space-y-2">
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    <strong>Treatment Offerings:</strong> Sourced from public listings and may not reflect all current services. 
                    Please confirm directly with the clinic before booking appointments.
                  </p>
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    <strong>Google Ratings:</strong> As of {currentDate}, sourced from Google Business listings. 
                    <a 
                      href="https://support.google.com/business/answer/3474050" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline ml-1 inline-flex items-center gap-1"
                    >
                      View Google's rating policy
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* No Endorsement */}
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-2">No Endorsement</h4>
                <p className="text-xs text-blue-800/90 leading-relaxed">
                  Listing does not imply endorsement or professional relationship. 
                  Information compiled from publicly available sources.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Directory Policy */}
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-2">Directory Policy</h4>
                <div className="space-y-2">
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    <strong>Verification Status:</strong> We have not verified the credentials, qualifications, or services of these clinics. 
                    Users must conduct their own due diligence when selecting healthcare providers.
                  </p>
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    <strong>Liability:</strong> Information compiled from publicly available sources. 
                    Listing does not imply endorsement or professional relationship with our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-3 border-t border-blue-200/40">
            <Button
              onClick={onOptOutClick}
              variant="outline"
              size="sm"
              className="bg-white/80 border-orange-400/60 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-200 text-xs px-3 py-1.5 h-auto"
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

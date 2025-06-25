
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="mb-8">
      {/* Consolidated Platform Information Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200/60 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-600/80" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Platform Information & Disclaimers</h3>
              <p className="text-sm text-gray-600">Important information about our directory and data sources</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Medical Notice */}
            <div className="border-l-3 border-blue-400/30 pl-4">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Medical Notice</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                This platform provides general information only and does not constitute dental advice. 
                No professional relationship is created with listed practitioners. Always consult qualified dental professionals for diagnosis and treatment.
              </p>
            </div>

            {/* Data Sources & Attribution */}
            <div className="border-l-3 border-green-400/30 pl-4">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Data Sources & Attribution</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Treatment Offerings:</strong> Sourced from public listings and may not reflect all current services. 
                  Please confirm directly with the clinic before booking appointments.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
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

            {/* Directory Policy */}
            <div className="border-l-3 border-orange-400/30 pl-4">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Directory Policy</h4>
              <div className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Information compiled from publicly available sources. Listing does not imply endorsement or professional relationship. 
                  Clinic owners may request removal or report issues.
                </p>
                <Button
                  onClick={onOptOutClick}
                  variant="outline"
                  size="sm"
                  className="bg-white border-orange-500/60 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-all duration-200 font-medium shadow-sm flex-shrink-0"
                >
                  Opt-out or Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerSection;

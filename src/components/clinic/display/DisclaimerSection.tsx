
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="mb-6">
      {/* Compact Legal Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/60 border border-blue-200/50 rounded-lg shadow-sm">
        <div className="px-5 py-4">
          {/* Primary Tier - Always Visible Core Disclaimers */}
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-blue-600/80 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Medical Notice</h4>
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    This platform provides general information only and does not constitute dental advice. 
                    Always consult qualified dental professionals for diagnosis and treatment.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">No Endorsement</h4>
                  <p className="text-xs text-blue-800/90 leading-relaxed">
                    Listing does not imply endorsement or professional relationship. 
                    Information compiled from publicly available sources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-blue-200/40">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-100/50 p-2 h-auto"
                >
                  <Info className="h-4 w-4 mr-2" />
                  <span className="text-xs font-medium">
                    {isExpanded ? 'Hide Details' : 'View Data Sources & Full Disclaimers'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 ml-2" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-2" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              {/* Secondary Tier - Expandable Detailed Information */}
              <CollapsibleContent className="mt-4">
                <div className="bg-white/60 rounded-md border border-blue-200/30 p-4 space-y-4">
                  {/* Data Sources & Attribution */}
                  <div className="border-l-3 border-green-400/40 pl-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Data Sources & Attribution</h4>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <strong>Treatment Offerings:</strong> Sourced from public listings and may not reflect all current services. 
                        Please confirm directly with the clinic before booking appointments.
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
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
                  <div className="border-l-3 border-orange-400/40 pl-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Directory Policy</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Information compiled from publicly available sources. Listing does not imply endorsement or professional relationship. 
                      We have not verified the credentials, qualifications, or services of these clinics. 
                      Users must conduct their own due diligence when selecting healthcare providers.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

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

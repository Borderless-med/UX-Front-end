
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle } from 'lucide-react';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  return (
    <>
      {/* First Disclaimer - Enhanced with rich blue styling for highest priority */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200/80 border-l-4 border-blue-500 rounded-r-lg px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-300/70 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-700 drop-shadow-md" />
            </div>
            <div className="text-sm text-blue-900 leading-relaxed font-medium">
              <strong className="text-blue-800 font-bold">Important:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </div>
          </div>
        </div>
      </div>

      {/* Second Disclaimer - Enhanced with warm orange/amber styling for medium priority */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-100/80 border-l-4 border-orange-400 rounded-r-lg px-6 py-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200/70 backdrop-blur-sm">
          <div className="flex justify-between items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-orange-600 drop-shadow-md" />
              </div>
              <div className="text-sm text-orange-900 leading-relaxed font-medium">
                <strong className="text-orange-800 font-bold">Directory Disclaimer:</strong> Information compiled from publicly available sources. 
                Listing does not imply endorsement, professional relationship, or recommendation. 
                This platform does not provide medical advice or establish practitioner-patient relationships.
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={onOptOutClick}
                variant="outline"
                size="sm"
                className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200 font-semibold shadow-md hover:shadow-lg px-4 py-2"
              >
                Opt-out or report issues
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerSection;

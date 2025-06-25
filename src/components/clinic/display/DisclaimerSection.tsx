
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle } from 'lucide-react';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  return (
    <>
      {/* First Disclaimer - Enhanced with proper 3D styling */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/60 border-l-4 border-blue-400 rounded-r-lg px-6 py-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-200/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-600 drop-shadow-sm" />
            </div>
            <div className="text-sm text-blue-900 leading-relaxed font-medium">
              <strong className="text-blue-800 font-semibold">Important:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </div>
          </div>
        </div>
      </div>

      {/* Second Disclaimer with Enhanced Opt-out Button */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 border border-gray-300/60 rounded-lg px-6 py-5 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 drop-shadow-sm" />
              </div>
              <div className="text-sm text-gray-800 leading-relaxed font-medium">
                <strong className="text-gray-900 font-semibold">Directory Disclaimer:</strong> Information compiled from publicly available sources. 
                Listing does not imply endorsement, professional relationship, or recommendation. 
                This platform does not provide medical advice or establish practitioner-patient relationships.
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={onOptOutClick}
                variant="outline"
                size="sm"
                className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md px-4 py-2"
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

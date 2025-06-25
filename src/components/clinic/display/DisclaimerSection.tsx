
import { Button } from '@/components/ui/button';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  return (
    <>
      {/* First Disclaimer */}
      <div className="mb-6">
        <div className="bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="text-sm text-blue-800/90 leading-relaxed">
              <strong>Important:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </div>
          </div>
        </div>
      </div>

      {/* Second Disclaimer with Opt-out Button */}
      <div className="mb-8">
        <div className="bg-gray-50/50 border border-gray-200/40 rounded-lg px-5 py-4">
          <div className="flex justify-between items-start">
            <div className="text-sm text-blue-800/90 leading-relaxed flex-1 mr-4">
              <strong>Directory Disclaimer:</strong> Information compiled from publicly available sources. 
              Listing does not imply endorsement, professional relationship, or recommendation. 
              This platform does not provide medical advice or establish practitioner-patient relationships.
            </div>
            <Button
              onClick={onOptOutClick}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-shrink-0"
            >
              Opt-out or report issues
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerSection;

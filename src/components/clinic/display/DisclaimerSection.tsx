
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerSectionProps {
  onOptOutClick: () => void;
}

const DisclaimerSection = ({ onOptOutClick }: DisclaimerSectionProps) => {
  return (
    <>
      {/* Directory Disclaimer - Enhanced with warm orange/amber styling and prominent 3D effects */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-orange-50 via-orange-75 to-amber-100/90 border-l-4 border-orange-400 rounded-r-lg px-6 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/70 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/40">
          <div className="flex justify-between items-start gap-6 relative z-10">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5 text-orange-600 drop-shadow-lg filter" style={{ filter: 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3))' }} />
              </div>
              <div className="text-sm text-orange-900 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(249, 115, 22, 0.1)' }}>
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
                className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200 font-semibold shadow-lg hover:shadow-xl px-4 py-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"
              >
                Opt-out or report issues
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Reviews & Rating Information Box - Styled to match Important Disclaimer */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200/90 border-l-4 border-blue-500 rounded-r-lg px-6 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-300/70 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/40">
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-700 drop-shadow-lg filter" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} />
            </div>
            <div className="text-sm text-blue-900 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(59, 130, 246, 0.1)' }}>
              <strong className="text-blue-800 font-bold">Google Reviews & Ratings:</strong> Clinic ratings and reviews are sourced from Google Business listings. 
              We display publicly available Google ratings to help users make informed decisions about dental care providers in Johor Bahru.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerSection;

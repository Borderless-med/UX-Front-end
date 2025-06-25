
import { Info } from 'lucide-react';

const ImportantNotes = () => {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200/90 border-l-4 border-blue-500 rounded-r-lg px-6 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-300/70 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/40">
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 mt-0.5">
            <Info className="h-5 w-5 text-blue-700 drop-shadow-lg filter" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} />
          </div>
          <div className="text-sm text-blue-900 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(59, 130, 246, 0.1)' }}>
            <strong className="text-blue-800 font-bold">Important Disclaimer:</strong>
            <ul className="mt-2 space-y-1 ml-2">
              <li>• Prices are estimates and may vary based on clinic, complexity, and individual cases</li>
              <li>• Singapore prices reflect private clinic rates; public healthcare options may be different</li>
              <li>• All partner clinics in JB are verified for quality and safety standards</li>
              <li>• Travel costs and time should be factored into overall treatment planning</li>
              <li>• Consultation fees and follow-up visits may apply separately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotes;

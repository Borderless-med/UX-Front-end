
import { Info } from 'lucide-react';

const ImportantNotes = () => {
  return (
    <div className="mb-2 sm:mb-3">
      <div className="bg-gradient-to-br from-blue-100 to-blue-200/90 border-l-2 sm:border-l-4 border-blue-500 rounded-r-lg px-3 py-2 sm:px-4 sm:py-3 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-300/70">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
          </div>
          <div className="text-xs sm:text-sm text-blue-900 leading-snug font-medium">
            <strong className="text-blue-800 font-bold">Important Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
            No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotes;


import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const ImportantNotes = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 sm:mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200/90 border-l-2 border-blue-500 rounded-r-lg px-2 py-1.5 sm:px-3 sm:py-2 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-300/70">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Info className="h-3 w-3 text-blue-700 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-900 font-medium">Important Disclaimer</span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-3 w-3 text-blue-700 transition-transform duration-200 flex-shrink-0",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/90 border-l-2 border-blue-500 rounded-r-lg px-2 py-2 sm:px-3 sm:py-3 mt-1 border border-blue-300/50">
            <div className="text-xs sm:text-sm text-blue-900 leading-snug">
              This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ImportantNotes;

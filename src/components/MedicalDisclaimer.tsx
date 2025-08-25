
import { AlertTriangle, Info, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact' | 'subtle';
  className?: string;
  fullWidth?: boolean;
}

const MedicalDisclaimer = ({ variant = 'card', className = '', fullWidth = false }: MedicalDisclaimerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'banner') {
    return (
      <div className={`mt-8 ${className}`}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full">
            <div className={`bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg ${fullWidth ? 'px-2 py-1.5 sm:px-4 sm:py-2' : 'px-4 py-2'} shadow-sm hover:shadow-md transition-all duration-300`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600/80 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-blue-800/90 font-medium">Important Disclaimer</span>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4 text-blue-600/80 transition-transform duration-200 flex-shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className={`bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg ${fullWidth ? 'px-2 py-2 sm:px-4 sm:py-3' : 'px-4 py-3'} mt-1`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-blue-800/90 font-medium leading-relaxed">
                    <strong>Important:</strong> This platform provides general information only and does not constitute dental advice. 
                    No professional relationship is created with listed practitioners.
                  </p>
                  <p className="text-xs text-blue-700/80 leading-relaxed">
                    Always consult with qualified dental professionals for diagnosis and treatment. 
                    In case of dental emergencies, seek immediate professional care.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`text-xs text-blue-700/80 bg-blue-50/40 px-4 py-3 rounded-md border border-blue-200/30 ${className}`}>
        <div className="flex items-start gap-2">
          <Info className="h-3 w-3 text-blue-600/70 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-blue-800/90">Medical Disclaimer:</strong> Information provided is for general purposes only. 
            No dental advice or professional relationship is established. Consult qualified practitioners for treatment.
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`bg-gray-50/50 border border-gray-200/40 rounded-lg px-5 py-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-blue-600/70 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-800/90 font-medium leading-relaxed">
              <strong>Important:</strong> This platform provides general information only and does not constitute dental advice.
            </p>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Alert className={`bg-blue-50/40 border-blue-200/50 shadow-sm ${className}`}>
      <AlertTriangle className="h-4 w-4 text-blue-600/80" />
      <AlertDescription className="text-blue-800/90 leading-relaxed">
        <strong>Important Medical Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
        No professional relationship is created with listed practitioners. Always consult with qualified dental professionals for 
        diagnosis and treatment decisions. In case of dental emergencies, seek immediate professional care.
      </AlertDescription>
    </Alert>
  );
};

export default MedicalDisclaimer;

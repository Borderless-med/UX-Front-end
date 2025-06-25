
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact' | 'subtle' | 'important-disclaimer';
  className?: string;
}

const MedicalDisclaimer = ({ variant = 'card', className = '' }: MedicalDisclaimerProps) => {
  if (variant === 'important-disclaimer') {
    return (
      <div className={`mb-6 ${className}`}>
        <div className="bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200/90 border-l-4 border-blue-500 rounded-r-lg px-6 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-300/70 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/40">
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-700 drop-shadow-lg filter" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} />
            </div>
            <div className="text-sm text-blue-900 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(59, 130, 246, 0.1)' }}>
              <strong className="text-blue-800 font-bold">Important Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg px-6 py-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600/80 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-sm text-blue-800/90 font-medium leading-relaxed">
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

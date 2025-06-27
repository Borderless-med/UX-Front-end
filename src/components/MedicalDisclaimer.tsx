
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact' | 'subtle';
  className?: string;
  fullWidth?: boolean;
}

const MedicalDisclaimer = ({ variant = 'card', className = '', fullWidth = false }: MedicalDisclaimerProps) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg ${fullWidth ? 'px-0' : 'px-6'} py-4 ${className}`}>
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

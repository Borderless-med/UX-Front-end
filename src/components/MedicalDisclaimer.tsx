
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact' | 'subtle';
  className?: string;
}

const MedicalDisclaimer = ({ variant = 'card', className = '' }: MedicalDisclaimerProps) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50/70 border-l-4 border-blue-300 rounded-r-lg px-6 py-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              <strong>Medical Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners.
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
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
      <div className={`text-xs text-gray-600 bg-gray-50/80 px-4 py-3 rounded-md border border-gray-200/50 ${className}`}>
        <div className="flex items-start gap-2">
          <Info className="h-3 w-3 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-gray-700">Medical Disclaimer:</strong> Information provided is for general purposes only. 
            No dental advice or professional relationship is established. Consult qualified practitioners for treatment.
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-lg px-5 py-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              <strong>Important:</strong> This platform provides general information only and does not constitute dental advice.
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Alert className={`bg-amber-50/80 border-amber-200/60 shadow-sm ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 leading-relaxed">
        <strong>Important Medical Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
        No professional relationship is created with listed practitioners. Always consult with qualified dental professionals for 
        diagnosis and treatment decisions. In case of dental emergencies, seek immediate professional care.
      </AlertDescription>
    </Alert>
  );
};

export default MedicalDisclaimer;

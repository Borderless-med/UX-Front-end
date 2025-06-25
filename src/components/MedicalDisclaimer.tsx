
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'compact';
  className?: string;
}

const MedicalDisclaimer = ({ variant = 'card', className = '' }: MedicalDisclaimerProps) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-2">
              <strong>Medical Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners.
            </p>
            <p className="text-sm text-blue-700">
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
      <div className={`text-xs text-gray-600 bg-gray-50 p-2 rounded border ${className}`}>
        <strong>Medical Disclaimer:</strong> Information provided is for general purposes only. 
        No dental advice or professional relationship is established. Consult qualified practitioners for treatment.
      </div>
    );
  }

  return (
    <Alert className={`bg-amber-50 border-amber-200 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Important Medical Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
        No professional relationship is created with listed practitioners. Always consult with qualified dental professionals for 
        diagnosis and treatment decisions. In case of dental emergencies, seek immediate professional care.
      </AlertDescription>
    </Alert>
  );
};

export default MedicalDisclaimer;


import { MapPin, Clock, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ClinicCardInfoProps {
  clinic: {
    distance: number;
    operatingHours: string;
    mdaLicense: string;
  };
}

const ClinicCardInfo = ({ clinic }: ClinicCardInfoProps) => {
  const formatOperatingHours = (hours: string) => {
    if (!hours || hours === 'Not Listed' || hours === 'Operating hours not available') {
      return 'Operating hours not available';
    }
    return hours.split('\n').map((line, index) => (
      <div key={index} className="text-sm">
        {line.trim()}
      </div>
    ));
  };

  const hasValidOperatingHours = clinic.operatingHours && clinic.operatingHours !== 'Operating hours not available';

  return (
    <>
      {/* Second Row: Distance and Operating Hours */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs sm:text-sm text-neutral-gray min-w-0">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{clinic.distance.toFixed(1)}km from CIQ</span>
        </div>
        
        {/* Operating Hours */}
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto hover:bg-gray-50"
                title="View operating hours"
              >
                <Clock className="h-4 w-4 text-blue-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-dark">Operating Hours</h4>
                <div className="text-neutral-gray">
                  {hasValidOperatingHours ? formatOperatingHours(clinic.operatingHours) : 'Operating hours not available'}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* License Status - Fixed Height */}
      <div className="flex items-center justify-end h-8 mt-2">
        {clinic.mdaLicense && clinic.mdaLicense !== 'Pending verification' && clinic.mdaLicense !== 'Pending Application' ? (
          <div className="flex items-center text-sm text-green-600">
            <Shield className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-orange-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Pending Verification</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ClinicCardInfo;

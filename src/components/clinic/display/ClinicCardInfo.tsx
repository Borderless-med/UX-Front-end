
import { MapPin, Clock, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ClinicCardInfoProps {
  clinic: {
    distance: number;
    operatingHours: string;
    mdaLicense: string;
  };
  hideDistance?: boolean;
}

const ClinicCardInfo = ({ clinic, hideDistance = false }: ClinicCardInfoProps) => {
  const formatOperatingHours = (hours: string) => {
    if (!hours || hours === 'Not Listed' || hours === 'Operating hours not available') {
      return 'Operating hours not available';
    }

    // Helper function to convert time format (e.g., "10:00 AM" -> "10am")
    const formatTime = (timeStr: string) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return timeStr;
      
      const [, hour, minute, period] = match;
      const hourNum = parseInt(hour);
      const periodLower = period.toLowerCase();
      
      // If minutes are 00, omit them
      if (minute === '00') {
        return `${hourNum}${periodLower}`;
      } else {
        return `${hourNum}:${minute}${periodLower}`;
      }
    };

    // Parse each line to extract day and hours
    const dayHours: { [key: string]: string } = {};
    const lines = hours.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, day, timeRange] = match;
        if (timeRange.toLowerCase().includes('closed')) {
          dayHours[day.toLowerCase()] = 'Closed';
        } else {
          // Extract start and end times
          const timeMatch = timeRange.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[–-]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
          if (timeMatch) {
            const [, startTime, endTime] = timeMatch;
            dayHours[day.toLowerCase()] = `${formatTime(startTime)}-${formatTime(endTime)}`;
          } else {
            dayHours[day.toLowerCase()] = timeRange;
          }
        }
      }
    }

    // Group days with same hours
    const groups: { days: string[]; hours: string }[] = [];
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbr: { [key: string]: string } = {
      monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', 
      thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
    };

    for (const day of dayOrder) {
      if (dayHours[day]) {
        const existingGroup = groups.find(g => g.hours === dayHours[day]);
        if (existingGroup) {
          existingGroup.days.push(dayAbbr[day]);
        } else {
          groups.push({ days: [dayAbbr[day]], hours: dayHours[day] });
        }
      }
    }

    // Format groups
    const formattedGroups = groups.map(group => {
      let dayRange;
      if (group.days.length === 1) {
        dayRange = group.days[0];
      } else if (group.days.length === 2 && 
                 ((group.days.includes('Mon') && group.days.includes('Tue')) ||
                  (group.days.includes('Sat') && group.days.includes('Sun')))) {
        dayRange = group.days.join('-');
      } else if (group.days.length >= 3) {
        // Check for consecutive weekdays
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const weekdaysInGroup = group.days.filter(d => weekdays.includes(d));
        const weekendDays = group.days.filter(d => ['Sat', 'Sun'].includes(d));
        
        if (weekdaysInGroup.length === 5) {
          dayRange = 'Mon-Friday';
        } else if (weekdaysInGroup.length >= 3 && weekdaysInGroup.length < 5) {
          dayRange = `${weekdaysInGroup[0]}-${weekdaysInGroup[weekdaysInGroup.length - 1]}`;
        } else if (weekendDays.length === 2) {
          dayRange = 'Sat-Sun';
        } else {
          dayRange = group.days.join(', ');
        }
      } else {
        dayRange = group.days.join(', ');
      }
      
      return `${dayRange}: ${group.hours}`;
    });

    return (
      <div className="space-y-1">
        {formattedGroups.map((groupText, index) => (
          <div key={index} className="text-sm">
            {groupText}
          </div>
        ))}
      </div>
    );
  };

  const hasValidOperatingHours = clinic.operatingHours && clinic.operatingHours !== 'Operating hours not available';

  return (
    <>
      {/* Second Row: Distance and Operating Hours */}
      <div className="flex items-center justify-between mb-3">
        {!hideDistance && (
          <div className="flex items-center text-xs sm:text-sm text-neutral-gray min-w-0">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{clinic.distance.toFixed(1)}km from CIQ</span>
          </div>
        )}
        
        {/* Operating Hours */}
        <div className="flex items-center ml-auto">
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

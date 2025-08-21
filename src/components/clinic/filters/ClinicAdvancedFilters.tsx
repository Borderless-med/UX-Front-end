
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { credentialOptions } from '../utils/clinicConstants';

interface ClinicAdvancedFiltersProps {
  maxDistance: number;
  onMaxDistanceChange: (distance: number) => void;
  minReviews: number;
  onMinReviewsChange: (reviews: number) => void;
}

const ClinicAdvancedFilters = ({
  maxDistance,
  onMaxDistanceChange,
  minReviews,
  onMinReviewsChange
}: ClinicAdvancedFiltersProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-sidebar-foreground">Advanced Filters</h3>
      <div className="space-y-6">
        {/* Max Distance from CIQ */}
        <div>
          <h4 className="font-medium text-sidebar-foreground mb-3">
            Max Distance from CIQ: {maxDistance}km
          </h4>
          <Slider
            value={[maxDistance]}
            onValueChange={(value) => onMaxDistanceChange(value[0])}
            max={40}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Minimum Google Reviews */}
        <div>
          <h4 className="font-medium text-sidebar-foreground mb-3">
            Minimum Google Reviews: {minReviews}
          </h4>
          <Slider
            value={[minReviews]}
            onValueChange={(value) => onMinReviewsChange(value[0])}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Credentials - Compact Grid Layout */}
        <div>
          <h4 className="font-medium text-sidebar-foreground mb-3">Credentials</h4>
          <div className="grid grid-cols-1 gap-2">
            {credentialOptions.map((credential) => (
              <div key={credential.key} className="flex items-center space-x-2">
                <Checkbox
                  id={credential.key}
                />
                <label 
                  htmlFor={credential.key} 
                  className="text-sm text-sidebar-foreground cursor-pointer leading-tight"
                >
                  {credential.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicAdvancedFilters;

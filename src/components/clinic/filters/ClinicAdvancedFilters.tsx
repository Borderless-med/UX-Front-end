
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { credentialOptions } from '../utils/clinicConstants';

interface ClinicAdvancedFiltersProps {
  maxDistance: number;
  onMaxDistanceChange: (distance: number) => void;
  minReviews: number;
  onMinReviewsChange: (reviews: number) => void;
  distanceRange: number[];
  onDistanceRangeChange: (range: number[]) => void;
}

const ClinicAdvancedFilters = ({
  maxDistance,
  onMaxDistanceChange,
  minReviews,
  onMinReviewsChange,
  distanceRange,
  onDistanceRangeChange
}: ClinicAdvancedFiltersProps) => {
  return (
    <div className="mt-6 border-t border-blue-light pt-6">
      <h3 className="text-lg font-medium text-blue-dark mb-4">Advanced Filters</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Max Distance from CIQ */}
        <div>
          <h4 className="font-medium text-blue-dark mb-3">
            Max Distance from CIQ: {maxDistance}km
          </h4>
          <Slider
            value={[maxDistance]}
            onValueChange={(value) => onMaxDistanceChange(value[0])}
            max={110}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* Minimum Reviews */}
        <div>
          <h4 className="font-medium text-blue-dark mb-3">
            Minimum Reviews: {minReviews}
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

        {/* Credentials */}
        <div>
          <h4 className="font-medium text-blue-dark mb-3">Credentials</h4>
          <div className="space-y-2">
            {credentialOptions.map((credential) => (
              <div key={credential.key} className="flex items-center space-x-2">
                <Checkbox
                  id={credential.key}
                />
                <label 
                  htmlFor={credential.key} 
                  className="text-sm text-neutral-gray cursor-pointer"
                >
                  {credential.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Distance Range */}
        <div>
          <h4 className="font-medium text-blue-dark mb-3">
            Distance Range: {distanceRange[0]}-{distanceRange[1]}km
          </h4>
          <Slider
            value={distanceRange}
            onValueChange={onDistanceRangeChange}
            max={110}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicAdvancedFilters;

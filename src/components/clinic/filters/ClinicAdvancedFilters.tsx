
import { Slider } from '@/components/ui/slider';
import CredentialsDropdown from './components/CredentialsDropdown';

interface ClinicAdvancedFiltersProps {
  maxDistance: number;
  onMaxDistanceChange: (distance: number) => void;
  minReviews: number;
  onMinReviewsChange: (reviews: number) => void;
  selectedCredentials: string[];
  onCredentialsChange: (credentials: string[]) => void;
}

const ClinicAdvancedFilters = ({
  maxDistance,
  onMaxDistanceChange,
  minReviews,
  onMinReviewsChange,
  selectedCredentials,
  onCredentialsChange
}: ClinicAdvancedFiltersProps) => {
  return (
    <div className="pt-4 border-t border-sidebar-border">
      <h3 className="text-sm font-medium text-sidebar-muted-foreground mb-4">Advanced Filters</h3>
      <div className="space-y-6">
        {/* Max Distance from CIQ */}
        <div>
          <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
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
          <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
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

        {/* Credentials Dropdown */}
        <CredentialsDropdown
          selectedCredentials={selectedCredentials}
          onCredentialsChange={onCredentialsChange}
        />
      </div>
    </div>
  );
};

export default ClinicAdvancedFilters;

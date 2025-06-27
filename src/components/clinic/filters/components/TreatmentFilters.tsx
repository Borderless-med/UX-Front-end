
import { Shield } from 'lucide-react';
import { treatmentCategories } from '../../utils/clinicConstants';
import SelectedTreatmentBadges from './SelectedTreatmentBadges';
import TreatmentCategoryDropdown from './TreatmentCategoryDropdown';

interface TreatmentFiltersProps {
  selectedTreatments: string[];
  onTreatmentChange: (treatments: string[]) => void;
}

const TreatmentFilters = ({ selectedTreatments, onTreatmentChange }: TreatmentFiltersProps) => {
  const toggleTreatment = (treatment: string) => {
    const newTreatments = selectedTreatments.includes(treatment)
      ? selectedTreatments.filter(t => t !== treatment)
      : [...selectedTreatments, treatment];
    onTreatmentChange(newTreatments);
  };

  const removeTreatment = (treatment: string) => {
    onTreatmentChange(selectedTreatments.filter(t => t !== treatment));
  };

  const getCategoryActiveCount = (categoryKey: string) => {
    const category = treatmentCategories[categoryKey as keyof typeof treatmentCategories];
    return category.treatments.filter(treatment => selectedTreatments.includes(treatment)).length;
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-blue-dark mb-3 flex items-center">
        <Shield className="h-4 w-4 mr-2" />
        Treatment Services
      </h4>
      
      <SelectedTreatmentBadges
        selectedTreatments={selectedTreatments}
        onRemoveTreatment={removeTreatment}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.entries(treatmentCategories).map(([categoryKey, category]) => {
          const activeCount = getCategoryActiveCount(categoryKey);
          return (
            <TreatmentCategoryDropdown
              key={categoryKey}
              categoryKey={categoryKey}
              category={category}
              selectedTreatments={selectedTreatments}
              onToggleTreatment={toggleTreatment}
              activeCount={activeCount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TreatmentFilters;

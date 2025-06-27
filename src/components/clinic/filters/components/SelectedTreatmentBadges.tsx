
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { specialServicesLabels } from '../../utils/clinicConstants';

interface SelectedTreatmentBadgesProps {
  selectedTreatments: string[];
  onRemoveTreatment: (treatment: string) => void;
}

const SelectedTreatmentBadges = ({ selectedTreatments, onRemoveTreatment }: SelectedTreatmentBadgesProps) => {
  if (selectedTreatments.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-1">
      {selectedTreatments.map(treatment => (
        <Badge 
          key={treatment} 
          variant="secondary" 
          className="bg-blue-primary/10 text-blue-primary hover:bg-blue-primary/20 cursor-pointer"
          onClick={() => onRemoveTreatment(treatment)}
        >
          {specialServicesLabels[treatment as keyof typeof specialServicesLabels]}
          <X className="h-3 w-3 ml-1" />
        </Badge>
      ))}
    </div>
  );
};

export default SelectedTreatmentBadges;

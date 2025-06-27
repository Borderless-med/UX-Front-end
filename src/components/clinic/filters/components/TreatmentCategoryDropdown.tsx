
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { specialServicesLabels } from '../../utils/clinicConstants';

interface TreatmentCategoryDropdownProps {
  categoryKey: string;
  category: {
    label: string;
    treatments: string[];
  };
  selectedTreatments: string[];
  onToggleTreatment: (treatment: string) => void;
  activeCount: number;
}

const TreatmentCategoryDropdown = ({
  categoryKey,
  category,
  selectedTreatments,
  onToggleTreatment,
  activeCount
}: TreatmentCategoryDropdownProps) => {
  return (
    <DropdownMenu key={categoryKey}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between text-xs px-2 py-2 h-auto min-h-[2.5rem] relative"
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{category.label}</span>
            {activeCount > 0 && (
              <span className="text-xs text-blue-primary">
                {activeCount} selected
              </span>
            )}
          </div>
          <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 max-h-64 overflow-y-auto bg-white border shadow-lg z-50"
        align="start"
      >
        {category.treatments.map(treatment => (
          <DropdownMenuItem
            key={treatment}
            className="flex items-center space-x-2 cursor-pointer p-2"
            onSelect={(e) => {
              e.preventDefault();
              onToggleTreatment(treatment);
            }}
          >
            <input
              type="checkbox"
              checked={selectedTreatments.includes(treatment)}
              onChange={() => onToggleTreatment(treatment)}
              className="rounded border-gray-300 text-blue-primary focus:ring-blue-primary"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-sm text-neutral-gray">
              {specialServicesLabels[treatment as keyof typeof specialServicesLabels]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TreatmentCategoryDropdown;

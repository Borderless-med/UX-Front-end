
import { Badge } from '@/components/ui/badge';

interface ClinicCardServicesProps {
  availableCategories: string[];
}

const ClinicCardServices = ({ availableCategories }: ClinicCardServicesProps) => {
  return (
    <div className="h-[90px] flex flex-col justify-start overflow-hidden">
      {availableCategories.length > 0 ? (
        <>
          <p className="text-sm font-medium text-blue-dark mb-2">Available Services:</p>
          <div className="flex flex-wrap gap-1">
            {availableCategories.slice(0, 4).map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="text-xs bg-blue-primary/10 text-blue-primary"
              >
                {category}
              </Badge>
            ))}
            {availableCategories.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{availableCategories.length - 4} more
              </Badge>
            )}
          </div>
        </>
      ) : (
        <div className="text-sm text-neutral-gray">
          No specific services listed
        </div>
      )}
    </div>
  );
};

export default ClinicCardServices;

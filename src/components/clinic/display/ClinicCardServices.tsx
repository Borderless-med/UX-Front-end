
import { Badge } from '@/components/ui/badge';

interface ClinicCardServicesProps {
  availableCategories: string[];
}

const ClinicCardServices = ({ availableCategories }: ClinicCardServicesProps) => {
  return (
    <div className="h-[90px] flex flex-col justify-start overflow-hidden">
      {availableCategories.length > 0 ? (
        <>
          <p className="text-xs sm:text-sm font-medium text-blue-dark mb-2">Available Services:</p>
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {availableCategories.slice(0, 4).map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="text-xs bg-blue-primary/10 text-blue-primary truncate max-w-[5rem] sm:max-w-none"
                title={category}
              >
                {category}
              </Badge>
            ))}
            {availableCategories.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 flex-shrink-0">
                +{availableCategories.length - 4}
              </Badge>
            )}
          </div>
        </>
      ) : (
        <div className="text-xs sm:text-sm text-neutral-gray">
          No specific services listed
        </div>
      )}
    </div>
  );
};

export default ClinicCardServices;

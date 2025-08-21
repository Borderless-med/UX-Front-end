import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface MobileSidebarToggleProps {
  onClick: () => void;
  activeFiltersCount: number;
}

const MobileSidebarToggle = ({ onClick, activeFiltersCount }: MobileSidebarToggleProps) => {
  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-30">
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-primary shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <div className="relative">
          <Filter className="h-6 w-6" />
          {activeFiltersCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
            </div>
          )}
        </div>
      </Button>
    </div>
  );
};

export default MobileSidebarToggle;
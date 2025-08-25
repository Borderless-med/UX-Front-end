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
        className="rounded-full h-16 w-16 bg-primary shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-background"
      >
        <div className="relative flex flex-col items-center">
          <Filter className="h-6 w-6" />
          {activeFiltersCount > 0 && (
            <>
              <div className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold border-2 border-background">
                {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
              </div>
              <span className="text-[10px] font-medium mt-0.5 leading-none">
                {activeFiltersCount} active
              </span>
            </>
          )}
          {activeFiltersCount === 0 && (
            <span className="text-[10px] font-medium mt-0.5 leading-none">
              Filter
            </span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default MobileSidebarToggle;
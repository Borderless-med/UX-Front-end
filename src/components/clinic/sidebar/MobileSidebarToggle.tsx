import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface MobileSidebarToggleProps {
  onClick: () => void;
  activeFiltersCount: number;
}

const MobileSidebarToggle = ({ onClick, activeFiltersCount }: MobileSidebarToggleProps) => {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <Button
        onClick={onClick}
        size="lg"
        className={`rounded-full h-20 w-20 bg-primary shadow-2xl hover:shadow-3xl transition-all duration-300 border-3 border-background ${
          activeFiltersCount === 0 ? 'animate-gentle-pulse motion-reduce:animate-none' : ''
        }`}
      >
        <div className="relative flex flex-col items-center">
          <Filter className="h-8 w-8 mb-1" />
          {activeFiltersCount > 0 && (
            <>
              <div className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground text-sm rounded-full h-8 w-8 flex items-center justify-center font-bold border-3 border-background shadow-lg">
                {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
              </div>
              <span className="text-[11px] font-bold leading-none">
                {activeFiltersCount} Active
              </span>
            </>
          )}
          {activeFiltersCount === 0 && (
            <span className="text-[11px] font-bold leading-none">
              Filter
            </span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default MobileSidebarToggle;
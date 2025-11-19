import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface MobileSidebarToggleProps {
  onClick: () => void;
  activeFiltersCount: number;
}

const MobileSidebarToggle = ({ onClick, activeFiltersCount }: MobileSidebarToggleProps) => {
  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        size="lg"
        className={`rounded-full h-14 w-14 md:h-16 md:w-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 shadow-[0_4px_16px_0_rgba(30,64,175,0.25),0_1.5px_0_rgba(255,255,255,0.5)_inset] border-4 border-white hover:scale-110 transition-all duration-300 ${
          activeFiltersCount === 0 ? 'animate-gentle-pulse motion-reduce:animate-none' : ''
        }`}
        aria-label="Open filters"
      >
        <div className="relative flex flex-col items-center">
          <Filter className="h-6 w-6 md:h-7 md:w-7 mb-0.5 drop-shadow-[0_2px_2px_rgba(30,64,175,0.25)]" />
          {activeFiltersCount > 0 && (
            <>
              <div className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground text-[11px] rounded-full h-6 w-6 flex items-center justify-center font-bold border-2 border-background shadow-lg">
                {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
              </div>
              <span className="text-[10px] font-bold leading-none">Active</span>
            </>
          )}
          {activeFiltersCount === 0 && (
            <span className="text-[10px] font-bold leading-none">Filter</span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default MobileSidebarToggle;
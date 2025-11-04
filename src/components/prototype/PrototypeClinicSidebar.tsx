import { Button } from '@/components/ui/button';
import { X, Filter, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarResize } from '@/hooks/useSidebarResize';
import ClinicSearchBar from '@/components/clinic/search/ClinicSearchBar';
import ClinicMainFilters from '@/components/clinic/filters/ClinicMainFilters';
import ClinicAdvancedFilters from '@/components/clinic/filters/ClinicAdvancedFilters';
import ResultsCount from '@/components/clinic/search/ResultsCount';
import SidebarPresets from '@/components/clinic/sidebar/SidebarPresets';
import ResizeHandle from '@/components/clinic/sidebar/ResizeHandle';

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  selectedTreatments: string[];
  onTreatmentChange: (v: string[]) => void;
  selectedTownships: string[];
  onTownshipChange: (v: string[]) => void;
  townships: string[];
  ratingFilter: number;
  onRatingChange: (v: number) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
  mdaLicenseFilter: string;
  onMdaLicenseFilterChange: (v: string) => void;
  maxDistance: number;
  onMaxDistanceChange: (v: number) => void;
  minReviews: number;
  onMinReviewsChange: (v: number) => void;
  selectedCredentials: string[];
  onCredentialsChange: (v: string[]) => void;
  activeFiltersCount: number;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
  // selection indicator
  selectionLabel: string;
  isOpen?: boolean;
  onClose?: () => void;
  sidebarWidth?: number;
  onSidebarResize?: (w: number) => void;
}

// Prototype-only clone of ClinicSidebar with an added "Showing" indicator under the header
const PrototypeClinicSidebar = ({
  searchTerm,
  onSearchChange,
  selectedTreatments,
  onTreatmentChange,
  selectedTownships,
  onTownshipChange,
  townships,
  ratingFilter,
  onRatingChange,
  sortBy,
  onSortChange,
  mdaLicenseFilter,
  onMdaLicenseFilterChange,
  maxDistance,
  onMaxDistanceChange,
  minReviews,
  onMinReviewsChange,
  selectedCredentials,
  onCredentialsChange,
  activeFiltersCount,
  onClearAll,
  filteredCount,
  totalCount,
  selectionLabel,
  isOpen = true,
  onClose,
  sidebarWidth: externalSidebarWidth,
  onSidebarResize: externalOnSidebarResize
}: Props) => {
  const isMobile = useIsMobile();
  const {
    sidebarWidth: internalSidebarWidth,
    setSidebarWidth: internalSetSidebarWidth,
    presetSizes,
    setPresetSize,
    isResizing,
    setIsResizing
  } = useSidebarResize();

  const sidebarWidth = externalSidebarWidth ?? internalSidebarWidth;
  const setSidebarWidth = externalOnSidebarResize ?? internalSetSidebarWidth;

  const content = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-sidebar-primary" />
          <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
        </div>
        {/* Showing pill under the title */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-slate-200 px-3 py-1 text-xs">
          <MapPin className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-slate-600">Showing:</span>
          <span className="font-semibold text-slate-900">{selectionLabel}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{filteredCount} of {totalCount}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <ClinicSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />

          <div className="bg-sidebar-accent rounded-lg p-3">
            <ResultsCount
              filteredCount={filteredCount}
              totalCount={totalCount}
              activeFiltersCount={activeFiltersCount}
              selectedTreatments={selectedTreatments}
              selectedTownships={selectedTownships}
              ratingFilter={ratingFilter}
              mdaLicenseFilter={mdaLicenseFilter}
            />
          </div>

          <ClinicMainFilters
            selectedTreatments={selectedTreatments}
            onTreatmentChange={onTreatmentChange}
            ratingFilter={ratingFilter}
            onRatingChange={onRatingChange}
            selectedTownships={selectedTownships}
            onTownshipChange={onTownshipChange}
            townships={townships}
            sortBy={sortBy}
            onSortChange={onSortChange}
            mdaLicenseFilter={mdaLicenseFilter}
            onMdaLicenseFilterChange={onMdaLicenseFilterChange}
          />

          <ClinicAdvancedFilters
            maxDistance={maxDistance}
            onMaxDistanceChange={onMaxDistanceChange}
            minReviews={minReviews}
            onMinReviewsChange={onMinReviewsChange}
            selectedCredentials={selectedCredentials}
            onCredentialsChange={onCredentialsChange}
          />
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {activeFiltersCount > 0 && (
          <Button
            onClick={onClearAll}
            variant="outline"
            className="w-full border-sidebar-primary text-sidebar-primary hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
        <div
          className={`fixed inset-y-0 left-0 bg-card backdrop-blur-md border-r border-border shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: `min(90vw, ${Math.max(320, Math.min(600, sidebarWidth))}px)` }}
        >
          {content}
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:flex bg-sidebar-background border-r border-sidebar-border">
      <div
        className="sticky top-0 h-screen flex-shrink-0 transition-all duration-200"
        style={{
          width: `clamp(17.5rem, ${sidebarWidth}px, min(37.5rem, 30vw))`,
          minWidth: '17.5rem',
          maxWidth: 'min(37.5rem, 30vw)'
        }}
      >
        {content}
      </div>
      <ResizeHandle
        currentWidth={sidebarWidth}
        onResize={setSidebarWidth}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
    </div>
  );
};

export default PrototypeClinicSidebar;

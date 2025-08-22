import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarResize } from '@/hooks/useSidebarResize';
import ClinicSearchBar from '../search/ClinicSearchBar';
import UserStatusDisplay from '../display/UserStatusDisplay';
import ClinicMainFilters from '../filters/ClinicMainFilters';
import ClinicAdvancedFilters from '../filters/ClinicAdvancedFilters';
import ResultsCount from '../search/ResultsCount';
import SidebarPresets from './SidebarPresets';
import ResizeHandle from './ResizeHandle';

interface ClinicSidebarProps {
  // Search & filters state
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTreatments: string[];
  onTreatmentChange: (treatments: string[]) => void;
  selectedTownships: string[];
  onTownshipChange: (townships: string[]) => void;
  townships: string[];
  ratingFilter: number;
  onRatingChange: (rating: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  mdaLicenseFilter: string;
  onMdaLicenseFilterChange: (filter: string) => void;
  maxDistance: number;
  onMaxDistanceChange: (distance: number) => void;
  minReviews: number;
  onMinReviewsChange: (reviews: number) => void;
  selectedCredentials: string[];
  onCredentialsChange: (credentials: string[]) => void;
  
  // UI state
  activeFiltersCount: number;
  onClearAll: () => void;
  
  // Auth state
  isAuthenticated: boolean;
  userProfile: any;
  onSignInClick: () => void;
  
  // Results
  filteredCount: number;
  totalCount: number;
  
  // Mobile specific
  isOpen?: boolean;
  onClose?: () => void;
  
  // Resize functionality
  sidebarWidth?: number;
  onSidebarResize?: (width: number) => void;
}

const ClinicSidebar = ({
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
  isAuthenticated,
  userProfile,
  onSignInClick,
  filteredCount,
  totalCount,
  isOpen = true,
  onClose,
  sidebarWidth: externalSidebarWidth,
  onSidebarResize: externalOnSidebarResize
}: ClinicSidebarProps) => {
  const isMobile = useIsMobile();
  const {
    sidebarWidth: internalSidebarWidth,
    setSidebarWidth: internalSetSidebarWidth,
    presetSizes,
    setPresetSize,
    isResizing,
    setIsResizing
  } = useSidebarResize();

  // Use external width/resize if provided, otherwise use internal
  const sidebarWidth = externalSidebarWidth ?? internalSidebarWidth;
  const setSidebarWidth = externalOnSidebarResize ?? internalSetSidebarWidth;

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-sidebar-primary" />
          <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
        </div>
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-sidebar-foreground hover:text-sidebar-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <ClinicSearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </div>

          {/* User Status */}
          <Card className="p-3">
            <UserStatusDisplay
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              onSignInClick={onSignInClick}
            />
          </Card>

          {/* Results Count */}
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

          {/* Main Filters */}
          <div>
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
          </div>

          {/* Advanced Filters */}
          <div>
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
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* Sidebar Width Controls - Desktop Only */}
        {!isMobile && (
          <SidebarPresets
            currentWidth={sidebarWidth}
            presetSizes={presetSizes}
            onPresetSelect={setPresetSize}
          />
        )}
        
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
        {/* Mobile overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
        )}
        
        {/* Mobile sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 bg-sidebar-background z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: `min(90vw, ${Math.max(320, Math.min(600, sidebarWidth))}px)` }}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar - always visible and sticky
  return (
    <div className="hidden lg:flex bg-sidebar-background border-r border-sidebar-border">
      <div 
        className="sticky top-0 h-screen flex-shrink-0 transition-all duration-200"
        style={{ width: `${sidebarWidth}px` }}
      >
        {sidebarContent}
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

export default ClinicSidebar;
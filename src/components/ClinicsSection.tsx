
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import AuthModal from '@/components/auth/AuthModal';
import DisclaimerSection from '@/components/clinic/display/DisclaimerSection';
import { useClinicFilters } from './clinic/hooks/useClinicFilters';
import { useClinicSearch } from './clinic/hooks/useClinicSearch';
import { getUniqueTownships } from './clinic/utils/clinicFilterUtils';
import { useSupabaseClinics } from '@/hooks/useSupabaseClinics';
import ClinicGrid from './clinic/display/ClinicGrid';
import ClinicSidebar from './clinic/sidebar/ClinicSidebar';
import MobileSidebarToggle from './clinic/sidebar/MobileSidebarToggle';

const ClinicsSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, logDataAccess } = useAuth();
  const { clinics, loading, error } = useSupabaseClinics();
  const isMobile = useIsMobile();

  // Debug: Log the clinic data source
  console.log('ClinicsSection - Clinic data from database:', clinics.length, 'clinics loaded');
  if (clinics.length > 0) {
    console.log('Sample clinic data:', clinics[0]);
  }

  const {
    searchTerm,
    setSearchTerm,
    selectedTreatments,
    setSelectedTreatments,
    selectedTownships,
    setSelectedTownships,
    ratingFilter,
    setRatingFilter,
    maxDistance,
    setMaxDistance,
    minReviews,
    setMinReviews,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    mdaLicenseFilter,
    setMdaLicenseFilter,
    selectedCredentials,
    setSelectedCredentials,
    clearAllFilters,
    activeFiltersCount
  } = useClinicFilters();

  const { filteredAndSortedClinics } = useClinicSearch({
    clinics,
    searchTerm,
    selectedTreatments,
    selectedTownships,
    ratingFilter,
    maxDistance,
    minReviews,
    sortBy,
    mdaLicenseFilter,
    selectedCredentials
  });

  const townships = getUniqueTownships(clinics);

  const handleOptOutClick = () => {
    navigate('/opt-out-report');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleViewPractitionerDetails = async (clinic: any) => {
    if (isAuthenticated) {
      await logDataAccess('practitioner_details', clinic.id.toString(), clinic.dentist);
    }
  };

  if (loading) {
    return (
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-primary" />
            <span className="ml-2 text-lg text-neutral-gray">Loading clinics from database...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Error loading clinics from database: {error}</p>
            <p className="text-neutral-gray text-sm mt-2">Please try refreshing the page.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with disclaimers - only on desktop */}
      <div className="hidden lg:block py-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-dark mb-2">
              Find Your Perfect Clinic
            </h1>
            <p className="text-base text-neutral-gray mb-4 max-w-2xl mx-auto">
              Search and filter through {clinics.length} verified dental clinics to find your match
            </p>
          </div>

          {/* Compact Medical Disclaimer */}
          <div className="mb-2">
            <MedicalDisclaimer variant="compact" />
          </div>

          {/* Collapsible Legal Disclaimer */}
          <div className="mb-2">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-900">Legal Disclaimers & Data Sources</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-blue-700" />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <DisclaimerSection onOptOutClick={handleOptOutClick} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden py-4 px-4 bg-white border-b border-border">
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-dark mb-1">
            Find Your Perfect Clinic
          </h1>
          <p className="text-sm text-neutral-gray">
            {clinics.length} verified dental clinics
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-screen-2xl mx-auto flex w-full min-h-0">
        {/* Sidebar */}
        <ClinicSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedTreatments={selectedTreatments}
          onTreatmentChange={setSelectedTreatments}
          selectedTownships={selectedTownships}
          onTownshipChange={setSelectedTownships}
          townships={townships}
          ratingFilter={ratingFilter}
          onRatingChange={setRatingFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          mdaLicenseFilter={mdaLicenseFilter}
          onMdaLicenseFilterChange={setMdaLicenseFilter}
          maxDistance={maxDistance}
          onMaxDistanceChange={setMaxDistance}
          minReviews={minReviews}
          onMinReviewsChange={setMinReviews}
          selectedCredentials={selectedCredentials}
          onCredentialsChange={setSelectedCredentials}
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          onSignInClick={handleSignInClick}
          filteredCount={filteredAndSortedClinics.length}
          totalCount={clinics.length}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
            <ClinicGrid
              clinics={filteredAndSortedClinics}
              isAuthenticated={isAuthenticated}
              onSignInClick={handleSignInClick}
              onViewPractitionerDetails={handleViewPractitionerDetails}
              onClearAllFilters={clearAllFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <MobileSidebarToggle
        onClick={() => setIsMobileSidebarOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultTab="login"
      />
    </div>
  );
};

export default ClinicsSection;

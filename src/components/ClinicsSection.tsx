
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import DisclaimerSection from '@/components/clinic/display/DisclaimerSection';
import { useClinicFilters } from './clinic/hooks/useClinicFilters';
import { useClinicSearch } from './clinic/hooks/useClinicSearch';
import { getUniqueTownships } from './clinic/utils/clinicFilterUtils';
import { useSupabaseClinics } from '@/hooks/useSupabaseClinics';
import ClinicSearchBar from './clinic/search/ClinicSearchBar';
import ResultsCount from './clinic/search/ResultsCount';
import UserStatusDisplay from './clinic/display/UserStatusDisplay';
import ClinicMainFilters from './clinic/filters/ClinicMainFilters';
import ClinicAdvancedFilters from './clinic/filters/ClinicAdvancedFilters';
import FilterControls from './clinic/filters/FilterControls';
import ClinicGrid from './clinic/display/ClinicGrid';

const ClinicsSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, logDataAccess } = useAuth();
  const { clinics, loading, error } = useSupabaseClinics();

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
    mdaLicenseFilter
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
    <section className="py-4 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-dark mb-2">
            Find Your Perfect Clinic
          </h1>
          <p className="text-base text-neutral-gray mb-4 max-w-2xl mx-auto">
            Search and filter through {clinics.length} verified dental clinics to find your match
          </p>
        </div>

        {/* Compact Combined Disclaimers */}
        <div className="mb-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-900 leading-relaxed">
                <strong className="font-semibold">Important:</strong> This platform provides general information only and does not constitute dental advice. 
                <button 
                  onClick={handleOptOutClick}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Opt-out or Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Clinics Section */}
        <div className="mb-6">
          <Card className="p-4 border-blue-light bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-dark">Search & Filter Clinics</h2>
              <UserStatusDisplay
                isAuthenticated={isAuthenticated}
                userProfile={userProfile}
                onSignInClick={handleSignInClick}
              />
            </div>
            
            <ClinicSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <ClinicMainFilters
              selectedTreatments={selectedTreatments}
              onTreatmentChange={setSelectedTreatments}
              ratingFilter={ratingFilter}
              onRatingChange={setRatingFilter}
              selectedTownships={selectedTownships}
              onTownshipChange={setSelectedTownships}
              townships={townships}
              sortBy={sortBy}
              onSortChange={setSortBy}
              mdaLicenseFilter={mdaLicenseFilter}
              onMdaLicenseFilterChange={setMdaLicenseFilter}
            />

            <FilterControls
              showAdvancedFilters={showAdvancedFilters}
              onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
              activeFiltersCount={activeFiltersCount}
              onClearAll={clearAllFilters}
            />

            {showAdvancedFilters && (
              <ClinicAdvancedFilters
                maxDistance={maxDistance}
                onMaxDistanceChange={setMaxDistance}
                minReviews={minReviews}
                onMinReviewsChange={setMinReviews}
              />
            )}
          </Card>
        </div>

        <ResultsCount
          filteredCount={filteredAndSortedClinics.length}
          totalCount={clinics.length}
          activeFiltersCount={activeFiltersCount}
          selectedTreatments={selectedTreatments}
          selectedTownships={selectedTownships}
          ratingFilter={ratingFilter}
          mdaLicenseFilter={mdaLicenseFilter}
        />

        <ClinicGrid
          clinics={filteredAndSortedClinics}
          isAuthenticated={isAuthenticated}
          onSignInClick={handleSignInClick}
          onViewPractitionerDetails={handleViewPractitionerDetails}
          onClearAllFilters={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          defaultTab="login"
        />
      </div>
    </section>
  );
};

export default ClinicsSection;

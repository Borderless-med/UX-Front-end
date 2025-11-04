import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import ChatWidget from '@/components/ChatWidget';
import PrototypeClinicSidebar from '@/components/prototype/PrototypeClinicSidebar';
import ClinicGrid from '@/components/clinic/display/ClinicGrid';
import MobileSidebarToggle from '@/components/clinic/sidebar/MobileSidebarToggle';
import { useSupabaseClinics } from '@/hooks/useSupabaseClinics';
import { useClinicFilters } from '@/components/clinic/hooks/useClinicFilters';
import { useClinicSearch } from '@/components/clinic/hooks/useClinicSearch';
import { getUniqueTownships } from '@/components/clinic/utils/clinicFilterUtils';
import { Loader2, MapPin } from 'lucide-react';

type Selection = 'all' | 'sg' | 'jb';

const FindClinicsPrototype1 = () => {
  const [selection, setSelection] = useState<Selection>('all');
  const [showGreeting, setShowGreeting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Data and filters (reuse production hooks for full functionality)
  const { clinics, loading, error } = useSupabaseClinics();
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
    mdaLicenseFilter,
    setMdaLicenseFilter,
    selectedCredentials,
    setSelectedCredentials,
    clearAllFilters,
    activeFiltersCount,
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
    selectedCredentials,
  });

  const townships = useMemo(() => getUniqueTownships(clinics), [clinics]);

  // Selection helpers
  const selectionLabel = selection === 'all' ? 'All Clinics' : selection === 'sg' ? 'Singapore Clinics' : 'Johor Bahru Clinics';
  const isSGTownship = (t: string) => /singapore|sg/i.test(t);
  const selectionFilteredClinics = useMemo(() => {
    if (selection === 'all') return filteredAndSortedClinics;
    return filteredAndSortedClinics.filter((c) => {
      if (c.country) {
        return selection === 'sg' ? c.country === 'SG' : c.country !== 'SG';
      }
      // Fallback to township heuristic if no country
      return selection === 'sg' ? isSGTownship(c.township) : !isSGTownship(c.township);
    });
  }, [filteredAndSortedClinics, selection]);

  // Proactive greeting timing: appear after 2s, auto-hide after 6s
  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 2000);
    const t2 = setTimeout(() => setShowGreeting(false), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Initialize selection from query param `sel` if present (jb | sg | all)
  useEffect(() => {
    const sel = (searchParams.get('sel') || '').toLowerCase();
    if (sel === 'jb' || sel === 'sg' || sel === 'all') {
      setSelection(sel as Selection);
    }
  }, [searchParams]);

  // Choice Card component
  const Card = ({
    title,
    subtitle,
    icon,
    active,
    onClick,
    accent,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    active?: boolean;
    onClick?: () => void;
    accent: 'blue' | 'emerald' | 'slate';
  }) => {
    const baseRing = 'transition transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
    const inactiveStyles = 'bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md';
    const activeStyles =
      accent === 'emerald'
        ? 'bg-emerald-50 ring-2 ring-emerald-500 shadow-lg'
        : accent === 'blue'
          ? 'bg-blue-50 ring-2 ring-blue-600 shadow-lg'
          : 'bg-slate-50 ring-2 ring-slate-500 shadow-lg';
    const cardStyles = active ? activeStyles : inactiveStyles;

    const iconColor = accent === 'emerald' ? 'text-emerald-600' : accent === 'blue' ? 'text-blue-600' : 'text-slate-600';

    return (
      <button type="button" onClick={onClick} className={`group relative w-full rounded-2xl ${cardStyles} ${baseRing}`}>
        <div className="p-6 text-center">
          <div className={`text-3xl ${iconColor}`}>{icon}</div>
          <h4 className="mt-3 text-lg font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen font-inter bg-slate-50 text-blue-dark">
      <Navigation />

      {/* Selection Zone */}
      <section className="pt-28 pb-10 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-3xl bg-sky-50 p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700 tracking-tight">Find Clinics</h1>
              <p className="mt-2 text-base text-slate-700">Search and filter through our verified dental clinics to find your match.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <Card title="Johor Bahru" subtitle="Focus on Savings" icon="💰" accent="emerald" active={selection === 'jb'} onClick={() => setSelection('jb')} />
              <Card title="Singapore" subtitle="Focus on Convenience" icon="🏠" accent="blue" active={selection === 'sg'} onClick={() => setSelection('sg')} />
              <Card title="View All" subtitle="Explore Both Locations" icon="🌏" accent="slate" active={selection === 'all'} onClick={() => setSelection('all')} />
            </div>

            {/* Showing pill removed from hero; now placed as header in Results section */}
          </div>
        </div>
      </section>

      {/* Results Zone */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <MobileSidebarToggle onClick={() => setMobileOpen(true)} activeFiltersCount={activeFiltersCount} />
          </div>

          <div className="w-full min-h-0 flex gap-6">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block flex-shrink-0">
              <PrototypeClinicSidebar
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
                filteredCount={selectionFilteredClinics.length}
                totalCount={clinics.length}
                selectionLabel={selectionLabel}
                isOpen={false}
              />
            </aside>

            {/* Results */}
            <main className="flex-1 min-w-0">
              {/* Loading and error states */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-slate-600">Loading clinics…</span>
                </div>
              )}
              {!loading && error && <div className="bg-red-50 text-red-900 rounded-xl ring-1 ring-red-200 p-4 mb-5">{String(error)}</div>}
              {!loading && !error && (
                <>
                  {/* Showing header acting as section header for results */}
                  {(() => {
                    const variant =
                      selection === 'jb'
                        ? { bg: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-900', icon: 'text-emerald-600' }
                        : selection === 'sg'
                          ? { bg: 'bg-blue-50', ring: 'ring-blue-200', text: 'text-blue-900', icon: 'text-blue-600' }
                          : { bg: 'bg-white', ring: 'ring-slate-200', text: 'text-slate-900', icon: 'text-slate-600' };
                    return (
                      <div className={`mb-5 rounded-xl ring-2 ${variant.ring} ${variant.bg} px-5 py-4`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <MapPin className={`h-6 w-6 ${variant.icon}`} />
                            <span className={`font-bold text-2xl ${variant.text}`}>Showing: {selectionLabel}</span>
                            <span className="text-lg md:text-xl font-bold text-slate-600">({selectionFilteredClinics.length} found)</span>
                          </div>
                          <div className="text-right font-bold italic text-slate-700">Full Access Enabled (Logged In)</div>
                        </div>
                      </div>
                    );
                  })()}
                  <ClinicGrid
                    clinics={selectionFilteredClinics}
                    isAuthenticated={false}
                    onSignInClick={() => {}}
                    onViewPractitionerDetails={() => {}}
                    onClearAllFilters={clearAllFilters}
                    activeFiltersCount={activeFiltersCount}
                  />
                </>
              )}
            </main>
          </div>

          {/* Mobile sidebar overlay instance */}
          <PrototypeClinicSidebar
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
            filteredCount={selectionFilteredClinics.length}
            totalCount={clinics.length}
            selectionLabel={selectionLabel}
            isOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
        </div>
      </section>

      <MedicalDisclaimer />
      <Footer />

      {/* Floating chat widget with proactive greeting */}
      {showGreeting && (
        <div className="fixed bottom-24 left-6 z-40 bg-blue-600 text-white rounded-full shadow-lg px-4 py-2 cursor-pointer" onClick={() => setShowGreeting(false)}>
          <span className="mr-2">🤖</span>
          <span className="font-medium">Hello! Need help? Just ask the chatbot anything.</span>
        </div>
      )}
      <ChatWidget />
      {/* Helper textbox to the right of the ChatWidget button */}
      <div className="fixed bottom-6 left-24 z-50 hidden sm:flex items-center">
        <div className="rounded-xl bg-white shadow-lg ring-1 ring-slate-200 px-4 py-2 text-slate-800 text-sm">
          Hi there! Need any help ? Just ask me
        </div>
      </div>
    </div>
  );
};

export default FindClinicsPrototype1;

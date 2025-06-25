import { useState } from 'react';
import { Search, MapPin, Phone, Clock, Star, Filter, X, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { clinics } from '@/data/clinics';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

const ClinicsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedTownships, setSelectedTownships] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [distanceRange, setDistanceRange] = useState<number[]>([0, 110]);
  const [maxDistance, setMaxDistance] = useState<number>(110);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, logDataAccess } = useAuth();

  // Get unique townships
  const townships = [...new Set(clinics.map(clinic => clinic.township))].sort();

  // Treatment options with labels
  const treatmentOptions = [
    { key: 'dentalImplant', label: 'Dental Implants' },
    { key: 'braces', label: 'Braces/Orthodontics' },
    { key: 'rootCanal', label: 'Root Canal' },
    { key: 'teethWhitening', label: 'Teeth Whitening' },
    { key: 'gumTreatment', label: 'Gum Treatment' },
    { key: 'wisdomTooth', label: 'Wisdom Tooth Extraction' },
    { key: 'dentalCrown', label: 'Dental Crown' },
    { key: 'toothFilling', label: 'Tooth Filling' },
    { key: 'compositeVeneers', label: 'Composite Veneers' },
    { key: 'porcelainVeneers', label: 'Porcelain Veneers' }
  ];

  // Credentials options
  const credentialOptions = [
    { key: 'mda', label: 'MDA Registered' },
    { key: 'specialist', label: 'Specialist Qualifications' },
    { key: 'experience', label: '5+ Years Experience' }
  ];

  // Filter and sort clinics
  const filteredClinics = clinics
    .filter(clinic => {
      // Text search
      const matchesSearch = 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.township.toLowerCase().includes(searchTerm.toLowerCase());

      // Treatment filter
      const matchesTreatments = selectedTreatments.length === 0 || 
        selectedTreatments.some(treatment => 
          clinic.treatments[treatment as keyof typeof clinic.treatments]
        );

      // Township filter
      const matchesTownship = selectedTownships.length === 0 || 
        selectedTownships.includes(clinic.township);

      // Rating filter
      const matchesRating = clinic.rating >= ratingFilter;

      // Distance filter
      const matchesDistance = clinic.distance <= maxDistance;

      // Reviews filter
      const matchesReviews = clinic.reviews >= minReviews;

      return matchesSearch && matchesTreatments && matchesTownship && matchesRating && matchesDistance && matchesReviews;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance - b.distance;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleOptOutClick = () => {
    navigate('/opt-out-report');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  // Enhanced practitioner details viewing with audit logging
  const handleViewPractitionerDetails = async (clinic: typeof clinics[0]) => {
    if (isAuthenticated) {
      await logDataAccess('practitioner_details', clinic.id.toString(), clinic.dentist);
    }
  };

  const handleTreatmentChange = (treatment: string, checked: boolean) => {
    if (checked) {
      setSelectedTreatments([...selectedTreatments, treatment]);
    } else {
      setSelectedTreatments(selectedTreatments.filter(t => t !== treatment));
    }
  };

  const handleTownshipChange = (township: string, checked: boolean) => {
    if (checked) {
      setSelectedTownships([...selectedTownships, township]);
    } else {
      setSelectedTownships(selectedTownships.filter(t => t !== township));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTreatments([]);
    setSelectedTownships([]);
    setRatingFilter(0);
    setDistanceRange([0, 110]);
    setMaxDistance(110);
    setMinReviews(0);
    setSortBy('distance');
  };

  const activeFiltersCount = selectedTreatments.length + selectedTownships.length + 
    (ratingFilter > 0 ? 1 : 0) + (maxDistance < 110 ? 1 : 0) + (minReviews > 0 ? 1 : 0);

  // Helper function to get basic specialties based on treatments
  const getSpecialties = (clinic: typeof clinics[0]) => {
    const specialties = [];
    if (clinic.treatments.dentalImplant) specialties.push('Dental Implants');
    if (clinic.treatments.braces) specialties.push('Orthodontics');
    if (clinic.treatments.rootCanal) specialties.push('Endodontics');
    if (clinic.treatments.teethWhitening) specialties.push('Cosmetic Dentistry');
    if (clinic.treatments.gumTreatment) specialties.push('Periodontics');
    return specialties.slice(0, 3); // Show max 3 specialties
  };

  // Get user status display
  const getUserStatusDisplay = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-sm text-blue-600">
          Sign in to view detailed clinic information{' '}
          <Button 
            onClick={handleSignInClick}
            variant="outline" 
            size="sm" 
            className="ml-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Sign In
          </Button>
        </div>
      );
    }

    const categoryLabels = {
      patient: 'Patient Account',
      healthcare_professional: 'Healthcare Professional',
      clinic_admin: 'Clinic Administrator',
      approved_partner: 'Approved Partner'
    };

    return (
      <div className="text-sm">
        <span className="text-green-600">✓ Signed in</span>
        {userProfile && (
          <span className="text-blue-600 ml-2">
            ({categoryLabels[userProfile.user_category]} - Full details available)
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Find Your Perfect Clinic
          </h1>
          <p className="text-lg text-neutral-gray mb-8 max-w-3xl mx-auto">
            Search and filter through 101 verified dental clinics across Johor to find the best match for your needs
          </p>
        </div>

        {/* First Disclaimer */}
        <div className="mb-6">
          <div className="bg-blue-50/30 border-l-4 border-blue-200/40 rounded-r-lg px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="text-sm text-blue-800/90 leading-relaxed">
                <strong>Important:</strong> This platform provides general information only and does not constitute dental advice. 
                No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
              </div>
            </div>
          </div>
        </div>

        {/* Second Disclaimer with Opt-out Button */}
        <div className="mb-8">
          <div className="bg-gray-50/50 border border-gray-200/40 rounded-lg px-5 py-4">
            <div className="flex justify-between items-start">
              <div className="text-sm text-blue-800/90 leading-relaxed flex-1 mr-4">
                <strong>Directory Disclaimer:</strong> Information compiled from publicly available sources. 
                Listing does not imply endorsement, professional relationship, or recommendation. 
                This platform does not provide medical advice or establish practitioner-patient relationships.
              </div>
              <Button
                onClick={handleOptOutClick}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-shrink-0"
              >
                Opt-out or report issues
              </Button>
            </div>
          </div>
        </div>

        {/* Search & Filter Clinics Section */}
        <div className="mb-8">
          <Card className="p-6 border-blue-light bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-dark">Search & Filter Clinics</h2>
              {getUserStatusDisplay()}
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by clinic name, dentist, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-blue-light focus:border-blue-primary"
              />
            </div>

            {/* Main Filter Row - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Treatment Needed */}
              <div>
                <label className="block text-sm font-medium text-blue-dark mb-2">Treatment Needed</label>
                <Select 
                  value={selectedTreatments.length > 0 ? selectedTreatments[0] : "all"} 
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTreatments([]);
                    } else {
                      setSelectedTreatments([value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Treatments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Treatments</SelectItem>
                    {treatmentOptions.map((treatment) => (
                      <SelectItem key={treatment.key} value={treatment.key}>
                        {treatment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-blue-dark mb-2">Minimum Rating</label>
                <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.8">4.8+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Township */}
              <div>
                <label className="block text-sm font-medium text-blue-dark mb-2">Township</label>
                <Select 
                  value={selectedTownships.length > 0 ? selectedTownships[0] : "all"} 
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTownships([]);
                    } else {
                      setSelectedTownships([value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Townships" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Townships</SelectItem>
                    {townships.map((township) => (
                      <SelectItem key={township} value={township}>
                        {township}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-blue-dark mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance from CIQ</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex justify-center items-center gap-4">
              <Button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="text-blue-primary hover:text-blue-dark"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All ({activeFiltersCount})
                </Button>
              )}
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mt-6 border-t border-blue-light pt-6">
                <h3 className="text-lg font-medium text-blue-dark mb-4">Advanced Filters</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Max Distance from CIQ */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">
                      Max Distance from CIQ: {maxDistance}km
                    </h4>
                    <Slider
                      value={[maxDistance]}
                      onValueChange={(value) => setMaxDistance(value[0])}
                      max={110}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Minimum Reviews */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">
                      Minimum Reviews: {minReviews}
                    </h4>
                    <Slider
                      value={[minReviews]}
                      onValueChange={(value) => setMinReviews(value[0])}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Credentials */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">Credentials</h4>
                    <div className="space-y-2">
                      {credentialOptions.map((credential) => (
                        <div key={credential.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={credential.key}
                          />
                          <label 
                            htmlFor={credential.key} 
                            className="text-sm text-neutral-gray cursor-pointer"
                          >
                            {credential.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance Range */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">
                      Distance Range: {distanceRange[0]}-{distanceRange[1]}km
                    </h4>
                    <Slider
                      value={distanceRange}
                      onValueChange={setDistanceRange}
                      max={110}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-neutral-gray">
            Showing {filteredClinics.length} of {clinics.length} clinics
            {activeFiltersCount > 0 && ` with ${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredClinics.map((clinic) => {
            const specialties = getSpecialties(clinic);
            
            return (
              <Card key={clinic.id} className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-blue-dark">{clinic.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-neutral-gray ml-1">{clinic.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-blue-primary mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-gray">{clinic.address}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-primary mr-2" />
                      <p className="text-sm text-neutral-gray">Contact Available</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-primary mr-2" />
                      <p className="text-sm text-neutral-gray">Operating Hours Available</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-blue-dark mb-2">Key Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-light/20 text-blue-primary text-xs px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-neutral-gray">Distance</p>
                      <p className="text-sm font-medium text-success-green">{clinic.distance}km away</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray">Reviews</p>
                      <p className="text-sm font-medium text-blue-dark">{clinic.reviews} reviews</p>
                    </div>
                  </div>

                  {/* PDPA Compliant Practitioner Information */}
                  <div className="mt-4 pt-4 border-t border-blue-light/30">
                    {isAuthenticated ? (
                      <div onClick={() => handleViewPractitionerDetails(clinic)}>
                        <p className="text-xs text-neutral-gray mb-1">Dentist: {clinic.dentist}</p>
                        <p className="text-xs text-neutral-gray">MDA License: {clinic.mdaLicense}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-blue-600 mb-1">
                          Dentist Name Available - 
                          <button 
                            onClick={handleSignInClick}
                            className="ml-1 underline hover:text-blue-dark"
                          >
                            Sign in to view
                          </button>
                        </p>
                        <p className="text-xs text-blue-600">
                          MDA License Available - 
                          <button 
                            onClick={handleSignInClick}
                            className="ml-1 underline hover:text-blue-dark"
                          >
                            Sign in to view
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-gray text-lg">No clinics found matching your search criteria.</p>
            <p className="text-neutral-gray text-sm mt-2">Try adjusting your search terms or clearing some filters.</p>
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="mt-4 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Authentication Modal */}
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


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
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const ClinicsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedTownships, setSelectedTownships] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [distanceRange, setDistanceRange] = useState<number[]>([0, 50]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const navigate = useNavigate();

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
      const matchesDistance = clinic.distance >= distanceRange[0] && clinic.distance <= distanceRange[1];

      return matchesSearch && matchesTreatments && matchesTownship && matchesRating && matchesDistance;
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
    setDistanceRange([0, 50]);
    setSortBy('rating');
  };

  const activeFiltersCount = selectedTreatments.length + selectedTownships.length + 
    (ratingFilter > 0 ? 1 : 0) + (distanceRange[0] > 0 || distanceRange[1] < 50 ? 1 : 0);

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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Directory Listings
          </h1>
          <p className="text-lg text-neutral-gray mb-8 max-w-3xl mx-auto">
            Browse our comprehensive directory of dental clinics in Johor Bahru. 
            Find information about services, locations, and contact details to help you make informed decisions.
          </p>

          {/* Opt Out Button */}
          <div className="mb-8">
            <Button
              onClick={handleOptOutClick}
              variant="outline"
              className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white"
            >
              Opt Out or Report Issue
            </Button>
          </div>
        </div>

        {/* Search & Filter Clinics Section */}
        <div className="mb-8">
          <Card className="p-6 border-blue-light bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-blue-dark mb-6 text-center">Search & Filter Clinics</h2>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
              <Input
                type="text"
                placeholder="Search clinics or areas..."
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
                  value={selectedTreatments.length > 0 ? selectedTreatments[0] : "any"} 
                  onValueChange={(value) => {
                    if (value === "any") {
                      setSelectedTreatments([]);
                    } else {
                      setSelectedTreatments([value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Treatment</SelectItem>
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
                  value={selectedTownships.length > 0 ? selectedTownships[0] : "any"} 
                  onValueChange={(value) => {
                    if (value === "any") {
                      setSelectedTownships([]);
                    } else {
                      setSelectedTownships([value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Area</SelectItem>
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
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest First</SelectItem>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Multiple Treatment Selection */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">Multiple Treatments</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {treatmentOptions.map((treatment) => (
                        <div key={treatment.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`adv-${treatment.key}`}
                            checked={selectedTreatments.includes(treatment.key)}
                            onCheckedChange={(checked) => 
                              handleTreatmentChange(treatment.key, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`adv-${treatment.key}`} 
                            className="text-sm text-neutral-gray cursor-pointer"
                          >
                            {treatment.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multiple Township Selection */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">Multiple Areas</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {townships.map((township) => (
                        <div key={township} className="flex items-center space-x-2">
                          <Checkbox
                            id={`adv-${township}`}
                            checked={selectedTownships.includes(township)}
                            onCheckedChange={(checked) => 
                              handleTownshipChange(township, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`adv-${township}`} 
                            className="text-sm text-neutral-gray cursor-pointer"
                          >
                            {township}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance Filter */}
                  <div>
                    <h4 className="font-medium text-blue-dark mb-3">
                      Distance: {distanceRange[0]}-{distanceRange[1]}km
                    </h4>
                    <Slider
                      value={distanceRange}
                      onValueChange={setDistanceRange}
                      max={50}
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

        {/* Medical Disclaimer - Positioned prominently but elegantly */}
        <div className="mb-8">
          <MedicalDisclaimer variant="banner" className="max-w-5xl mx-auto" />
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

                  <div className="mt-4">
                    <p className="text-xs text-neutral-gray mb-1">Dentist: {clinic.dentist}</p>
                    <p className="text-xs text-neutral-gray">MDA License: {clinic.mdaLicense}</p>
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

        {/* Enhanced Directory Information Notice */}
        <div className="mt-16">
          <MedicalDisclaimer variant="subtle" className="max-w-5xl mx-auto" />
        </div>

        {/* Directory Disclaimer Section - Restored to original position and format */}
        <div className="mt-8 bg-gradient-to-r from-blue-50/60 to-blue-100/40 p-8 rounded-xl border border-blue-200/30 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-dark mb-4 text-center">Directory Information Notice</h3>
            <div className="space-y-4 text-sm text-blue-800/90 leading-relaxed">
              <p>
                <strong>Information Accuracy:</strong> The information provided in this directory is compiled from 
                publicly available sources for informational purposes only. We make no representation or warranty 
                regarding the accuracy, completeness, or currency of this information.
              </p>
              <p>
                <strong>User Responsibility:</strong> Users are advised to verify all details directly with clinics 
                before making any decisions. This includes confirming practitioner credentials, treatment costs, 
                operating hours, and clinic policies.
              </p>
              <p>
                <strong>No Endorsement:</strong> Listing of a dental clinic does not imply any business relationship, 
                partnership, or endorsement. We have not verified the credentials or services of these clinics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-200/40 text-center">
              <p className="text-xs text-blue-700/80">
                For corrections or removal requests, please use our{' '}
                <button 
                  onClick={handleOptOutClick}
                  className="text-blue-primary hover:text-blue-dark underline font-medium"
                >
                  opt-out form
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicsSection;

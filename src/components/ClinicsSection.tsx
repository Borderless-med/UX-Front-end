import { useState } from 'react';
import { Building2, Shield, Star, Clock, MapPin, MessageSquare, Calendar, Search, Lock, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import AuthStatus from '@/components/auth/AuthStatus';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { clinics } from '@/data/clinics';

const ClinicsSection = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [maxDistance, setMaxDistance] = useState(110);
  const [minReviews, setMinReviews] = useState(0);
  const [credentialFilter, setCredentialFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [townshipFilter, setTownshipFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // All available treatments organized by category
  const treatmentCategories = {
    'Basic Treatments': [
      { key: 'toothFilling', label: 'Tooth Filling' },
      { key: 'rootCanal', label: 'Root Canal' },
      { key: 'dentalCrown', label: 'Dental Crown' },
      { key: 'gumTreatment', label: 'Gum Treatment' },
      { key: 'wisdomTooth', label: 'Wisdom Tooth Removal' }
    ],
    'Cosmetic Procedures': [
      { key: 'teethWhitening', label: 'Teeth Whitening' },
      { key: 'compositeVeneers', label: 'Composite Veneers' },
      { key: 'porcelainVeneers', label: 'Porcelain Veneers' },
      { key: 'dentalBonding', label: 'Dental Bonding' },
      { key: 'enamelShaping', label: 'Enamel Shaping' }
    ],
    'Advanced Treatments': [
      { key: 'dentalImplant', label: 'Dental Implant' },
      { key: 'braces', label: 'Braces (Metal)' },
      { key: 'inlaysOnlays', label: 'Inlays/Onlays' },
      { key: 'boneGrafting', label: 'Bone Grafting' },
      { key: 'sinusLift', label: 'Sinus Lift' }
    ],
    'Surgical Procedures': [
      { key: 'gingivectomy', label: 'Gingivectomy' },
      { key: 'frenectomy', label: 'Frenectomy' },
      { key: 'crownLengthening', label: 'Crown Lengthening' },
      { key: 'alveoplasty', label: 'Alveoplasty' }
    ],
    'Specialized Care': [
      { key: 'tmjTreatment', label: 'TMJ Treatment' },
      { key: 'sleepApneaAppliances', label: 'Sleep Apnea Appliances' },
      { key: 'oralCancerScreening', label: 'Oral Cancer Screening' }
    ]
  };

  // Get unique townships for the filter
  const uniqueTownships = [...new Set(clinics.map(clinic => clinic.township))].sort();

  // Filter clinics based on search and filter criteria
  const filteredClinics = clinics.filter(clinic => {
    // Search filter
    const matchesSearch = !searchTerm || 
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Treatment filter
    const matchesTreatment = selectedTreatment === 'all' || 
      clinic.treatments[selectedTreatment as keyof typeof clinic.treatments];

    // Rating filter
    const matchesRating = selectedRating === 'all' || clinic.rating >= parseFloat(selectedRating);
    
    // Distance filter
    const matchesDistance = clinic.distance <= maxDistance;
    
    // Reviews filter
    const matchesReviews = clinic.reviews >= minReviews;
    
    // Credential filter
    const matchesCredentials = credentialFilter === 'all' || 
                              (credentialFilter === 'mdc-registered' && clinic.mdaLicense.includes('MDC-')) ||
                              (credentialFilter === 'specialist' && (clinic.credentials.includes('MDS') || clinic.credentials.includes('Specialist')));

    // Location filter
    const matchesLocation = locationFilter === 'all' ||
                           (locationFilter === '0-2km' && clinic.distance <= 2) ||
                           (locationFilter === '2-5km' && clinic.distance > 2 && clinic.distance <= 5) ||
                           (locationFilter === '5-10km' && clinic.distance > 5 && clinic.distance <= 10) ||
                           (locationFilter === '10-15km' && clinic.distance > 10 && clinic.distance <= 15) ||
                           (locationFilter === '15-25km' && clinic.distance > 15 && clinic.distance <= 25) ||
                           (locationFilter === '25km+' && clinic.distance > 25);

    // Township filter
    const matchesTownship = townshipFilter === 'all' || clinic.township === townshipFilter;

    return matchesSearch && matchesTreatment && matchesRating && matchesDistance && 
           matchesReviews && matchesCredentials && matchesLocation && matchesTownship;
  });

  // Sort filtered clinics
  const sortedClinics = [...filteredClinics].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'distance':
      default:
        return a.distance - b.distance;
    }
  });

  const getCredentialStatus = (license: string) => {
    if (license.includes('Expired')) return 'Expired';
    if (license.includes('Pending')) return 'Pending';
    if (license.includes('MDC-')) return 'Verified';
    return 'Unknown';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTreatment('all');
    setSelectedRating('all');
    setMaxDistance(110);
    setMinReviews(0);
    setCredentialFilter('all');
    setLocationFilter('all');
    setTownshipFilter('all');
    setSortBy('distance');
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <section id="clinics" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Find Your Perfect Clinic
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Search and filter through 101 verified dental clinics across Johor to find the best match for your needs
          </p>
        </div>

        {/* Medical Disclaimer - Enhanced 3D Bevel Effect */}
        <div className="mb-6">
          <div 
            className="bg-gradient-to-b from-gray-50 to-gray-100/80 border border-gray-200/40 rounded-lg px-5 py-4 cursor-default transition-all duration-200 hover:from-gray-100 hover:to-gray-200/80 active:from-gray-200/80 active:to-gray-300/80"
            style={{
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                inset -1px 0 0 rgba(0, 0, 0, 0.1),
                0 4px 8px rgba(0, 0, 0, 0.15),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `,
              transform: 'translateY(0px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 2px 0 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.15),
                inset -1px 0 0 rgba(0, 0, 0, 0.15),
                0 6px 12px rgba(0, 0, 0, 0.2),
                0 3px 6px rgba(0, 0, 0, 0.15)
              `;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                inset -1px 0 0 rgba(0, 0, 0, 0.1),
                0 4px 8px rgba(0, 0, 0, 0.15),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `;
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 4px rgba(0, 0, 0, 0.2),
                inset 2px 2px 4px rgba(0, 0, 0, 0.15),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset -1px 0 0 rgba(255, 255, 255, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `;
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 2px 0 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.15),
                inset -1px 0 0 rgba(0, 0, 0, 0.15),
                0 6px 12px rgba(0, 0, 0, 0.2),
                0 3px 6px rgba(0, 0, 0, 0.15)
              `;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
          >
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-600/70 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-800/90 font-medium leading-relaxed">
                  <strong>Important:</strong> This platform provides general information only and does not constitute dental advice.
                </p>
                <p className="text-xs text-blue-700/80 leading-relaxed">
                  No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Disclaimer - Enhanced 3D Bevel Effect with Blue Accent Opt-out Box */}
        <div className="mb-8">
          <div 
            className="bg-gradient-to-b from-gray-50 to-gray-100/80 border border-gray-200/40 rounded-lg px-5 py-4 cursor-default transition-all duration-200 hover:from-gray-100 hover:to-gray-200/80 active:from-gray-200/80 active:to-gray-300/80"
            style={{
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                inset -1px 0 0 rgba(0, 0, 0, 0.1),
                0 4px 8px rgba(0, 0, 0, 0.15),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `,
              transform: 'translateY(0px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 2px 0 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.15),
                inset -1px 0 0 rgba(0, 0, 0, 0.15),
                0 6px 12px rgba(0, 0, 0, 0.2),
                0 3px 6px rgba(0, 0, 0, 0.15)
              `;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                inset 1px 0 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                inset -1px 0 0 rgba(0, 0, 0, 0.1),
                0 4px 8px rgba(0, 0, 0, 0.15),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `;
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 4px rgba(0, 0, 0, 0.2),
                inset 2px 2px 4px rgba(0, 0, 0, 0.15),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                inset -1px 0 0 rgba(255, 255, 255, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `;
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 2px 0 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.15),
                inset -1px 0 0 rgba(0, 0, 0, 0.15),
                0 6px 12px rgba(0, 0, 0, 0.2),
                0 3px 6px rgba(0, 0, 0, 0.15)
              `;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="h-4 w-4 text-blue-600/70 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-800/90 font-medium leading-relaxed">
                  <strong>Directory Disclaimer:</strong> Information compiled from publicly available sources. 
                  Listing does not imply endorsement, professional relationship, or recommendation.
                </p>
                <p className="text-xs text-blue-700/80 leading-relaxed">
                  This platform does not provide medical advice or establish practitioner-patient relationships. 
                  <span 
                    className="ml-2 inline-flex items-center gap-1 bg-gradient-to-b from-blue-accent to-blue-accent/90 text-white rounded-md px-3 py-1.5 text-sm cursor-pointer font-semibold transition-all duration-200"
                    onClick={() => window.open('/directory-disclaimer', '_blank')}
                    style={{
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 1px 0 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
                        inset -1px 0 0 rgba(0, 0, 0, 0.15),
                        0 3px 6px rgba(0, 0, 0, 0.2),
                        0 1px 3px rgba(0, 0, 0, 0.15)
                      `,
                      transform: 'translateY(0px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        inset 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.25),
                        inset -1px 0 0 rgba(0, 0, 0, 0.2),
                        0 4px 8px rgba(0, 0, 0, 0.25),
                        0 2px 4px rgba(0, 0, 0, 0.2)
                      `;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 1px 0 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
                        inset -1px 0 0 rgba(0, 0, 0, 0.15),
                        0 3px 6px rgba(0, 0, 0, 0.2),
                        0 1px 3px rgba(0, 0, 0, 0.15)
                      `;
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 2px 4px rgba(0, 0, 0, 0.3),
                        inset 1px 1px 3px rgba(0, 0, 0, 0.2),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                        inset -1px 0 0 rgba(255, 255, 255, 0.05),
                        0 1px 2px rgba(0, 0, 0, 0.15)
                      `;
                      e.currentTarget.style.transform = 'translateY(1px)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        inset 1px 0 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.25),
                        inset -1px 0 0 rgba(0, 0, 0, 0.2),
                        0 4px 8px rgba(0, 0, 0, 0.25),
                        0 2px 4px rgba(0, 0, 0, 0.2)
                      `;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Opt-out or report issues
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="mb-6 flex justify-end">
          <AuthStatus onLoginClick={handleAuthRequired} />
        </div>

        {/* Search and Basic Filters */}
        <Card className="mb-8 bg-light-card border-blue-light">
          <CardHeader>
            <CardTitle className="text-blue-dark text-xl">Search & Filter Clinics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
              <Input
                placeholder="Search by clinic name, dentist, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-blue-light text-blue-dark"
              />
            </div>

            {/* Basic Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-blue-dark mb-2 block">Treatment Needed</Label>
                <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="All Treatments" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light max-h-60 overflow-y-auto">
                    <SelectItem value="all" className="text-blue-dark">All Treatments</SelectItem>
                    {Object.entries(treatmentCategories).map(([category, treatments]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-neutral-gray bg-light-card">
                          {category}
                        </div>
                        {treatments.map((treatment) => (
                          <SelectItem key={treatment.key} value={treatment.key} className="text-blue-dark pl-4">
                            {treatment.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">Minimum Rating</Label>
                <Select onValueChange={setSelectedRating} value={selectedRating}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="all" className="text-blue-dark">Any Rating</SelectItem>
                    <SelectItem value="4.9" className="text-blue-dark">4.9+ Stars</SelectItem>
                    <SelectItem value="4.8" className="text-blue-dark">4.8+ Stars</SelectItem>
                    <SelectItem value="4.7" className="text-blue-dark">4.7+ Stars</SelectItem>
                    <SelectItem value="4.5" className="text-blue-dark">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0" className="text-blue-dark">4.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">Township</Label>
                <Select onValueChange={setTownshipFilter} value={townshipFilter}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="All Townships" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light max-h-60 overflow-y-auto">
                    <SelectItem value="all" className="text-blue-dark">All Townships</SelectItem>
                    {uniqueTownships.map((township) => (
                      <SelectItem key={township} value={township} className="text-blue-dark">
                        {township}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">Sort By</Label>
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="distance" className="text-blue-dark">Distance from CIQ</SelectItem>
                    <SelectItem value="rating" className="text-blue-dark">Highest Rating</SelectItem>
                    <SelectItem value="reviews" className="text-blue-dark">Number of Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="border-blue-light text-blue-primary hover:bg-blue-light">
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 mt-6">
                {/* Advanced Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-blue-dark mb-4 block">
                      Max Distance from CIQ: {maxDistance} km
                    </Label>
                    <Slider
                      value={[maxDistance]}
                      onValueChange={(value) => setMaxDistance(value[0])}
                      max={110}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-blue-dark mb-4 block">
                      Minimum Reviews: {minReviews}
                    </Label>
                    <Slider
                      value={[minReviews]}
                      onValueChange={(value) => setMinReviews(value[0])}
                      max={1000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-blue-dark mb-2 block">Credentials</Label>
                    <Select onValueChange={setCredentialFilter} value={credentialFilter}>
                      <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                        <SelectValue placeholder="All Credentials" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-light">
                        <SelectItem value="all" className="text-blue-dark">All Credentials</SelectItem>
                        <SelectItem value="mdc-registered" className="text-blue-dark">MDC Registered</SelectItem>
                        <SelectItem value="specialist" className="text-blue-dark">Specialist (MDS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-blue-dark mb-2 block">Distance Range</Label>
                    <Select onValueChange={setLocationFilter} value={locationFilter}>
                      <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                        <SelectValue placeholder="Any Distance" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-light">
                        <SelectItem value="all" className="text-blue-dark">Any Distance</SelectItem>
                        <SelectItem value="0-2km" className="text-blue-dark">Within 2km</SelectItem>
                        <SelectItem value="2-5km" className="text-blue-dark">2-5km</SelectItem>
                        <SelectItem value="5-10km" className="text-blue-dark">5-10km</SelectItem>
                        <SelectItem value="10-15km" className="text-blue-dark">10-15km</SelectItem>
                        <SelectItem value="15-25km" className="text-blue-dark">15-25km</SelectItem>
                        <SelectItem value="25km+" className="text-blue-dark">25km+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={resetFilters}
                    variant="outline" 
                    className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-neutral-gray">
            Found <span className="text-blue-primary font-semibold">{sortedClinics.length}</span> clinics 
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>
          <p className="text-sm text-neutral-gray">
            Sorted by {sortBy === 'distance' ? 'Distance' : sortBy === 'rating' ? 'Rating' : 'Number of Reviews'}
          </p>
        </div>

        {/* Clinic Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClinics.map((clinic) => (
            <Card key={clinic.id} className="bg-white border-blue-light hover:border-blue-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-blue-dark text-lg flex items-center gap-2">
                    {clinic.name}
                    {getCredentialStatus(clinic.mdaLicense) === 'Verified' && 
                      <Shield className="h-4 w-4 text-success-green" />}
                  </CardTitle>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-blue-dark font-semibold">{clinic.rating || 'N/A'}</span>
                    <span className="text-neutral-gray">({clinic.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-gray" />
                    <span className="text-neutral-gray">{clinic.distance} km from CIQ</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Public Information - Always Visible */}
                  <div>
                    <p className="text-neutral-gray text-sm">Address:</p>
                    <p className="text-neutral-gray text-sm">{clinic.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-neutral-gray text-sm">Available Treatments:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinic.treatments.dentalImplant && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Implants</Badge>}
                      {clinic.treatments.braces && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Braces</Badge>}
                      {clinic.treatments.compositeVeneers && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Composite Veneers</Badge>}
                      {clinic.treatments.porcelainVeneers && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Porcelain Veneers</Badge>}
                      {clinic.treatments.teethWhitening && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Whitening</Badge>}
                      {clinic.treatments.tmjTreatment && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">TMJ</Badge>}
                    </div>
                  </div>

                  {/* Protected Information - Requires Authentication */}
                  {!isAuthenticated ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Sign in to view dentist details</span>
                      </div>
                      <Button 
                        onClick={handleAuthRequired}
                        size="sm"
                        className="w-full bg-blue-primary hover:bg-blue-dark text-white"
                      >
                        View Dentist Name & License
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-neutral-gray text-sm">Dentist:</p>
                        <p className="text-blue-dark text-sm">{clinic.dentist}</p>
                      </div>
                      
                      <div>
                        <p className="text-neutral-gray text-sm">MDA License:</p>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-gray text-sm">{clinic.mdaLicense}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              getCredentialStatus(clinic.mdaLicense) === 'Verified' 
                                ? 'border-success-green text-success-green' 
                                : getCredentialStatus(clinic.mdaLicense) === 'Pending'
                                ? 'border-yellow-500 text-yellow-500'
                                : 'border-red-500 text-red-500'
                            }`}
                          >
                            {getCredentialStatus(clinic.mdaLicense)}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-blue-primary hover:bg-blue-dark text-white"
                      onClick={() => {
                        const element = document.getElementById('waitlist');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="border-blue-light text-blue-primary hover:bg-blue-light">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {sortedClinics.length === 0 && (
          <Card className="bg-light-card border-blue-light text-center py-12">
            <CardContent>
              <p className="text-blue-dark text-lg mb-4">No clinics match your current criteria</p>
              <p className="text-neutral-gray mb-6">Try adjusting your search or filters to see more results</p>
              <Button 
                onClick={resetFilters}
                variant="outline" 
                className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
};

export default ClinicsSection;


import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, Shield, Filter } from 'lucide-react';
import { clinicsData, procedureFilters } from '@/data/clinics';
import type { Clinic, ProcedureFilter } from '@/types/clinic';

const ClinicsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'sentiment'>('distance');
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [showFilters, setShowFilters] = useState(false);

  const handleProcedureToggle = (procedureId: string) => {
    setSelectedProcedures(prev => 
      prev.includes(procedureId) 
        ? prev.filter(id => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const filteredAndSortedClinics = useMemo(() => {
    let filtered = clinicsData.filter(clinic => {
      // Search filter
      const searchMatch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Distance filter
      const distanceMatch = clinic.distance <= maxDistance;
      
      // Procedure filter
      const procedureMatch = selectedProcedures.length === 0 || 
                            selectedProcedures.every(procId => 
                              clinic.procedures[procId as keyof Clinic['procedures']]
                            );
      
      return searchMatch && distanceMatch && procedureMatch;
    });

    // Sort clinics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return (b.googleRating || 0) - (a.googleRating || 0);
        case 'sentiment':
          return b.sentiment - a.sentiment;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedProcedures, sortBy, maxDistance]);

  const groupedProcedures = procedureFilters.reduce((acc, procedure) => {
    if (!acc[procedure.category]) {
      acc[procedure.category] = [];
    }
    acc[procedure.category].push(procedure);
    return acc;
  }, {} as Record<string, ProcedureFilter[]>);

  const getAvailableProcedures = (clinic: Clinic) => {
    return Object.entries(clinic.procedures)
      .filter(([_, available]) => available)
      .map(([procedureId, _]) => {
        const procedure = procedureFilters.find(p => p.id === procedureId);
        return procedure?.label;
      })
      .filter(Boolean)
      .slice(0, 4); // Show first 4 procedures
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-dark mb-4">
            Find Verified Dental Clinics
          </h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Discover quality dental care in Johor Bahru with our verified clinic network
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border border-blue-light">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-xl text-blue-dark">Search & Filter Clinics</CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-gray" />
              <Input
                placeholder="Search by clinic name, dentist, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={sortBy} onValueChange={(value: 'distance' | 'rating' | 'sentiment') => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="sentiment">Patient Sentiment</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-gray">Max Distance:</span>
                <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                    <SelectItem value="100">100 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-neutral-gray">
                Showing {filteredAndSortedClinics.length} of {clinicsData.length} clinics
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-blue-dark mb-4">Filter by Available Procedures</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(groupedProcedures).map(([category, procedures]) => (
                    <div key={category} className="space-y-3">
                      <h5 className="font-medium text-blue-dark capitalize">{category} Procedures</h5>
                      <div className="space-y-2">
                        {procedures.map((procedure) => (
                          <div key={procedure.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={procedure.id}
                              checked={selectedProcedures.includes(procedure.id)}
                              onCheckedChange={() => handleProcedureToggle(procedure.id)}
                            />
                            <label
                              htmlFor={procedure.id}
                              className="text-sm text-neutral-gray cursor-pointer"
                            >
                              {procedure.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedProcedures.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-blue-dark">Selected procedures:</span>
                      {selectedProcedures.map(procId => {
                        const procedure = procedureFilters.find(p => p.id === procId);
                        return (
                          <Badge key={procId} variant="secondary" className="bg-blue-light text-blue-dark">
                            {procedure?.label}
                          </Badge>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProcedures([])}
                        className="text-blue-primary"
                      >
                        Clear all
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedClinics.map((clinic, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border border-blue-light">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg text-blue-dark leading-tight">{clinic.name}</CardTitle>
                  <Badge className="bg-success-green/20 text-success-green">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-neutral-gray">
                  <MapPin className="h-4 w-4 mr-1" />
                  {clinic.address}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium text-blue-dark">Dentist:</span> {clinic.dentist}</p>
                  <p className="text-sm"><span className="font-medium text-blue-dark">Qualifications:</span> {clinic.qualifications}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {clinic.googleRating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{clinic.googleRating}</span>
                        {clinic.reviews && (
                          <span className="text-sm text-neutral-gray ml-1">({clinic.reviews})</span>
                        )}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium text-blue-dark">{clinic.distance} km</span>
                    </div>
                  </div>
                  <Badge className="bg-teal-accent/20 text-teal-accent">
                    {clinic.sentiment}% sentiment
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-blue-dark mb-2">Available Procedures:</h4>
                  <div className="flex flex-wrap gap-1">
                    {getAvailableProcedures(clinic).map((procedure, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {procedure}
                      </Badge>
                    ))}
                    {getAvailableProcedures(clinic).length >= 4 && (
                      <Badge variant="outline" className="text-xs text-neutral-gray">
                        +more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-neutral-gray">
                    <span className="font-medium">License:</span> {clinic.mdaLicense}
                  </p>
                </div>

                <Button className="w-full bg-blue-primary hover:bg-blue-accent text-white">
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedClinics.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold text-blue-dark mb-2">No clinics found</h3>
              <p className="text-neutral-gray mb-4">
                Try adjusting your search criteria or selected procedures
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedProcedures([]);
                  setMaxDistance(50);
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClinicsSection;

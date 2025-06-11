
import { useState } from 'react';
import { Building2, Shield, Star, Clock, MapPin, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const ClinicsSection = () => {
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [priceRange, setPriceRange] = useState([100, 2000]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [minReviews, setMinReviews] = useState(0);

  // Sample clinic data - this would come from your database
  const clinics = [
    {
      id: 1,
      name: 'JB Dental Excellence',
      rating: 4.8,
      reviews: 156,
      distanceFromCIQ: 3.2,
      specialties: ['Implants', 'Orthodontics', 'General'],
      priceRange: '$200-800',
      avgPrice: 400,
      sentimentScore: 0.85,
      verified: true,
      location: 'Johor Bahru City Centre',
      languages: ['English', 'Mandarin', 'Malay'],
      experience: '15+ years',
      nextAvailable: '2 days'
    },
    {
      id: 2,
      name: 'Mahkota Medical Centre',
      rating: 4.7,
      reviews: 203,
      distanceFromCIQ: 5.8,
      specialties: ['General', 'Surgery', 'Periodontics'],
      priceRange: '$180-600',
      avgPrice: 350,
      sentimentScore: 0.78,
      verified: true,
      location: 'Mahkota Medical District',
      languages: ['English', 'Mandarin'],
      experience: '20+ years',
      nextAvailable: '1 day'
    },
    {
      id: 3,
      name: 'Smile Specialist Clinic',
      rating: 4.6,
      reviews: 89,
      distanceFromCIQ: 8.1,
      specialties: ['Cosmetic', 'Whitening', 'Veneers'],
      priceRange: '$150-500',
      avgPrice: 300,
      sentimentScore: 0.82,
      verified: true,
      location: 'Taman Sutera',
      languages: ['English', 'Mandarin', 'Hokkien'],
      experience: '12+ years',
      nextAvailable: '3 days'
    },
    {
      id: 4,
      name: 'Advanced Dental Care',
      rating: 4.9,
      reviews: 234,
      distanceFromCIQ: 4.5,
      specialties: ['Endodontics', 'Periodontics', 'Oral Surgery'],
      priceRange: '$250-900',
      avgPrice: 500,
      sentimentScore: 0.91,
      verified: true,
      location: 'Permas Jaya',
      languages: ['English', 'Mandarin'],
      experience: '18+ years',
      nextAvailable: 'Same day'
    },
    {
      id: 5,
      name: 'Premier Oral Health',
      rating: 4.5,
      reviews: 167,
      distanceFromCIQ: 12.3,
      specialties: ['General', 'Pediatric', 'Orthodontics'],
      priceRange: '$120-400',
      avgPrice: 250,
      sentimentScore: 0.76,
      verified: true,
      location: 'Skudai',
      languages: ['English', 'Malay'],
      experience: '10+ years',
      nextAvailable: '4 days'
    }
  ];

  const treatments = [
    'All Treatments', 'General', 'Implants', 'Orthodontics', 'Cosmetic', 
    'Whitening', 'Surgery', 'Endodontics', 'Periodontics', 'Pediatric'
  ];

  // Filter clinics based on selected criteria
  const filteredClinics = clinics.filter(clinic => {
    const matchesTreatment = !selectedTreatment || selectedTreatment === 'All Treatments' || 
                            clinic.specialties.some(spec => spec.toLowerCase().includes(selectedTreatment.toLowerCase()));
    const matchesRating = !selectedRating || clinic.rating >= parseFloat(selectedRating);
    const matchesPrice = clinic.avgPrice >= priceRange[0] && clinic.avgPrice <= priceRange[1];
    const matchesDistance = clinic.distanceFromCIQ <= maxDistance;
    const matchesSentiment = !sentimentFilter || 
                           (sentimentFilter === 'positive' && clinic.sentimentScore >= 0.8) ||
                           (sentimentFilter === 'neutral' && clinic.sentimentScore >= 0.6 && clinic.sentimentScore < 0.8) ||
                           (sentimentFilter === 'all');
    const matchesReviews = clinic.reviews >= minReviews;

    return matchesTreatment && matchesRating && matchesPrice && matchesDistance && matchesSentiment && matchesReviews;
  });

  const getSentimentIcon = (score: number) => {
    if (score >= 0.8) return '😊';
    if (score >= 0.6) return '😐';
    return '😔';
  };

  return (
    <section id="clinics" className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Clinic
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Filter and compare verified dental clinics to find the best match for your needs
          </p>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-8 bg-dark-bg border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-xl">Filter Clinics</CardTitle>
            <CardDescription className="text-gray-300">
              Customize your search criteria to find the perfect clinic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Treatment Type and User Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-2 block">Treatment Type</Label>
                <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                  <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                    <SelectValue placeholder="All Treatments" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-gray-600">
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment} value={treatment} className="text-white">
                        {treatment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Minimum Rating</Label>
                <Select onValueChange={setSelectedRating} value={selectedRating}>
                  <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-gray-600">
                    <SelectItem value="4.8" className="text-white">4.8+ Stars</SelectItem>
                    <SelectItem value="4.5" className="text-white">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0" className="text-white">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5" className="text-white">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Price Range and Distance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-4 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  min={100}
                  step={50}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-white mb-4 block">
                  Max Distance from CIQ: {maxDistance} km
                </Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Row 3: AI Sentiment and Number of Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-2 block">AI Sentiment Analysis</Label>
                <Select onValueChange={setSentimentFilter} value={sentimentFilter}>
                  <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                    <SelectValue placeholder="All Sentiments" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-gray-600">
                    <SelectItem value="all" className="text-white">All Sentiments</SelectItem>
                    <SelectItem value="positive" className="text-white">😊 Positive (80%+)</SelectItem>
                    <SelectItem value="neutral" className="text-white">😐 Neutral (60-80%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-4 block">
                  Minimum Reviews: {minReviews}
                </Label>
                <Slider
                  value={[minReviews]}
                  onValueChange={(value) => setMinReviews(value[0])}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-300">
            Found <span className="text-teal-accent font-semibold">{filteredClinics.length}</span> clinics matching your criteria
          </p>
        </div>

        {/* Clinic Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <Card key={clinic.id} className="bg-dark-bg border-gray-600 hover:border-teal-accent transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    {clinic.name}
                    {clinic.verified && <Shield className="h-4 w-4 text-success-green" />}
                  </CardTitle>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{clinic.rating}</span>
                    <span className="text-gray-400">({clinic.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{clinic.distanceFromCIQ} km from CIQ</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      Sentiment: {getSentimentIcon(clinic.sentimentScore)} {(clinic.sentimentScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Specialties:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinic.specialties.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Price Range</p>
                      <p className="text-success-green font-semibold">{clinic.priceRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Next Available</p>
                      <p className="text-teal-accent font-medium">{clinic.nextAvailable}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Languages: {clinic.languages.join(', ')}</p>
                    <p className="text-gray-400 text-sm">Experience: {clinic.experience}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-teal-accent hover:bg-teal-accent/80 text-white"
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
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredClinics.length === 0 && (
          <Card className="bg-dark-bg border-gray-600 text-center py-12">
            <CardContent>
              <p className="text-gray-300 text-lg mb-4">No clinics match your current criteria</p>
              <p className="text-gray-400 mb-6">Try adjusting your filters to see more results</p>
              <Button 
                onClick={() => {
                  setSelectedTreatment('');
                  setSelectedRating('');
                  setPriceRange([100, 2000]);
                  setMaxDistance(50);
                  setSentimentFilter('');
                  setMinReviews(0);
                }}
                variant="outline" 
                className="border-teal-accent text-teal-accent hover:bg-teal-accent hover:text-white"
              >
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ClinicsSection;

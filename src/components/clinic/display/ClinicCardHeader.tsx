
import { Star } from 'lucide-react';

interface ClinicCardHeaderProps {
  clinic: {
    name: string;
    address: string;
    rating: number;
    reviews: number;
    googleReviewUrl: string;
  };
}

const ClinicCardHeader = ({ clinic }: ClinicCardHeaderProps) => {
  const handleRatingClick = () => {
    if (clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '') {
      window.open(clinic.googleReviewUrl, '_blank');
    }
  };

  const hasGoogleReviews = clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '';

  return (
    <div className="flex items-start justify-between gap-3 mb-2">
      {/* Left Column: Clinic Name and Address */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-blue-dark mb-1 leading-tight">
          {clinic.name}
        </h3>
        <p className="text-xs text-neutral-gray leading-snug">
          {clinic.address}
        </p>
      </div>
      
      {/* Right Column: Google Rating CTA Box */}
      {hasGoogleReviews && (
        <div 
          className="bg-gradient-to-r from-blue-light to-blue-150 border border-blue-light rounded-lg p-1.5 cursor-pointer hover:from-blue-150 hover:to-blue-secondary/20 hover:border-blue-secondary/30 transition-all duration-200 shadow-sm flex-shrink-0"
          onClick={handleRatingClick}
          title="Click to view Google Reviews"
        >
          <div className="text-sm text-blue-primary font-medium mb-1">
            Google Review
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-bold text-blue-dark text-sm">
              {clinic.rating.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-blue-primary font-medium mt-1">
            ({clinic.reviews} reviews)
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicCardHeader;

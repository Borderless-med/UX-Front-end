
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleRatingClick = async () => {
    if (clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '') {
      const searchQuery = `"${clinic.name}" reviews ${clinic.address.split(',')[0]}`;
      
      try {
        await navigator.clipboard.writeText(searchQuery);
        toast({
          title: "Search terms copied!",
          description: "Paste into Google to find reviews for this clinic",
          duration: 4000,
        });
      } catch (error) {
        console.error('Clipboard not available:', error);
        toast({
          title: "Search Google for:",
          description: searchQuery,
          duration: 6000,
        });
      }
    }
  };

  const hasGoogleReviews = clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '';

  return (
  <div className="flex flex-wrap items-start justify-between gap-3 mb-2 w-full">
      {/* Left Column: Clinic Name and Address */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-blue-dark mb-1 leading-tight break-words">
          {clinic.name}
        </h3>
        <p className="text-xs text-neutral-gray leading-snug line-clamp-2 break-words max-w-full">
          {clinic.address}
        </p>
      </div>
      
      {/* Right Column: Google Rating CTA Box */}
      {hasGoogleReviews && (
        <div 
          className="bg-gradient-to-r from-blue-light to-blue-150 border border-blue-light rounded-lg p-1 sm:p-1.5 cursor-pointer hover:from-blue-150 hover:to-blue-secondary/20 hover:border-blue-secondary/30 transition-all duration-200 shadow-sm flex-shrink-0 w-[5.25rem] sm:w-[5.5rem] mt-2 sm:mt-0"
          onClick={handleRatingClick}
          title="Click to copy Google search terms for reviews"
        >
          <div className="text-xs font-medium mb-1 text-blue-primary truncate">
            Google Review
          </div>
          <div className="flex items-center justify-center">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-bold text-blue-dark text-xs sm:text-sm">
              {clinic.rating.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-blue-primary font-medium mt-1 truncate">
            ({clinic.reviews})
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicCardHeader;

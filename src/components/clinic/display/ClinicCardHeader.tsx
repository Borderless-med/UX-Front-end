
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClinicCardHeaderProps {
  clinic: {
    name: string;
    address: string;
    rating?: number; // rating may be absent for some regions
    reviews?: number; // review count may be absent
    googleReviewUrl?: string; // may be blank for SG clinics currently
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

  // Determine if we have a usable Google review URL (signals real rating data)
  const hasGoogleReviews = !!(clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '' && clinic.rating && clinic.reviews);
  const ratingDisplay = hasGoogleReviews && clinic.rating ? clinic.rating.toFixed(1) : '–';
  const reviewsDisplay = hasGoogleReviews && typeof clinic.reviews === 'number' ? `(${clinic.reviews})` : '(N/A)';

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
      
      {/* Right Column: Google Rating / Placeholder Box (always rendered for layout consistency) */}
      <div
        className={[
          'rounded-lg p-1 sm:p-1.5 flex-shrink-0 w-[5.75rem] sm:w-[6rem] mt-2 sm:mt-0 border transition-all duration-200',
          hasGoogleReviews
            ? 'bg-gradient-to-r from-blue-light to-blue-150 border-blue-light cursor-pointer hover:from-blue-150 hover:to-blue-secondary/20 hover:border-blue-secondary/30 shadow-sm'
            : 'bg-slate-100 border-slate-200 text-slate-500'
        ].join(' ')}
        onClick={hasGoogleReviews ? handleRatingClick : undefined}
        title={hasGoogleReviews ? 'Click to copy Google search terms for reviews' : 'Google reviews not available'}
      >
        <div className="text-[11px] font-medium leading-tight mb-1 break-words text-blue-primary">
          Google Reviews
        </div>
        <div className="flex items-center justify-center">
          <Star className={[
            'mr-1',
            hasGoogleReviews ? 'h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400' : 'h-3 w-3 sm:h-4 sm:w-4 text-slate-300'
          ].join(' ')} />
          <span className={[
            'font-bold text-xs sm:text-sm',
            hasGoogleReviews ? 'text-blue-dark' : 'text-slate-500'
          ].join(' ')}>
            {ratingDisplay}
          </span>
        </div>
        <div className={[
          'text-[11px] font-medium mt-1 leading-tight break-words text-center',
          hasGoogleReviews ? 'text-blue-primary' : 'text-slate-400'
        ].join(' ')}>
          {reviewsDisplay}
        </div>
      </div>
    </div>
  );
};

export default ClinicCardHeader;

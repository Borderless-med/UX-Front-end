
import { Star } from 'lucide-react';
import { Clinic } from '@/types/clinic';

interface ClinicCardHeaderProps { clinic: Clinic }

const ClinicCardHeader = ({ clinic }: ClinicCardHeaderProps) => {
  // Link and display logic
  const hasReviewsLink = !!clinic.hasReviewsLink && !!clinic.googleReviewsHref;
  const ratingDisplay = clinic.rating && clinic.rating > 0 ? clinic.rating.toFixed(1) : 'N/A';
  const reviewsDisplay = typeof clinic.reviews === 'number' && clinic.reviews > 0 ? `(${clinic.reviews})` : '(N/A)';

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
      {hasReviewsLink ? (
        <a
          href={clinic.googleReviewsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'rounded-lg p-1 sm:p-1.5 flex-shrink-0 w-[5.75rem] sm:w-[6rem] mt-2 sm:mt-0 border transition-all duration-200',
            'bg-gradient-to-r from-blue-light to-blue-150 border-blue-light hover:from-blue-150 hover:to-blue-secondary/20 hover:border-blue-secondary/30 shadow-sm'
          ].join(' ')}
          title={'Open Google Reviews in a new tab'}
        >
          <div className="text-[11px] font-medium leading-tight mb-1 break-words text-blue-primary">
            Google Reviews
          </div>
          <div className="flex items-center justify-center">
            <Star className={[
              'mr-1',
              'h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400'
            ].join(' ')} />
            <span className={[
              'font-bold text-xs sm:text-sm',
              'text-blue-dark'
            ].join(' ')}>
              {ratingDisplay}
            </span>
          </div>
          <div className={[
            'text-[11px] font-medium mt-1 leading-tight break-words text-center',
            'text-blue-primary'
          ].join(' ')}>
            {reviewsDisplay}
          </div>
        </a>
      ) : (
        <div
          className={[
            'rounded-lg p-1 sm:p-1.5 flex-shrink-0 w-[5.75rem] sm:w-[6rem] mt-2 sm:mt-0 border transition-all duration-200',
            'bg-slate-100 border-slate-200 text-slate-500'
          ].join(' ')}
          title={'Google reviews not available'}
        >
          <div className="text-[11px] font-medium leading-tight mb-1 break-words text-blue-primary">
            Google Reviews
          </div>
          <div className="flex items-center justify-center">
            <Star className={[
              'mr-1',
              'h-3 w-3 sm:h-4 sm:w-4 text-slate-300'
            ].join(' ')} />
            <span className={[
              'font-bold text-xs sm:text-sm',
              'text-slate-500'
            ].join(' ')}>
              {ratingDisplay}
            </span>
          </div>
          <div className={[
            'text-[11px] font-medium mt-1 leading-tight break-words text-center',
            'text-slate-400'
          ].join(' ')}>
            {reviewsDisplay}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicCardHeader;

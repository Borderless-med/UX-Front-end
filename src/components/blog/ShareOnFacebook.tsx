import { Facebook } from "lucide-react";

interface ShareOnFacebookProps {
  className?: string;
}

/**
 * Shares the current page URL to Facebook via the standard sharer dialog.
 * Opens in a new tab with rel="noopener,noreferrer" to prevent reverse-tabnabbing.
 */
const ShareOnFacebook = ({ className = "" }: ShareOnFacebookProps) => {
  const handleShare = () => {
    const currentUrl = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this article on Facebook"
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-primary/40 hover:text-blue-primary ${className}`}
    >
      <Facebook className="h-4 w-4 text-[#1877F2]" aria-hidden="true" />
      Share on Facebook
    </button>
  );
};

export default ShareOnFacebook;

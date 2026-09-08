import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface StickyHubCTAProps {
  /** e.g. "Dental Implants" — appended to the CTA copy when available. */
  treatment?: string;
}

/**
 * Conversion loop back to the Hub (/clinics).
 * - Desktop: sticky card inside the article's sidebar column.
 * - Mobile: fixed bottom bar (article content gets bottom padding to avoid overlap).
 */
const StickyHubCTA = ({ treatment }: StickyHubCTAProps) => {
  const label = treatment ? `Find a verified clinic for ${treatment}` : "Find a verified clinic for this treatment";

  return (
    <>
      {/* Desktop sidebar CTA */}
      <div className="hidden lg:block">
        <div className="sticky top-32 rounded-xl border border-blue-light bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-gray-900">{label}</p>
          <p className="mb-4 text-sm leading-relaxed text-neutral-gray">
            Compare vetted JB dental clinics, transparent pricing, and verified reviews before you book.
          </p>
          <Link
            to="/clinics"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-dark"
          >
            Browse Clinics
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Mobile bottom-fixed CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blue-light bg-white/95 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
        <Link
          to="/clinics"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-primary px-4 py-3 text-sm font-semibold text-white"
        >
          {label}: Browse Clinics
          <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
};

export default StickyHubCTA;

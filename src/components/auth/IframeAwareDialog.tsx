import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shouldUseIframeWorkaround } from '@/utils/environment';

interface IframeAwareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const IframeAwareDialog: React.FC<IframeAwareDialogProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      setTimeout(() => {
        const firstInput = dialogRef.current?.querySelector('input') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const useIframeMode = shouldUseIframeWorkaround();

  if (useIframeMode) {
    // Direct DOM rendering for iframe environment
    return (
      <div 
        className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 pt-32"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          ref={dialogRef}
          className={cn(
            "bg-background border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    );
  }

  // Standard portal-based rendering for normal environments
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose} />
      <div 
        ref={dialogRef}
        className={cn(
          "fixed left-[50%] top-[50%] z-[60] translate-x-[-50%] translate-y-[-50%] bg-background border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mt-14",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  );
};

export default IframeAwareDialog;
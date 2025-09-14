import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Handle escape key - minimal event handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Optimized rendering for production environments
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 flex items-start justify-center p-4 pt-32"
      onClick={(e) => {
        // Only close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        ref={dialogRef}
        className={cn(
          "bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[calc(100vh-8rem)] overflow-y-auto relative",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10 pointer-events-auto"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IframeAwareDialog;
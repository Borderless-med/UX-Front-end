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

  if (!isOpen) {
    console.log('Modal not open');
    return null;
  }

  console.log('Rendering modal');

  // Simplified single rendering approach that works everywhere
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/50 flex items-start justify-center p-4 pt-32"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('Backdrop clicked, closing modal');
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
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            console.log('Close button clicked');
            onClose();
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default IframeAwareDialog;
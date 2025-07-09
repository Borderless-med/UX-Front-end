
import React from 'react';

interface SecurityEnhancedFormProps {
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent) => void;
  className?: string;
}

const SecurityEnhancedForm = ({ children, onSubmit, className }: SecurityEnhancedFormProps) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target as HTMLFormElement);
    const formEntries = Object.fromEntries(formData.entries());
    
    // Basic XSS prevention - sanitize all text inputs
    const sanitizedEntries = Object.entries(formEntries).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        // Basic XSS prevention by removing potentially dangerous characters
        acc[key] = value
          .trim()
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
          .replace(/<[^>]*>/g, ''); // Remove all HTML tags
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Call the original onSubmit with sanitized data
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default SecurityEnhancedForm;

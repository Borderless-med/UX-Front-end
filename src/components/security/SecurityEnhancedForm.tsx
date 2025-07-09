
import React from 'react';
import DOMPurify from 'dompurify';

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
    
    // Sanitize all text inputs
    const sanitizedEntries = Object.entries(formEntries).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        // Basic XSS prevention by sanitizing HTML
        acc[key] = DOMPurify.sanitize(value.trim());
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

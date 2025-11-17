import React from 'react';

interface UniversalPageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <header className={`w-full bg-[#f0f8ff] ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-800 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-base md:text-lg text-black/80 max-w-3xl">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default UniversalPageHeader;

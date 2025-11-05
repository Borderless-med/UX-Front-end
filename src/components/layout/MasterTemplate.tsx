import React, { PropsWithChildren } from 'react';
import Navigation from '@/components/Navigation';
import UniversalPageHeader from './UniversalPageHeader';
import UniversalFooter from './UniversalFooter';

interface MasterTemplateProps {
  title: string;
  subtitle?: string;
  headerClassName?: string;
  containerClassName?: string;
}

const MasterTemplate: React.FC<PropsWithChildren<MasterTemplateProps>> = ({
  title,
  subtitle,
  headerClassName,
  containerClassName,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white text-blue-dark font-inter">
      <Navigation />
      <div className="main-content-offset">
        <UniversalPageHeader title={title} subtitle={subtitle} className={headerClassName} />
        <main className={`max-w-7xl mx-auto px-4 ${containerClassName || ''}`}>{children}</main>
        <UniversalFooter />
      </div>
    </div>
  );
};

export default MasterTemplate;

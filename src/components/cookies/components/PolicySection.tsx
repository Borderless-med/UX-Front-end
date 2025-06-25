
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PolicySectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  title,
  icon: Icon,
  children,
  className = "shadow-sm border-gray-200/60",
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-blue-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-700 space-y-4 leading-relaxed">
        {children}
      </CardContent>
    </Card>
  );
};

export default PolicySection;

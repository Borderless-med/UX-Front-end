
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, BarChart3, Target } from 'lucide-react';
import { CookieCategory } from '../types/cookieTypes';
import { COOKIE_CATEGORY_INFO } from '../constants/cookieConstants';

interface CookieTypeCardProps {
  category: CookieCategory;
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

const iconMap = {
  essential: Shield,
  analytics: BarChart3,
  marketing: Target,
};

const colorMap = {
  green: {
    border: 'border-green-200',
    background: 'bg-green-50/30',
    icon: 'text-green-600',
  },
  blue: {
    border: 'border-blue-200',
    background: '',
    icon: 'text-blue-600',
  },
  orange: {
    border: 'border-orange-200',
    background: '',
    icon: 'text-orange-600',
  },
};

const CookieTypeCard: React.FC<CookieTypeCardProps> = ({
  category,
  isEnabled,
  onToggle,
}) => {
  const categoryInfo = COOKIE_CATEGORY_INFO[category];
  const Icon = iconMap[category];
  const colors = colorMap[categoryInfo.color as keyof typeof colorMap];

  return (
    <Card className={`${colors.border} ${colors.background}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${colors.icon}`} />
            <span>{categoryInfo.title}</span>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={onToggle}
            disabled={categoryInfo.required}
            className={categoryInfo.required ? "opacity-50" : ""}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-2">
          {categoryInfo.description}
        </p>
        <p className="text-xs text-gray-500">
          <strong>Examples:</strong> {categoryInfo.examples}
        </p>
      </CardContent>
    </Card>
  );
};

export default CookieTypeCard;

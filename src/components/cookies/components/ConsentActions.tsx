
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface ConsentActionsProps {
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
  onManagePreferences: () => void;
  variant?: 'banner' | 'preferences';
  loading?: boolean;
}

const ConsentActions: React.FC<ConsentActionsProps> = ({
  onAcceptAll,
  onEssentialOnly,
  onManagePreferences,
  variant = 'banner',
  loading = false,
}) => {
  if (variant === 'preferences') {
    return (
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          onClick={onAcceptAll}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex-1"
        >
          Save Preferences
        </Button>
        <Button 
          onClick={onManagePreferences}
          disabled={loading}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        onClick={onAcceptAll}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        Accept All Cookies
      </Button>
      <Button 
        onClick={onEssentialOnly}
        disabled={loading}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Essential Only
      </Button>
      <Button 
        onClick={onManagePreferences}
        disabled={loading}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage Cookies
      </Button>
    </div>
  );
};

export default ConsentActions;

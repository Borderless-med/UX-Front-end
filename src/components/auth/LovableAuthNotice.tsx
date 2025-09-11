import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Info } from 'lucide-react';
import { getProductionUrl } from '@/utils/environment';

interface LovableAuthNoticeProps {
  onClose: () => void;
}

const LovableAuthNotice: React.FC<LovableAuthNoticeProps> = ({ onClose }) => {
  const productionUrl = getProductionUrl();

  const handleOpenInNewTab = () => {
    window.open(`${productionUrl}/clinics`, '_blank');
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-dark">
          <Info className="h-5 w-5 text-blue-primary" />
          Development Environment Notice
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-dark">
            Authentication forms are disabled in the Lovable development environment due to iframe restrictions.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            To test authentication and access full clinic details:
          </p>
          
          <Button 
            onClick={handleOpenInNewTab}
            className="w-full bg-blue-primary hover:bg-blue-dark"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Production (New Tab)
          </Button>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Full authentication functionality available</p>
            <p>• Access to detailed clinic information</p>
            <p>• Chat history and user preferences</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={onClose}
          className="w-full"
        >
          Continue Browsing (Limited View)
        </Button>
      </CardContent>
    </Card>
  );
};

export default LovableAuthNotice;
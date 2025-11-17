import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, FileText, Calendar, MapPin, Phone, Globe } from 'lucide-react';
import { Clinic } from '@/types/clinic';

interface PractitionerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic;
}

const PractitionerDetailsModal: React.FC<PractitionerDetailsModalProps> = ({
  isOpen,
  onClose,
  clinic
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-dark">
            <User className="h-5 w-5 text-blue-primary" />
            Practitioner Details - {clinic.name}
          </DialogTitle>
          <DialogDescription>
            Verified practitioner information and clinic credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Practitioner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Practitioner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dentist Name</label>
                  <p className="text-base text-gray-900">
                    {clinic.dentist || 'Information available to registered users'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">MDA License</label>
                  <p className="text-base text-gray-900">
                    {clinic.mdaLicense || 'License details available to verified users'}
                  </p>
                </div>
              </div>
              
              {clinic.credentials && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Professional Credentials</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {clinic.credentials.split(',').map((credential, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {credential.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clinic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Clinic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-base text-gray-900">{clinic.address}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Township</label>
                  <p className="text-base text-gray-900">{clinic.township || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rating</label>
                  <p className="text-base text-gray-900">
                    ⭐ {clinic.rating && clinic.rating > 0 ? clinic.rating.toFixed(1) : 'N/A'}/5 ({typeof clinic.reviews === 'number' && clinic.reviews > 0 ? clinic.reviews : 'N/A'} reviews)
                  </p>
                </div>
              </div>

              {clinic.operatingHours && (
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Operating Hours
                  </label>
                  <div className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    {clinic.operatingHours}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(clinic.websiteUrl || clinic.googleReviewsHref) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clinic.websiteUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Website
                    </label>
                    <a 
                      href={clinic.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-primary hover:text-blue-dark underline"
                    >
                      Visit Clinic Website
                    </a>
                  </div>
                )}
                
                {clinic.googleReviewsHref && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Google Reviews</label>
                    <a 
                      href={clinic.googleReviewsHref} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-primary hover:text-blue-dark underline block"
                    >
                      Open Google Reviews
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PractitionerDetailsModal;
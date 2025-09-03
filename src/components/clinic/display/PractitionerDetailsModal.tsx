import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Award, MapPin, Phone, Globe, Calendar } from 'lucide-react';
import type { Clinic } from '@/types/clinic';

interface PractitionerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic | null;
}

const PractitionerDetailsModal = ({ isOpen, onClose, clinic }: PractitionerDetailsModalProps) => {
  if (!clinic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Practitioner Details - {clinic.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dentist Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Dr. {clinic.dentist}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">MDA License:</span>
                </div>
                <p className="text-sm bg-muted p-2 rounded font-mono">{clinic.mdaLicense}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Credentials:</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {clinic.credentials}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Clinic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Clinic Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-sm text-muted-foreground">{clinic.address}</p>
                </div>
              </div>

              {clinic.operatingHours && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium">Operating Hours:</span>
                    <p className="text-sm text-muted-foreground">{clinic.operatingHours}</p>
                  </div>
                </div>
              )}

              {clinic.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <a 
                    href={clinic.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Rating & Reviews */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Patient Feedback</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{clinic.rating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{clinic.reviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Available Treatments */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Available Treatments</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(clinic.treatments)
                .filter(([_, available]) => available)
                .map(([treatment, _]) => (
                  <Badge key={treatment} variant="outline" className="text-xs justify-center">
                    {treatment.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Authenticated User Benefits Notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">✓ Authenticated Access</h4>
            <p className="text-sm text-muted-foreground">
              You now have access to complete practitioner details, including full names and license numbers. 
              This information is only available to registered users for verification purposes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PractitionerDetailsModal;
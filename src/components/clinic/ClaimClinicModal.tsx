
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, Phone, Clock, Award } from 'lucide-react';

interface ClaimClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: any;
}

const ClaimClinicModal = ({ isOpen, onClose, clinic }: ClaimClinicModalProps) => {
  const [formData, setFormData] = useState({
    websiteUrl: clinic.websiteUrl || '',
    contactEmail: '',
    contactPhone: '',
    operatingHours: '',
    additionalCredentials: '',
    verificationNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert claim request into a claims table (we'll need to create this)
      const { error } = await supabase
        .from('clinic_claims')
        .insert({
          clinic_id: clinic.id,
          clinic_name: clinic.name,
          dentist_name: clinic.dentist,
          website_url: formData.websiteUrl,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          operating_hours: formData.operatingHours,
          additional_credentials: formData.additionalCredentials,
          verification_notes: formData.verificationNotes,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Claim request submitted successfully! We\'ll review and update your clinic information within 2-3 business days.');
      onClose();
      setFormData({
        websiteUrl: '',
        contactEmail: '',
        contactPhone: '',
        operatingHours: '',
        additionalCredentials: '',
        verificationNotes: ''
      });
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-dark">
            Update My Clinic: {clinic.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-gray">
            Are you the owner/practitioner of this clinic? Update your information to provide patients with accurate details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-light/10 p-4 rounded-lg">
            <h3 className="font-medium text-blue-dark mb-2">Current Information</h3>
            <div className="text-sm text-neutral-gray space-y-1">
              <p><strong>Dentist:</strong> {clinic.dentist}</p>
              <p><strong>MDA License:</strong> {clinic.mdaLicense}</p>
              <p><strong>Address:</strong> {clinic.address}</p>
              <p><strong>Current Website:</strong> {clinic.websiteUrl || 'Not provided'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="websiteUrl" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website URL
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://your-clinic-website.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="clinic@example.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+60x-xxx-xxxx"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="operatingHours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Operating Hours
              </Label>
              <Input
                id="operatingHours"
                placeholder="Mon-Fri: 9AM-6PM"
                value={formData.operatingHours}
                onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additionalCredentials" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Additional Credentials/Specializations
            </Label>
            <Textarea
              id="additionalCredentials"
              placeholder="List any additional qualifications, specializations, or certifications..."
              value={formData.additionalCredentials}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalCredentials: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="verificationNotes">Verification Notes</Label>
            <Textarea
              id="verificationNotes"
              placeholder="Any additional information to help us verify your claim (optional)"
              value={formData.verificationNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, verificationNotes: e.target.value }))}
              className="min-h-[60px]"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> All claim requests are manually reviewed. We'll contact you at the provided email for verification. 
              Updates typically take 2-3 business days to appear on the directory.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimClinicModal;

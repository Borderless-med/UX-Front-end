import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MessageCircle, Mail } from 'lucide-react';
import { Clinic } from '@/types/clinic';

// Inline type definition for sg_clinic_inquiries table
type SgClinicInquiryInsert = {
  clinic_id: number;
  clinic_name: string;
  user_name: string;
  user_email: string | null;
  user_whatsapp: string | null;
  inquiry_message: string;
  preferred_contact: 'email' | 'whatsapp' | 'either';
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
};

interface InquiryFormProps {
  clinic: Clinic;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryForm = ({ clinic, isOpen, onClose }: InquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: '',
    preferredContact: 'either' as 'email' | 'whatsapp' | 'either',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim() && !formData.whatsapp.trim()) {
      toast.error('Please provide at least an email or WhatsApp number');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your inquiry message');
      return;
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert inquiry into Supabase
      const inquiryData: SgClinicInquiryInsert = {
        clinic_id: clinic.id,
        clinic_name: clinic.name,
        user_name: formData.name,
        user_email: formData.email || null,
        user_whatsapp: formData.whatsapp || null,
        inquiry_message: formData.message,
        preferred_contact: formData.preferredContact,
        status: 'pending',
      };

      const { data: inquiry, error: insertError } = await supabase
        .from('sg_clinic_inquiries')
        .insert(inquiryData)
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to submit inquiry');
      }

      // Send email notifications via Vercel API
      try {
        const emailResponse = await fetch('/api/send-inquiry-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clinic_name: clinic.name,
            user_name: formData.name,
            user_email: formData.email || undefined,
            user_whatsapp: formData.whatsapp || undefined,
            preferred_contact: formData.preferredContact,
            inquiry_message: formData.message,
            inquiry_id: inquiry?.id,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email notification error:', errorData);
          // Don't fail the submission if email fails
        } else {
          console.log('Email notifications sent successfully');
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the submission if email fails
      }

      toast.success(
        formData.email
          ? "Inquiry sent! Check your email for confirmation."
          : "Inquiry sent! We'll contact you via WhatsApp within 24 hours.",
        { duration: 5000 }
      );

      // Reset form and close
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        message: '',
        preferredContact: 'either',
      });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Contact OraChope.org</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">About: {clinic.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Tan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended for instant confirmation
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+65 9123 4567"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              disabled={isSubmitting}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              For faster communication (include country code)
            </p>
          </div>

          {/* Preferred Contact Method */}
          {formData.email && formData.whatsapp && (
            <div>
              <Label>Preferred Contact Method</Label>
              <RadioGroup
                value={formData.preferredContact}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, preferredContact: value })
                }
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="prefer-email" />
                  <Label htmlFor="prefer-email" className="font-normal cursor-pointer flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="prefer-whatsapp" />
                  <Label htmlFor="prefer-whatsapp" className="font-normal cursor-pointer flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="either" id="prefer-either" />
                  <Label htmlFor="prefer-either" className="font-normal cursor-pointer">
                    Either is fine
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Your Question *</Label>
            <Textarea
              id="message"
              placeholder="What would you like to know about this clinic?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              disabled={isSubmitting}
              className="mt-1 min-h-[100px]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Inquiry'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MessageCircle, Mail } from 'lucide-react';
import { Clinic } from '@/types/clinic';
import { countryCodes } from '@/data/countryCodes';
import { useRateLimit } from '@/hooks/useRateLimit';

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
    countryCode: '+65',
    message: '',
    preferredContact: 'either' as 'email' | 'whatsapp' | 'either',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rateLimit = useRateLimit({ 
    maxAttempts: 3, 
    windowMs: 300000,      // 5 minutes
    blockDurationMs: 900000 // 15 minutes
  });

  // Bot protection state
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [honeypotValue, setHoneypotValue] = useState<string>('');
  const turnstileContainerRef = React.useRef<HTMLDivElement>(null);
  const turnstileWidgetId = React.useRef<string | null>(null);

  // Initialize Cloudflare Turnstile widget (Compact visible mode)
  React.useEffect(() => {
    if (!isOpen) return; // Only initialize when dialog is open

    const initTurnstile = () => {
      if (typeof window !== 'undefined' && (window as any).turnstile && turnstileContainerRef.current && !turnstileWidgetId.current) {
        try {
          const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
          
          turnstileWidgetId.current = (window as any).turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              console.log('Turnstile token received (inquiry form)');
              setTurnstileToken(token);
            },
            'expired-callback': () => {
              console.log('Turnstile token expired');
              setTurnstileToken('');
            },
            'error-callback': () => {
              console.error('Turnstile error occurred');
              setTurnstileToken('');
            },
            theme: 'light',
            size: 'compact',
          });
          
          console.log('Turnstile widget initialized:', turnstileWidgetId.current);
        } catch (error) {
          console.error('Error initializing Turnstile:', error);
        }
      }
    };

    initTurnstile();

    if (!(window as any).turnstile) {
      const checkInterval = setInterval(() => {
        if ((window as any).turnstile) {
          clearInterval(checkInterval);
          initTurnstile();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);
      return () => clearInterval(checkInterval);
    }

    return () => {
      if (turnstileWidgetId.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileWidgetId.current);
          turnstileWidgetId.current = null;
        } catch (e) {
          console.error('Error removing Turnstile widget:', e);
        }
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot protection: Check honeypot field
    if (honeypotValue) {
      console.warn('Honeypot triggered - potential bot detected');
      // Silent rejection - don't give bot feedback
      return;
    }

    // Bot protection: Check Turnstile token
    if (!turnstileToken) {
      toast.error('Please wait for security verification to complete');
      return;
    }

    // Check rate limiting
    if (!rateLimit.checkRateLimit()) {
      const remainingTime = Math.ceil(rateLimit.getRemainingTime() / 1000);
      toast.error(`Too many attempts. Please wait ${remainingTime} seconds before trying again.`);
      return;
    }

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
        user_whatsapp: formData.whatsapp ? `${formData.countryCode} ${formData.whatsapp}` : null,
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
        const emailResponse = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'inquiry',
            clinic_name: clinic.name,
            user_name: formData.name,
            user_email: formData.email || undefined,
            user_whatsapp: formData.whatsapp ? `${formData.countryCode} ${formData.whatsapp}` : undefined,
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
        countryCode: '+65',
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
            <div className="flex gap-2 mt-1">
              <Select 
                value={formData.countryCode} 
                onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countryCodes.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="9123 4567"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                disabled={isSubmitting}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For faster communication
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

          {/* Honeypot Field (Hidden from humans, visible to bots) */}
          <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
            <input
              type="text"
              name="website"
              value={honeypotValue}
              onChange={(e) => setHoneypotValue(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </div>

          {/* Cloudflare Turnstile (Bot Protection) */}
          <div ref={turnstileContainerRef} className="flex justify-center"></div>

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
              disabled={isSubmitting || rateLimit.isBlocked || !turnstileToken}
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

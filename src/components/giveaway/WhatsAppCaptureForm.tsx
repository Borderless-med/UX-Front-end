import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackMetaEvent } from '@/utils/metaTracking';

interface WhatsAppCaptureFormProps {
  userId: string;
  userEmail?: string;
  onSuccess: () => void;
}

const COUNTRY_CODES = [
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

const WhatsAppCaptureForm: React.FC<WhatsAppCaptureFormProps> = ({
  userId,
  userEmail,
  onSuccess,
}) => {
  const [countryCode, setCountryCode] = useState('+65');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (number: string) => {
    // Remove spaces and non-digits
    const cleaned = number.replace(/\D/g, '');
    
    // Basic validation: must have at least 7 digits
    if (cleaned.length < 7) {
      return 'Phone number must be at least 7 digits';
    }
    
    // Singapore specific: 8 digits
    if (countryCode === '+65' && cleaned.length !== 8) {
      return 'Singapore numbers must be 8 digits';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validatePhone(whatsappNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const fullWhatsApp = `${countryCode} ${whatsappNumber}`;

      // Update user profile with WhatsApp number
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ whatsapp_number: fullWhatsApp })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Track Meta CompleteRegistration event
      trackMetaEvent(
        'CompleteRegistration',
        {
          content_name: 'Xiaomi Toothbrush Giveaway',
          content_category: 'Giveaway',
          value: 1.0,
          currency: 'SGD',
        },
        userEmail
          ? {
              em: userEmail,
              ph: fullWhatsApp.replace(/\s/g, ''),
              external_id: userId,
            }
          : undefined
      );

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save WhatsApp number');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Icon & Message */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success! Almost There</h2>
        <p className="text-gray-600">
          Where should we WhatsApp your lucky draw results?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* WhatsApp Number Input */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number *</Label>
          <div className="flex gap-2">
            {/* Country Code Selector */}
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={isLoading}
              className="w-28 h-11 px-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>

            {/* Phone Number Input */}
            <Input
              id="whatsapp"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(e.target.value);
                setError('');
              }}
              placeholder={countryCode === '+65' ? '8123 4567' : 'Phone number'}
              disabled={isLoading}
              className="flex-1 h-11"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500">
            We'll only use this to notify you if you win. Never shared with third parties.
          </p>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !whatsappNumber}
          className="w-full bg-blue-primary hover:bg-blue-dark h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Completing Entry...
            </>
          ) : (
            'Complete Entry'
          )}
        </Button>
      </form>
    </div>
  );
};

export default WhatsAppCaptureForm;

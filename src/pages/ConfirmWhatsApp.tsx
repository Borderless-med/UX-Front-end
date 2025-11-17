
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { restInvokeFunction } from '@/utils/restClient';
import { useToast } from '@/hooks/use-toast';

const ConfirmWhatsApp = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [userName, setUserName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const confirmOptIn = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('invalid');
        return;
      }

      try {
        const data = await restInvokeFunction('confirm-whatsapp-optin', {
          body: { token }
        }, {
          timeout: 10000,
          retries: 1
        });

        if (data?.success) {
          setStatus('success');
          setUserName(data.name || '');
          toast({
            title: "WhatsApp Opt-in Confirmed!",
            description: "You'll now receive WhatsApp updates from Orachope.",
          });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming opt-in:', error);
        setStatus('error');
        toast({
          title: "Confirmation Failed",
          description: "There was an error confirming your WhatsApp opt-in.",
          variant: "destructive",
        });
      }
    };

    confirmOptIn();
  }, [searchParams, toast]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="max-w-md mx-auto shadow-xl border-blue-light bg-white">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 text-blue-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-blue-dark mb-2">
                Confirming Your WhatsApp Opt-in
              </h2>
              <p className="text-neutral-gray">
                Please wait while we process your confirmation...
              </p>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="max-w-md mx-auto shadow-xl border-success-green bg-white">
            <CardContent className="p-8 text-center">
              <div className="bg-success-green/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success-green" />
              </div>
              <h2 className="text-2xl font-bold text-success-green mb-2">
                Confirmed!
              </h2>
              <p className="text-neutral-gray mb-4">
                {userName ? `Thank you, ${userName}! ` : 'Thank you! '}
                Your WhatsApp opt-in has been confirmed successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 font-medium">
                  You'll receive:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Appointment reminders</li>
                  <li>• New clinic announcements</li>
                  <li>• Platform updates</li>
                  <li>• Early access invitations</li>
                </ul>
                <p className="text-xs text-green-600 mt-2">
                  Max 4 messages per month • You can opt out anytime
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-primary hover:bg-blue-dark text-white"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="max-w-md mx-auto shadow-xl border-red-300 bg-white">
            <CardContent className="p-8 text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Confirmation Failed
              </h2>
              <p className="text-neutral-gray mb-6">
                This confirmation link may have expired or already been used.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/#booking'}
                  className="w-full bg-blue-primary hover:bg-blue-dark text-white"
                >
                  Book Appointment
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
                >
                  Return to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'invalid':
      default:
        return (
          <Card className="max-w-md mx-auto shadow-xl border-red-300 bg-white">
            <CardContent className="p-8 text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Invalid Link
              </h2>
              <p className="text-neutral-gray mb-6">
                This confirmation link is invalid or malformed.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-primary hover:bg-blue-dark text-white"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
              WhatsApp Confirmation
            </h1>
            <p className="text-lg text-neutral-gray">
              Confirming your opt-in for WhatsApp communications
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmWhatsApp;

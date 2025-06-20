
import { useState } from 'react';
import { Mail, Send, CheckCircle, User, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WaitlistSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim() || null
        });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Successfully Joined!",
        description: "You're now on our waitlist. We'll notify you when we launch.",
      });
    } catch (error) {
      console.error('Error submitting waitlist signup:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error joining the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-light">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-success-green bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-success-green/20 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-success-green" />
                </div>
                <h3 className="text-2xl font-bold text-success-green">You're All Set!</h3>
              </div>
              <p className="text-neutral-gray text-lg mb-6">
                Thank you for joining our waitlist. We'll send you updates as we get closer to launch.
              </p>
              <div className="bg-blue-light p-4 rounded-lg border border-blue-light">
                <p className="text-sm text-blue-primary font-medium">
                  Expected launch: August 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-light">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-blue-light bg-white">
          <CardHeader className="text-center pb-6">
            <div className="bg-blue-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-blue-dark mb-2">
              Join the Waitlist
            </CardTitle>
            <CardDescription className="text-lg text-neutral-gray">
              Be the first to know when we launch with exclusive early access to our platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full text-lg p-6 pl-12 border-2 border-blue-light bg-white text-blue-dark focus:border-blue-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full text-lg p-6 pl-12 border-2 border-blue-light bg-white text-blue-dark focus:border-blue-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number (optional)"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full text-lg p-6 pl-12 border-2 border-blue-light bg-white text-blue-dark focus:border-blue-primary"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-primary hover:bg-blue-accent text-white font-semibold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Join Waitlist
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 p-6 bg-blue-primary/20 rounded-lg border border-blue-primary/30">
              <h4 className="font-semibold text-blue-dark mb-3">What you'll get:</h4>
              <ul className="text-neutral-gray space-y-2">
                <li>✓ Early access to price comparisons</li>
                <li>✓ Priority booking with verified clinics</li>
                <li>✓ Exclusive launch offers and discounts</li>
                <li>✓ Updates on new clinic partnerships</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WaitlistSection;

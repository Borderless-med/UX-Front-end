
import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const WaitlistSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      toast({
        title: "Successfully Joined!",
        description: "You're now on our waitlist. We'll notify you when we launch.",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-success-green bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-success-green/20 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-success-green" />
                </div>
                <h3 className="text-2xl font-bold text-success-green">You're All Set!</h3>
              </div>
              <p className="text-text-gray text-lg mb-6">
                Thank you for joining our waitlist. We'll send you updates as we get closer to launch.
              </p>
              <div className="bg-light-card p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-teal-accent font-medium">
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
    <section id="waitlist" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-gray-200 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="bg-teal-accent/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-teal-accent" />
            </div>
            <CardTitle className="text-3xl font-bold text-text-dark mb-2">
              Join the Waitlist
            </CardTitle>
            <CardDescription className="text-lg text-text-gray">
              Be the first to know when we launch with exclusive early access to our platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-lg p-6 border-2 border-gray-200 bg-white text-text-dark focus:border-teal-accent"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-teal-accent hover:bg-teal-accent/80 text-white font-semibold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
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

            <div className="mt-8 p-6 bg-teal-accent/10 rounded-lg border border-teal-accent/30">
              <h4 className="font-semibold text-text-dark mb-3">What you'll get:</h4>
              <ul className="text-text-gray space-y-2">
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


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Building2, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface PartnerFormData {
  clinicName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationNumber: string;
  services: string;
  experience: string;
  whyJoin: string;
}

const PartnerApplication = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PartnerFormData>({
    defaultValues: {
      clinicName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      registrationNumber: '',
      services: '',
      experience: '',
      whyJoin: '',
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Partner application submitted:', data);
      setIsSubmitted(true);
      setIsLoading(false);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 5 business days.",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen font-inter bg-white text-gray-900">
        <Navigation />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-2 border-success-green bg-white shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-success-green/20 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-success-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-success-green">Application Submitted!</h3>
                </div>
                <p className="text-neutral-gray text-lg mb-6">
                  Thank you for your interest in partnering with us. We'll review your application and contact you within 5 business days.
                </p>
                <div className="bg-blue-light p-4 rounded-lg border border-blue-light mb-6">
                  <p className="text-sm text-blue-primary font-medium">
                    Next steps: Our team will verify your clinic credentials and reach out to discuss partnership details.
                  </p>
                </div>
                <Link to="/">
                  <Button className="bg-blue-primary hover:bg-blue-accent text-white">
                    Return to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-primary hover:text-blue-accent transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="shadow-xl border-blue-light bg-white">
            <CardHeader className="text-center pb-6">
              <div className="bg-[#FF6F61]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-[#FF6F61]" />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-dark mb-2">
                Partner with SG-JB Dental
              </CardTitle>
              <CardDescription className="text-lg text-neutral-gray">
                Join our network of trusted dental clinics and connect with Singapore patients seeking quality, affordable care
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clinicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinic Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Dental Clinic" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person *</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. John Smith" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="clinic@example.com" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+60 12 345 6789" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinic Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Medical Center, Johor Bahru" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Johor Bahru" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MDC Registration Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="MDC123456" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services Offered *</FormLabel>
                        <FormControl>
                          <Input placeholder="General Dentistry, Orthodontics, Dental Implants, etc." {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience *</FormLabel>
                        <FormControl>
                          <Input placeholder="10 years" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyJoin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to join our network? *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tell us about your motivation to serve Singapore patients..." {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white font-semibold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Submit Partnership Application
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 p-6 bg-blue-primary/20 rounded-lg border border-blue-primary/30">
                <h4 className="font-semibold text-blue-dark mb-3">Partnership Benefits:</h4>
                <ul className="text-neutral-gray space-y-2">
                  <li>✓ Access to Singapore's dental tourism market</li>
                  <li>✓ Dedicated marketing support and promotion</li>
                  <li>✓ Patient referral system with booking management</li>
                  <li>✓ Transparent pricing platform</li>
                  <li>✓ Quality assurance and patient review system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerApplication;

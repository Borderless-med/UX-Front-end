
import { MapPin, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center animate-fade-in">
          {/* Hero Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Save on Quality{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Dental Care
            </span>
          </h1>
          
          <p className="text-xl text-neutral-gray mb-8 max-w-2xl mx-auto leading-relaxed">
            Compare dental treatment costs between Singapore and Johor Bahru. 
            Find quality care at affordable prices just across the border.
          </p>

          {/* Trust Badge */}
          <Card className="inline-block p-6 mb-8 border-2 border-blue-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">23 Clinics in Verification</h3>
                <div className="flex items-center gap-2 text-neutral-gray">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Launching August 2025</span>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Button */}
          <div className="mb-12">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-cta-red hover:bg-red-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Location Indicators */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-neutral-gray">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Singapore</span>
            </div>
            <div className="hidden sm:block w-12 h-px bg-neutral-gray opacity-30"></div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-medium">Johor Bahru</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

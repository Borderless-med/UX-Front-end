
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HeroSection = () => {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const element = document.getElementById('compare');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-light to-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center animate-fade-in">
          {/* Hero Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-blue-dark mb-6 leading-tight">
            Join 1,200+ Smart Savers
          </h1>
          
          <p className="text-xl text-neutral-gray mb-8 max-w-2xl mx-auto leading-relaxed">
            Sign up before August 30 for Priority Clinic Matching
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-blue-primary hover:bg-blue-accent text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Early Access
            </Button>
            <Button 
              onClick={scrollToCalculator}
              variant="outline"
              className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Calculate Potential Savings
            </Button>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-center mb-12">
            <div className="text-blue-dark">
              <div className="text-3xl font-bold text-blue-primary mb-1">23/100</div>
              <div className="text-sm text-neutral-gray">Clinics Verified</div>
            </div>
            <div className="text-blue-dark">
              <div className="text-3xl font-bold text-success-green mb-1">✓</div>
              <div className="text-sm text-neutral-gray">Transparent Pricing Guarantee</div>
            </div>
            <div className="text-blue-dark">
              <div className="text-3xl font-bold text-blue-primary mb-1">AI</div>
              <div className="text-sm text-neutral-gray">Verified Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { Button } from '@/components/ui/button';

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
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-accent/10 to-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center animate-fade-in">
          {/* Hero Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6 leading-tight">
            Join 1,200+ Smart Savers
          </h1>
          
          <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto leading-relaxed">
            Sign up before August 30 for Priority Clinic Matching
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-teal-accent hover:bg-teal-accent/80 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Early Access
            </Button>
            <Button 
              onClick={scrollToCalculator}
              variant="outline"
              className="border-teal-accent text-teal-accent hover:bg-teal-accent hover:text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Calculate Potential Savings
            </Button>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-center mb-12">
            <div className="text-text-dark">
              <div className="text-3xl font-bold text-teal-accent mb-1">23/100</div>
              <div className="text-sm text-text-gray">Clinics Verified</div>
            </div>
            <div className="text-text-dark">
              <div className="text-3xl font-bold text-success-green mb-1">✓</div>
              <div className="text-sm text-text-gray">Transparent Pricing Guarantee</div>
            </div>
            <div className="text-text-dark">
              <div className="text-3xl font-bold text-teal-accent mb-1">AI</div>
              <div className="text-sm text-text-gray">Verified Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-primary">SG-JB Dental</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('compare')}
                className="text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Compare Prices
              </button>
              <button
                onClick={() => scrollToSection('clinics')}
                className="text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Clinics
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('waitlist')}
              className="bg-cta-red hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-gray hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('compare')}
                className="block w-full text-left px-3 py-2 text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Compare Prices
              </button>
              <button
                onClick={() => scrollToSection('clinics')}
                className="block w-full text-left px-3 py-2 text-neutral-gray hover:text-primary transition-colors duration-200 font-medium"
              >
                Clinics
              </button>
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="w-full bg-cta-red hover:bg-red-700 text-white font-medium mt-4"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

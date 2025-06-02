
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
    <nav className="fixed top-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-teal-accent">SG-JB Dental</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('compare')}
                className="text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Compare Prices
              </button>
              <button
                onClick={() => scrollToSection('clinics')}
                className="text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Find Clinics
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('qa')}
                className="text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Q&A
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('waitlist')}
              className="bg-teal-accent hover:bg-teal-accent/80 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Get Early Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-teal-accent"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-bg border-t border-gray-700">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('compare')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Compare Prices
              </button>
              <button
                onClick={() => scrollToSection('clinics')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Find Clinics
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('qa')}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-teal-accent transition-colors duration-200 font-medium"
              >
                Q&A
              </button>
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="w-full bg-teal-accent hover:bg-teal-accent/80 text-white font-medium mt-4"
              >
                Get Early Access
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

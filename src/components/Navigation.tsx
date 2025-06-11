
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToWaitlist = () => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = '/#waitlist';
    } else {
      scrollToSection('waitlist');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-teal-accent">SG-JB Dental</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === '/' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Home
              </Link>
              <Link
                to="/compare"
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === '/compare' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Compare Prices
              </Link>
              <Link
                to="/clinics"
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === '/clinics' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Find Clinics
              </Link>
              <Link
                to="/how-it-works"
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === '/how-it-works' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/qa"
                className={`transition-colors duration-200 font-medium ${
                  location.pathname === '/qa' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Q&A
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-teal-accent hover:bg-teal-accent/80 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Get Early Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-gray hover:text-teal-accent"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 font-medium ${
                  location.pathname === '/' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Home
              </Link>
              <Link
                to="/compare"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 font-medium ${
                  location.pathname === '/compare' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Compare Prices
              </Link>
              <Link
                to="/clinics"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 font-medium ${
                  location.pathname === '/clinics' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Find Clinics
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 font-medium ${
                  location.pathname === '/how-it-works' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/qa"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 font-medium ${
                  location.pathname === '/qa' ? 'text-teal-accent' : 'text-text-gray hover:text-teal-accent'
                }`}
              >
                Q&A
              </Link>
              <Button 
                onClick={scrollToWaitlist}
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

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
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-blue-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo - Vertical Stack */}
          <div className="flex-shrink-0 flex flex-col items-start py-6">
            <Link to="/" className="text-xl font-bold text-blue-primary leading-tight mb-3">SG-JB Dental</Link>
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-600 font-medium leading-tight mb-2">powered by</span>
              <img 
                src="/lovable-uploads/70a8431a-ea7f-4c3b-b1f1-b7470603db93.png" 
                alt="TrustMedAI" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                Home
              </Link>
              <Link
                to="/compare"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/compare' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                Compare Prices
              </Link>
              <Link
                to="/clinics"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/clinics' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                Find Clinics
              </Link>
              <Link
                to="/how-it-works"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/how-it-works' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/qa"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/qa' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                Q&A
              </Link>
              
              {/* Partner with Us Button */}
              <button className="border-2 border-[#FF6F61] text-[#FF6F61] font-medium px-4 py-2 rounded-lg transition-colors duration-200 hover:border-white hover:text-white hover:bg-[#FF6F61]">
                Partner with Us
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-blue-primary hover:bg-blue-accent text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Get Early Access
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-dark hover:text-blue-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-blue-light">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/compare"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/compare' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                Compare Prices
              </Link>
              <Link
                to="/clinics"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/clinics' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                Find Clinics
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/how-it-works' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/qa"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/qa' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                Q&A
              </Link>
              
              {/* Partner with Us Button - Mobile */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left border-2 border-[#FF6F61] text-[#FF6F61] font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:border-white hover:text-white hover:bg-[#FF6F61] mt-2"
              >
                Partner with Us
              </button>
              
              <Button 
                onClick={scrollToWaitlist}
                className="w-full bg-blue-primary hover:bg-blue-accent text-white font-medium mt-4"
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

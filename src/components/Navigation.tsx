
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import NavigationAuthButton from '@/components/NavigationAuthButton';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();
  
  console.log('[Navigation] Component rendered - Auth State:', { user: !!user, isLoading, isAuthModalOpen });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navigateToBooking = () => {
    // Always navigate to the separate booking page
    window.location.href = '/book-now';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-blue-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-32 md:h-36">
          {/* Brand Stack: OraChope on top, small powered-by, CuraSphereLab at bottom */}
          <div className="flex-shrink-0 flex flex-col items-start justify-start pt-0 pb-2 pr-4 md:pr-8 leading-tight w-60 md:w-72 lg:w-80">
            <Link to="/" aria-label="OraChope.org home" className="inline-flex items-center">
              {/* OraChope box width retained; ensure left alignment */}
              <div className="w-44 md:w-52 mb-0.5 self-start">
                <img
                  src="/orachope.png"
                  alt="OraChope.org"
                  className="h-24 md:h-28 w-full object-contain object-left drop-shadow-sm"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/orachope-logo.svg'; }}
                />
              </div>
            </Link>
            <span className="block mt-0 mb-2 text-[10px] md:text-[10px] text-gray-500 opacity-60">powered by</span>
            {/* Replace logo with plain text to match header tabs */}
            <div className="mt-0 self-start mb-2">
              <span className="text-blue-dark text-base md:text-lg font-medium leading-none select-none">
                Curasphere Labs
              </span>
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
                to="/compare"
                className={`transition-all duration-200 font-medium ${
                  location.pathname === '/compare' 
                    ? 'text-blue-primary text-xl font-bold scale-110 transform shadow-sm px-3 py-2 bg-blue-primary/10 rounded-lg' 
                    : 'text-blue-dark hover:text-blue-primary text-base'
                }`}
              >
                Compare
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
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/partner-application"
              className="bg-blue-accent hover:bg-blue-primary text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 h-10 flex items-center"
            >
              Partner Us
            </Link>
            <Button 
              onClick={navigateToBooking}
              className="bg-blue-primary hover:bg-blue-accent text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 h-10"
            >
              Book Now
            </Button>
            <NavigationAuthButton onAuthClick={() => {
              console.log('[Navigation] Auth button clicked - opening modal');
              setIsAuthModalOpen(true);
            }} />
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
                to="/compare"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 transition-all duration-200 font-medium rounded-lg ${
                  location.pathname === '/compare' 
                    ? 'text-blue-primary text-lg font-bold bg-blue-primary/10' 
                    : 'text-blue-dark hover:text-blue-primary'
                }`}
              >
                Compare
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
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-3">
                <Link 
                  to="/partner-application"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-blue-accent hover:bg-blue-primary text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 block text-center h-10 flex items-center justify-center"
                >
                  Partner Us
                </Link>
                
                <Button 
                  onClick={navigateToBooking}
                  className="w-full bg-blue-primary hover:bg-blue-accent text-white font-medium px-5 py-2.5 h-10"
                >
                  Book Now
                </Button>
                
                <div className="w-full">
                  <NavigationAuthButton onAuthClick={() => {
                    console.log('[Navigation] Mobile auth button clicked - opening modal');
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          console.log('[Navigation] Modal closing');
          setIsAuthModalOpen(false);
        }} 
      />
    </nav>
  );
};

export default Navigation;


import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const Footer = () => {
  const { setShowPreferences } = useCookieConsent();

  const handleCookiePolicyClick = () => {
    console.log('Cookie Policy link clicked in footer');
  };

  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* New Clinic Partners Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Clinic Partners</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li>• Access Singapore patients</li>
                <li>• Exclusive marketing support</li>
              </ul>
            </div>
            
            <div className="flex items-start">
              <Link to="/partner-application">
                <Button
                  variant="outline"
                  className="bg-transparent border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white transition-colors"
                >
                  Apply as Clinic
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <img
                  src="/orachope.png"
                  alt="OraChope.org"
                  className="h-10 sm:h-12 w-auto"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/orachope-logo.svg'; }}
                />
              </div>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Connecting Singapore patients to quality, affordable dental care across the causeway
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-sm sm:text-base text-gray-600">powered by</span>
                <span className="text-blue-dark text-base sm:text-lg font-medium">Curasphere Labs</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">Home</Link></li>
                <li><Link to="/compare" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">Compare Prices</Link></li>
                <li><Link to="/clinics" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">Find Clinics</Link></li>
                <li><Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">How It Works</Link></li>
                <li><Link to="/qa" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">Q&A</Link></li>
                <li><Link to="/medical-disclaimer" className="text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base py-1 block">Medical Disclaimer</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Directory Information</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm sm:text-base">• Directory Listings</li>
                <li className="text-gray-600 text-sm sm:text-base">• Information Collection</li>
                <li className="text-gray-600 text-sm sm:text-base">• Transparent Pricing</li>
                <li className="text-gray-600 text-sm sm:text-base">• Patient Reviews Available</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                Ready to save 50-70% on quality dental care?
              </p>
            </div>
            
            <div className="text-sm text-gray-500 text-center mb-4">
              © 2024 Orachope. Launching August 2025.
            </div>
            
            {/* Legal Links Section - Enhanced with Cookie Management */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-1 text-sm text-gray-600">
              <Link to="/directory-disclaimer" className="hover:text-blue-600 transition-colors px-2 py-1">
                Directory Disclaimer
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/medical-disclaimer" className="hover:text-blue-600 transition-colors px-2 py-1">
                Medical Disclaimer
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors px-2 py-1">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors px-2 py-1">
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link 
                to="/cookie-policy" 
                onClick={handleCookiePolicyClick}
                className="hover:text-blue-600 transition-colors px-2 py-1"
              >
                Cookie Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <button 
                onClick={() => {
                  console.log('Manage Cookies button clicked');
                  setShowPreferences(true);
                }}
                className="hover:text-blue-600 transition-colors px-2 py-1 font-medium text-blue-600 hover:text-blue-700"
              >
                Manage Cookies
              </button>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link 
                to="/opt-out-report" 
                className="hover:text-blue-600 transition-colors px-2 py-1 font-medium text-orange-600 hover:text-orange-700"
              >
                Opt-out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

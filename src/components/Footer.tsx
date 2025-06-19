
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">SG-JB Dental</span>
              </div>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Connecting Singapore patients to quality, affordable dental care across the causeway
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-base sm:text-lg text-gray-700 font-bold">Powered by</span>
                <img 
                  src="/lovable-uploads/70a8431a-ea7f-4c3b-b1f1-b7470603db93.png" 
                  alt="TrustMedAI" 
                  className="h-8 sm:h-10 w-auto"
                />
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
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Trust & Safety</h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm sm:text-base">✓ MDC Registered Clinics</li>
                <li className="text-gray-600 text-sm sm:text-base">✓ International Standards</li>
                <li className="text-gray-600 text-sm sm:text-base">✓ Transparent Pricing</li>
                <li className="text-gray-600 text-sm sm:text-base">✓ Patient Reviews Verified</li>
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
              © 2024 SG-JB Dental. Launching August 2025.
            </div>
            
            {/* Legal Links Section */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-1 text-sm text-gray-600">
              <Link to="/directory-disclaimer" className="hover:text-blue-600 transition-colors px-2 py-1">
                Directory Disclaimer
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors px-2 py-1">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors px-2 py-1">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="text-lg sm:text-xl font-bold text-blue-600 italic">SG-JB Dental</span>
            </div>
            <p className="text-gray-600 mb-6 sm:mb-8 text-xs sm:text-sm italic">
              Connecting Singapore patients to quality, affordable dental care across the causeway
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm sm:text-base text-gray-700 font-bold italic">Powered by</span>
              <img 
                src="/lovable-uploads/70a8431a-ea7f-4c3b-b1f1-b7470603db93.png" 
                alt="TrustMedAI" 
                className="h-8 sm:h-10 w-auto"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base italic">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm py-1 block italic">Home</a></li>
              <li><a href="/compare" className="text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm py-1 block italic">Compare Prices</a></li>
              <li><a href="/clinics" className="text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm py-1 block italic">Find Clinics</a></li>
              <li><a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm py-1 block italic">How It Works</a></li>
              <li><a href="/qa" className="text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm py-1 block italic">Q&A</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base italic">Trust & Safety</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-xs sm:text-sm italic">✓ MDC Registered Clinics</li>
              <li className="text-gray-600 text-xs sm:text-sm italic">✓ International Standards</li>
              <li className="text-gray-600 text-xs sm:text-sm italic">✓ Transparent Pricing</li>
              <li className="text-gray-600 text-xs sm:text-sm italic">✓ Patient Reviews Verified</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-gray-600 mb-2 text-xs sm:text-sm italic">
              Ready to save 50-70% on quality dental care?
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-xs text-gray-500 text-center italic">
              © 2024 SG-JB Dental. Launching August 2025. | Privacy Policy | Terms of Service
            </div>
            
            <div className="text-xs leading-relaxed text-gray-500 italic">
              <p className="mb-2">
                <strong>DIRECTORY DISCLAIMER:</strong> The information provided on SG Smile Saver regarding dental clinics in Johor Bahru is compiled from publicly available sources for informational purposes only. We make no representation or warranty regarding the accuracy, completeness, or currency of this information. Listing of a dental clinic on this platform does not imply any business relationship, partnership, or endorsement between SG Smile Saver and the listed clinic. We have not verified the credentials, qualifications, or services of these clinics. Users are advised to conduct their own due diligence and directly contact clinics to verify all information before making any decisions. SG Smile Saver is not responsible for any outcomes resulting from interactions between users and listed clinics. Clinic owners who wish to update their information or have their listing removed may contact us at [your contact information].
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

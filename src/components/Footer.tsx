
const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-blue-600">SG-JB Dental</span>
            </div>
            <p className="text-gray-600 mb-8">
              Connecting Singapore patients to quality, affordable dental care across the causeway
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-700 font-bold">Powered by</span>
              <img 
                src="/lovable-uploads/70a8431a-ea7f-4c3b-b1f1-b7470603db93.png" 
                alt="TrustMedAI" 
                className="h-10 w-auto"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="/compare" className="text-gray-600 hover:text-blue-600 transition-colors">Compare Prices</a></li>
              <li><a href="/clinics" className="text-gray-600 hover:text-blue-600 transition-colors">Find Clinics</a></li>
              <li><a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a></li>
              <li><a href="/qa" className="text-gray-600 hover:text-blue-600 transition-colors">Q&A</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Trust & Safety</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">✓ MDC Registered Clinics</li>
              <li className="text-gray-600">✓ International Standards</li>
              <li className="text-gray-600">✓ Transparent Pricing</li>
              <li className="text-gray-600">✓ Patient Reviews Verified</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Ready to save 50-70% on quality dental care?
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center">
              © 2024 SG-JB Dental. Launching August 2025. | Privacy Policy | Terms of Service
            </div>
            
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                <strong>Disclaimer:</strong> SG-JB Dental is a platform connecting patients to dental clinics and does not provide medical advice or treatment. All pricing information is indicative and subject to change. Patients are advised to verify all details directly with clinics. We do not guarantee treatment outcomes or clinic availability. Cross-border medical travel involves additional considerations including immigration requirements, travel insurance, and potential complications. Consult with healthcare professionals before making treatment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

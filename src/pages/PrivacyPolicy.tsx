
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-gray leading-relaxed mb-6">
              Orachope Privacy Policy: We are committed to protecting your personal data in accordance with Singapore's Personal Data Protection Act (PDPA) and Malaysia's data protection regulations. We collect only essential information necessary to connect you with verified dental clinics in Johor Bahru, including your contact details, dental preferences, and appointment information. Your data is used solely to facilitate clinic referrals, improve our platform services, and communicate important updates about your dental care journey. We implement robust security measures to protect your information and will never sell your personal data to third parties. You have the right to access, correct, or request deletion of your personal data at any time by contacting our Data Protection Officer. For cross-border data transfers between Singapore and Malaysia, we ensure adequate protection measures are in place to safeguard your information.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

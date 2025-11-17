
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-gray leading-relaxed mb-6">
              Orachope Terms of Service: By using our platform, you agree to these terms which govern your access to our dental clinic directory and referral services connecting Singapore residents with Johor Bahru dental providers. Our platform serves as an information directory and referral service only - we do not provide direct medical or dental services. Users must be at least 18 years old or have parental consent, and are responsible for verifying all clinic information directly before making appointments. You agree not to misuse our platform through spam, false information, or attempts to circumvent our systems. While we strive to maintain accurate clinic information, we disclaim liability for any outcomes resulting from your interactions with listed dental providers. We reserve the right to suspend or terminate accounts that violate these terms, and any disputes will be resolved under Singapore law. These terms may be updated periodically, and continued use of our platform constitutes acceptance of any changes.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;

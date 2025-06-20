
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import PartnerForm from '@/components/partner/PartnerForm';
import SubmissionSuccess from '@/components/partner/SubmissionSuccess';
import PartnerBenefits from '@/components/partner/PartnerBenefits';
import PartnerApplicationHeader from '@/components/partner/PartnerApplicationHeader';

const PartnerApplication = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmissionSuccess = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen font-inter bg-white text-gray-900">
        <Navigation />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <SubmissionSuccess />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-primary hover:text-blue-accent transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="shadow-xl border-blue-light bg-white">
            <PartnerApplicationHeader />
            
            <CardContent>
              <PartnerForm onSubmissionSuccess={handleSubmissionSuccess} />
              <PartnerBenefits />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerApplication;

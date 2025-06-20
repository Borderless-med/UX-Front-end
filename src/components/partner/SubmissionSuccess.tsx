
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SubmissionSuccess = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card className="border-2 border-success-green bg-white shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-success-green/20 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-success-green" />
            </div>
            <h3 className="text-2xl font-bold text-success-green">Application Submitted!</h3>
          </div>
          <p className="text-neutral-gray text-lg mb-6">
            Thank you for your interest in partnering with us. We'll review your application and contact you within 5 business days.
          </p>
          <div className="bg-blue-light p-4 rounded-lg border border-blue-light mb-6">
            <p className="text-sm text-blue-primary font-medium">
              Next steps: Our team will verify your clinic credentials and reach out to discuss partnership details.
            </p>
          </div>
          <Link to="/">
            <Button className="bg-blue-primary hover:bg-blue-accent text-white">
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionSuccess;

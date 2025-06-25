
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OptOutReportForm from '@/components/OptOutReportForm';

const OptOutReport = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
              Clinic Opt-Out & Issue Reporting
            </h1>
            <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
              Submit a request to remove your clinic listing or report any issues with directory information
            </p>
          </div>
          <OptOutReportForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OptOutReport;


import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const DirectoryDisclaimer = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-8">
            Directory Disclaimer
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-neutral-gray leading-relaxed space-y-6">
              <p>
                <strong>DIRECTORY DISCLAIMER:</strong> The information provided on SG Smile Saver regarding dental clinics in Johor Bahru is compiled from publicly available sources for informational purposes only. We make no representation or warranty regarding the accuracy, completeness, or currency of this information.
              </p>
              <p>
                Listing of a dental clinic on this platform does not imply any business relationship, partnership, or endorsement between SG Smile Saver and the listed clinic. We have not verified the credentials, qualifications, or services of these clinics.
              </p>
              <p>
                Users are advised to conduct their own due diligence and directly contact clinics to verify all information before making any decisions. SG Smile Saver is not responsible for any outcomes resulting from interactions between users and listed clinics.
              </p>
              <p>
                Clinic owners who wish to update their information or have their listing removed may contact us at [your contact information].
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DirectoryDisclaimer;

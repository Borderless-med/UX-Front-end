
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, Contact } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DirectoryDisclaimer = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Directory Disclaimer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Important information about the dental clinic listings on our platform
            </p>
          </div>
          
          {/* Primary Alert */}
          <Alert className="mb-10 bg-blue-50/80 border-blue-200 shadow-sm">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800 leading-relaxed text-base">
              <strong>Directory Disclaimer:</strong> The information provided regarding dental clinics in Johor Bahru 
              is compiled from publicly available sources for informational purposes only.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Information Sources */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Information Sources and Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  The information provided on SG-JB Dental regarding dental clinics in Johor Bahru is compiled 
                  from publicly available sources for informational purposes only. We make no representation 
                  or warranty regarding the accuracy, completeness, or currency of this information.
                </p>
                <p>
                  Clinic details, pricing, services offered, and practitioner information are subject to change 
                  without notice. Users should verify all information directly with the respective clinics before 
                  making any decisions or appointments.
                </p>
              </CardContent>
            </Card>

            {/* No Endorsement */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">No Endorsement or Business Relationship</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Listing of a dental clinic on this platform does not imply any business relationship, 
                  partnership, or endorsement between SG-JB Dental and the listed clinic. We have not 
                  verified the credentials, qualifications, or services of these clinics.
                </p>
                <p>
                  The inclusion of any clinic in our directory does not constitute a recommendation 
                  or guarantee of quality, safety, or suitability of their services. Users must conduct 
                  their own due diligence when selecting healthcare providers.
                </p>
              </CardContent>
            </Card>

            {/* User Responsibility */}
            <Card className="shadow-sm border-amber-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">User Responsibility and Due Diligence</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Users are advised to conduct their own due diligence and directly contact clinics 
                  to verify all information before making any decisions. SG-JB Dental is not responsible 
                  for any outcomes resulting from interactions between users and listed clinics.
                </p>
                <div className="bg-amber-50 rounded-lg p-4 my-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Before visiting any clinic, please verify:</h4>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Practitioner credentials and licensing status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Current pricing and available services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Clinic operating hours and appointment availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Insurance acceptance and payment policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>COVID-19 safety protocols and requirements</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact for Updates */}
            <Card className="shadow-sm border-green-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <Contact className="h-6 w-6 text-green-600" />
                  Information Updates and Corrections
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  We strive to maintain accurate and current information in our directory. If you are a 
                  clinic owner or representative and notice incorrect information, or if you wish to update 
                  your listing or have it removed, please contact us through our official channels.
                </p>
                <p>
                  Patients who notice discrepancies between our directory information and actual clinic 
                  details are also encouraged to report these issues so we can maintain the integrity 
                  of our platform.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DirectoryDisclaimer;

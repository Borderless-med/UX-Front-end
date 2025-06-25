
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AlertTriangle, Shield, Phone, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MedicalDisclaimer = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Medical Disclaimer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Important information about the use of this platform and healthcare-related content
            </p>
          </div>
          
          {/* Primary Disclaimer Alert */}
          <Alert className="mb-10 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 text-lg font-semibold mb-3">Important Medical Disclaimer</AlertTitle>
            <AlertDescription className="text-amber-800 leading-relaxed">
              This platform provides general information only and does not constitute dental advice. 
              No professional relationship is created with listed practitioners.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* No Medical Advice */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  No Medical or Dental Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  The information provided on SG-JB Dental is for general informational purposes only. 
                  It is not intended as medical or dental advice, diagnosis, or treatment. Always seek 
                  the advice of qualified dental professionals regarding any dental condition or treatment.
                </p>
                <p>
                  Individual dental needs vary significantly. What works for one patient may not be 
                  appropriate for another. Only a qualified dental practitioner can provide personalized 
                  treatment recommendations based on your specific oral health condition.
                </p>
              </CardContent>
            </Card>

            {/* No Professional Relationship */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">No Professional Relationship Created</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Listing dental clinics on our platform does not establish any professional relationship 
                  between SG-JB Dental and the listed practitioners. We do not endorse, recommend, or 
                  guarantee the services of any listed clinic or practitioner.
                </p>
                <p>
                  Use of this platform does not create a dentist-patient relationship between you and 
                  any listed practitioners. Such relationships can only be established through direct 
                  consultation and examination by qualified dental professionals.
                </p>
              </CardContent>
            </Card>

            {/* Information Accuracy */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Information Accuracy and Currency</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  While we strive to provide accurate and up-to-date information, we make no representations 
                  or warranties regarding the accuracy, completeness, or currency of the information provided. 
                  Clinic details, pricing, and availability are subject to change without notice.
                </p>
                <p>
                  Users are strongly advised to verify all information directly with the dental clinics 
                  before making any treatment decisions or appointments. This includes confirming practitioner 
                  credentials, treatment costs, and clinic policies.
                </p>
              </CardContent>
            </Card>

            {/* Emergency Situations */}
            <Card className="shadow-sm border-red-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  <Phone className="h-6 w-6 text-red-600" />
                  Dental Emergencies
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <Alert className="bg-red-50/80 border-red-200 mb-4">
                  <Clock className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 leading-relaxed">
                    <strong>In case of dental emergencies:</strong> Do not rely on this platform for urgent care. 
                    Contact emergency dental services or visit the nearest hospital emergency department immediately.
                  </AlertDescription>
                </Alert>
                <p>
                  Dental emergencies include severe tooth pain, knocked-out teeth, excessive bleeding, 
                  facial swelling, or trauma to the mouth or jaw. These conditions require immediate 
                  professional attention and should not be delayed.
                </p>
              </CardContent>
            </Card>

            {/* Cross-Border Considerations */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Cross-Border Healthcare Considerations</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Seeking dental care across international borders involves additional considerations including:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 my-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Different regulatory standards and licensing requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Varying treatment protocols and standards of care</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Insurance coverage limitations for overseas treatment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Follow-up care coordination challenges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Legal recourse limitations in case of complications</span>
                    </li>
                  </ul>
                </div>
                <p>
                  Consult with your Singapore dental practitioner before seeking treatment abroad. 
                  Ensure you understand the implications and have appropriate arrangements for follow-up care.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="shadow-sm border-gray-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  SG-JB Dental disclaims all liability for any outcomes resulting from the use of information 
                  provided on this platform or from interactions with listed dental practitioners. Users 
                  assume full responsibility for their healthcare decisions.
                </p>
                <p>
                  We are not responsible for the quality of care, treatment outcomes, or any complications 
                  that may arise from treatments received at listed clinics. All treatment decisions and 
                  their consequences remain between the patient and their chosen dental practitioner.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm border-blue-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Questions or Concerns</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">
                <p>
                  If you have questions about this medical disclaimer or concerns about information 
                  provided on our platform, please contact us through our official channels. For 
                  medical advice or treatment recommendations, consult qualified dental professionals.
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

export default MedicalDisclaimer;

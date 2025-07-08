
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import TestClinicSignupForm from '@/components/TestClinicSignupForm';

const TestClinicSignup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-dark mb-4">
              Test Clinic Signup
            </h1>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
              Use this form to test the Supabase backend integration. 
              Data will be saved to the user_profiles table for verification.
            </p>
          </div>

          <div className="flex justify-center">
            <TestClinicSignupForm />
          </div>

          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Fill out the form with test data</li>
              <li>Submit the form</li>
              <li>Check your Supabase dashboard:</li>
              <ul className="ml-4 mt-1 space-y-1 list-disc list-inside text-xs">
                <li>Go to Authentication → Users (verify email/password)</li>
                <li>Go to Database → user_profiles table</li>
                <li>Verify: organization = clinic_name, purpose_of_use = clinic_role</li>
                <li>Verify: user_category = 'clinic_admin'</li>
              </ul>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestClinicSignup;

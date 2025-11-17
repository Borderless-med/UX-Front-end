import React from 'react';

// Use your existing logo, color scheme, and design system
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePrototype: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar (No Change) */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SG-JB Dental Logo" className="h-8" />
          <span className="font-bold text-lg text-blue-700">SG-JB Dental</span>
        </div>
        <nav className="flex gap-6 text-gray-700">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/compare" className="hover:text-blue-600">Compare Clinics</a>
          <a href="/how-it-works" className="hover:text-blue-600">How It Works</a>
          <a href="/partner" className="hover:text-blue-600">Partner with Us</a>
          <a href="/book-now" className="hover:text-blue-600">Book Now</a>
        </nav>
        <div>
          <img src="/gsp-icon.png" alt="GSP Icon" className="h-6" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">Your Smartest Dental Decision Starts Here.</h1>
        <p className="text-lg text-center text-gray-700 mb-6 max-w-xl">Transparently compare top-rated dental clinics in Singapore and Johor Bahru. You set the priorities, we provide the data.</p>
        <Button className="px-6 py-3 text-lg">Find Your Perfect Clinic</Button>
      </section>

      {/* Core Choice Section */}
      <section className="flex flex-col md:flex-row gap-6 justify-center py-10 bg-white">
        <div className="flex-1">
          <Card className="border-blue-500 border-2 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📍</span>
              <span className="text-lg font-semibold text-blue-700">Maximize Your Savings in JB</span>
            </div>
            <p className="mb-2 text-gray-700">Perfect for: Cost-conscious patients seeking the best value.</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>✅ Save 50-70% on major treatments</li>
              <li>✅ Access world-class, verified clinics</li>
              <li>✅ AI-powered travel & booking assistance</li>
            </ul>
            <Button className="w-full">Explore JB Clinics</Button>
          </Card>
        </div>
        <div className="flex-1">
          <Card className="border-gray-400 border-2 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🇸🇬</span>
              <span className="text-lg font-semibold text-gray-700">Prioritize Convenience in Singapore</span>
            </div>
            <p className="mb-2 text-gray-700">Perfect for: Those who prefer local, trusted care with no travel.</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>✅ Ultimate convenience, no travel needed</li>
              <li>✅ Find MOH-accredited local dentists</li>
              <li>✅ Seamless follow-up appointments</li>
            </ul>
            <Button className="w-full">Explore SG Clinics</Button>
          </Card>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="py-12 bg-blue-50 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Go Beyond Search. Get Answers with Our AI Concierge.</h2>
        <div className="mb-6 w-full max-w-2xl flex flex-col items-center">
          <div className="bg-white rounded-lg shadow p-6 mb-4 w-full">
            {/* Placeholder for chatbot GIF/video */}
            <div className="h-32 bg-gray-200 flex items-center justify-center rounded mb-4">
              <span className="text-gray-500">[Chatbot Demo GIF/Video Here]</span>
            </div>
            <p className="text-lg text-gray-700 mb-2">Stop guessing. Our intelligent assistant has analyzed 500+ real patient reviews to give you the clear, unbiased answers you need to make the right choice.</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>✅ Unbiased Recommendations</li>
              <li>✅ Save Time & Money</li>
              <li>✅ 24/7 Expert Access</li>
            </ul>
            <Button className="w-full text-lg">Sign Up & Ask Our AI for FREE</Button>
            <p className="text-xs text-gray-500 mt-2">Get 3 free conversations to start. No credit card needed.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-10 bg-white flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Trusted by Singaporeans for Every Need</h3>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
          <Card className="p-6 flex-1">
            <p className="text-gray-700 mb-2">"Saved $3,200 on my dental implants compared to Singapore prices. The quality was exceptional, and the AI concierge made planning the trip from Woodlands a breeze."</p>
            <span className="text-sm text-gray-500">— Linda Wong, Woodlands</span>
          </Card>
          <Card className="p-6 flex-1">
            <p className="text-gray-700 mb-2">"The platform laid out all my options clearly. I chose a Singapore clinic for convenience and peace of mind. The transparency was fantastic!"</p>
            <span className="text-sm text-gray-500">— David Tan, Bishan</span>
          </Card>
        </div>
      </section>

      {/* Final CTA & Footer */}
      <section className="py-8 bg-blue-50 flex flex-col items-center">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Ready to Find Your Perfect Dentist?</h4>
        <div className="flex gap-4">
          <Button className="px-6">Compare Clinics Now</Button>
          <Button className="px-6">Chat with AI Expert</Button>
        </div>
      </section>
      <footer className="bg-white py-6 mt-auto text-center text-gray-500 text-sm">
        About | Contact | Privacy | Medical Disclaimer
      </footer>

      {/* Persistent AI Widget (static, non-functional) */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="bg-blue-600 text-white rounded-full shadow-lg flex items-center px-4 py-2 cursor-pointer">
          <span className="text-xl mr-2">🤖</span>
          <span className="font-medium">Hi there! Need a clinic recommendation? Ask me anything!</span>
        </div>
      </div>
    </div>
  );
};

export default HomePrototype;

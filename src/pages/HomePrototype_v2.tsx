import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const HomePrototype_v2: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Dropdown menu options
  const handleDropdownSelect = (option: 'jb' | 'sg' | 'both') => {
    setDropdownOpen(false);
    if (option === 'jb') navigate('/clinics?sel=jb');
    else if (option === 'sg') navigate('/clinics?sel=sg');
    else navigate('/clinics?sel=all');
  };

  // Card click handlers
  const handleCardClick = (option: 'jb' | 'sg') => {
    if (option === 'jb') navigate('/clinics?sel=jb');
    else navigate('/clinics?sel=sg');
  };

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
      <section className="flex flex-col items-center justify-center py-16 bg-blue-50">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-blue-800 mb-0">See All Your Dental Options.</h1>
          <h1 className="text-5xl font-bold text-blue-800 mb-0">Make the Smartest Choice.</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mt-6 mb-8">Find the right fit for your dental needs and budget—powered by real data, not marketing hype.</p>
          <div className="mt-8">
            <button onClick={() => navigate('/clinics?sel=all')} className="bg-blue-500 text-white px-12 py-5 text-2xl font-bold rounded-xl shadow-lg inline-flex items-center cursor-pointer hover:bg-blue-600 transition-all" style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.15)' }}>
              <span>See All Clinics (SG & JB)</span>
              <span className="ml-4 text-2xl">🔍</span>
            </button>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Or, </span>
            <button className="text-sm text-blue-500 underline font-medium bg-transparent p-0 border-none cursor-pointer" style={{ textDecoration: 'underline' }}>
              ask our AI Concierge to help you choose
            </button>
          </div>
        </div>

      {/* Core Choice Section */}
      <section className="flex flex-col md:flex-row gap-6 justify-center py-10 bg-white">
        <div className="flex flex-row gap-8 justify-center w-full max-w-3xl">
          <div className="flex-1 cursor-pointer flex flex-col items-stretch" onClick={() => handleCardClick('jb')}>
            <Card className="border-green-400 border-2 p-8 flex flex-col justify-between h-full min-h-[320px] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl text-green-600">💰</span>
                <span className="text-lg font-semibold text-green-700">Unlock Big Savings Across the Causeway</span>
              </div>
              <p className="mb-2 text-gray-700">Verified clinics, major savings, full AI support.</p>
              <ul className="list-disc pl-5 text-gray-600 mb-4">
                <li>Save 50-70% on major treatments</li>
                <li>World-class dental at up to 70% less</li>
                <li>AI-powered travel & booking assistance</li>
              </ul>
            </Card>
          </div>
          <div className="flex-1 cursor-pointer flex flex-col items-stretch" onClick={() => handleCardClick('sg')}>
            <Card className="border-blue-400 border-2 p-8 flex flex-col justify-between h-full min-h-[320px] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl text-blue-600">🏠</span>
                <span className="text-lg font-semibold text-blue-700">Care You Trust, Right Here at Home</span>
              </div>
              <p className="mb-2 text-gray-700">MOH-accredited, trusted follow-ups, zero travel required.</p>
              <ul className="list-disc pl-5 text-gray-600 mb-4">
                <li>Singapore’s Standard. Singapore’s Dentists.</li>
                <li>Trusted follow-ups, no travel needed</li>
                <li>Seamless appointments</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Showcase Section - Header and GIF side-by-side, supporting content below */}
      <section className="w-full bg-blue-50 py-12 flex flex-col items-center rounded-lg">
        <div className="flex flex-col items-center w-full max-w-3xl px-4 mb-6">
          <div className="flex flex-col items-center w-full">
              <div className="bg-white rounded-lg shadow w-full flex items-center justify-center px-8 py-8" style={{ minHeight: '150px' }}>
              <div className="flex flex-row items-center justify-center w-full">
                  <h2 className="text-2xl font-bold text-blue-800 text-center leading-tight mb-0 mr-6">
                    Still Not Sure. Get Reliable<br/>
                    Answers with Our AI Concierge
                  </h2>
                <img
                  src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjF0em8wNnhjY29oZmNoYXFmbzh4bWl4dnNka3NxdWx5MTl3dDVhMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Js7Bw7gfhhzpzACnfq/giphy.gif"
                  alt="AI Chatbot Demo"
                  className="max-w-[120px] h-auto rounded shadow"
                  style={{ verticalAlign: 'middle' }}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-start mt-6">
            <p className="text-lg text-gray-700 mb-2 text-left">Ask anything—our expert-trained assistant recommends the best clinics and helps you book in minutes.</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4 text-left">
              <li>Unbiased Recommendations</li>
              <li>Save Time & Money</li>
              <li>24/7 Expert Access</li>
            </ul>
            <Button className="w-full text-lg mb-2">Ask The AI Concierge — Free</Button>
            <p className="text-xs text-gray-500 mt-2 text-left">To use - simply sign up for free. No credit card needed.</p>
          </div>
        </div>
      </section>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 bg-white flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Trusted by Singaporeans for Every Need</h3>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
          <Card className="p-6 flex-1">
            <div className="mb-2 text-yellow-500 text-lg">★★★★★</div>
            <p className="text-gray-700 mb-2">"Saved $3,200 on my dental implants compared to Singapore prices. The quality was exceptional, and the AI concierge made planning the trip from Woodlands a breeze."</p>
            <span className="text-sm text-gray-500">— Linda Wong, Woodlands</span>
          </Card>
          <Card className="p-6 flex-1">
            <div className="mb-2 text-yellow-500 text-lg">★★★★★</div>
            <p className="text-gray-700 mb-2">"The platform laid out all my options clearly. I chose a Singapore clinic for convenience and peace of mind. The transparency was fantastic!"</p>
            <span className="text-sm text-gray-500">— David Tan, Bishan</span>
          </Card>
        </div>
      </section>

      {/* Final CTA & Footer */}
      <section className="py-8 bg-blue-50 flex flex-col items-center">
  <h4 className="text-lg font-semibold text-blue-800 mb-4">Your Smartest Dental Decision Awaits.</h4>
        <div className="flex gap-4">
          <Button className="px-6">Compare Clinics Now</Button>
          <Button className="px-6">Chat with AI Expert</Button>
        </div>
      </section>
      <footer className="bg-white py-6 mt-auto text-center text-gray-500 text-sm">
        About | Contact | Privacy | Medical Disclaimer
      </footer>

      {/* Persistent AI Widget (static, non-functional) */}
      {/* Persistent AI Widget removed as requested. Native chat widget icon will remain. */}
      {/* Chatbot icon with speech bubble */}
  <div className="fixed bottom-10 left-20 z-50 flex items-center" style={{ pointerEvents: 'none' }}>
        {/* Chat widget icon (native, not controlled here) */}
        {/* Plain text box for user guidance, 2 lines */}
        <div className="bg-white border border-blue-400 rounded-lg shadow px-4 py-2 ml-2 flex flex-col justify-center" style={{ fontSize: '1rem', color: '#222', pointerEvents: 'auto', minWidth: '220px' }}>
          <span className="text-center">Hello! Need help?</span>
          <span className="text-center">Just ask the chatbot anything.</span>
        </div>
      </div>
    </div>
  );
};

export default HomePrototype_v2;

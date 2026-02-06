import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AIIcon from '@/components/brand/AIIcon';
import MasterTemplate from '@/components/layout/MasterTemplate';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { useNavigate } from 'react-router-dom';
import ChatHelperTextbox from '@/components/chat/ChatHelperTextbox';

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

  // Navigate to Compare tab
  const goToCompare = () => {
    navigate('/compare');
  };

  // Open AI Concierge chatbot
  const openAIConcierge = () => {
    const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement | null;
    chatButton?.click();
  };

  return (
  <MasterTemplate title="See All Your Dental Options." subtitle="Make an Informed Choice.">

      {/* Hero CTA Section */}
      <section className="flex flex-col items-center justify-center py-12 bg-blue-50">
        <div className="w-full max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">Find the right fit for your dental needs and budget—powered by real data, not marketing hype.</p>
          <div className="mt-2">
            <Button onClick={() => navigate('/clinics?sel=all')} className="btn-primary px-12 py-5 text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
              See All Clinics (SG & JB)
            </Button>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Or, </span>
            <button className="text-sm text-blue-600 underline font-medium bg-transparent p-0 border-none cursor-pointer">
              use our AI search to find clinics
            </button>
          </div>
        </div>

      {/* Core Choice Section */}
      <section className="flex flex-col md:flex-row gap-6 justify-center py-10 bg-white">
        <div className="flex flex-row gap-4 justify-center w-full max-w-3xl px-2">
          <div className="flex-1 cursor-pointer flex flex-col items-stretch" onClick={() => handleCardClick('jb')}>
            <Card className="border-green-400 border-2 p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full min-h-[260px] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg sm:text-xl md:text-2xl text-green-600">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-green-700">Compare Dental Options Across the Causeway</span>
              </div>
              <p className="mb-2 text-gray-700 text-sm sm:text-base">Verified clinics, transparent pricing, full AI support.</p>
              <ul className="list-disc pl-4 text-gray-600 mb-4 text-sm sm:text-base">
                <li>Compare transparent pricing for treatments</li>
                <li>Quality dental care across the region</li>
                <li>AI-powered travel & booking assistance</li>
              </ul>
            </Card>
          </div>
          <div className="flex-1 cursor-pointer flex flex-col items-stretch" onClick={() => handleCardClick('sg')}>
            <Card className="border-blue-400 border-2 p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full min-h-[260px] hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg sm:text-xl md:text-2xl text-blue-600">🏠</span>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">Care You Trust, Right Here at Home</span>
              </div>
              <p className="mb-2 text-gray-700 text-sm sm:text-base">MOH-accredited, trusted follow-ups, zero travel required.</p>
              <ul className="list-disc pl-4 text-gray-600 mb-4 text-sm sm:text-base">
                <li>Singapore standard, Singapore dentists</li>
                <li>Trusted follow-ups, no travel needed</li>
                <li>Convenient appointments close to home</li>
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
                    Or, use our AI search tool<br/>
                    to help find clinics
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
            <p className="text-lg text-gray-700 mb-2 text-left">This tool helps you:</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4 text-left">
              <li>Find clinics offering specific services</li>
              <li>Check locations and operating hours</li>
              <li>Request appointments with participating clinics</li>
            </ul>
            <Button onClick={openAIConcierge} className="btn-primary w-full text-lg mb-2 inline-flex items-center justify-center gap-2">
              <AIIcon className="text-white" size={18} />
              Try AI Search Tool
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-left italic">This AI tool provides general information only, not medical advice. Final treatment decisions should be made in consultation with a registered dental practitioner.</p>
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
            <p className="text-gray-700 mb-2">"The OraChope platform helped me compare my options and plan my trip from Woodlands. The AI concierge made the booking process really easy and the clinic was just 25 minutes from the checkpoint."</p>
            <span className="text-sm text-gray-500">— Linda Wong, Woodlands</span>
          </Card>
          <Card className="p-6 flex-1">
            <div className="mb-2 text-yellow-500 text-lg">★★★★★</div>
            <p className="text-gray-700 mb-2">"The platform laid out all my options clearly. I chose a Singapore clinic for convenience and peace of mind. The transparency was fantastic!"</p>
            <span className="text-sm text-gray-500">— David Tan, Bishan</span>
          </Card>
        </div>
        <p className="text-xs text-gray-500 mt-6 max-w-3xl text-center">
          Note: Testimonials reflect user experience with OraChope's platform features, not clinical outcomes or endorsements of specific dental providers.
        </p>
      </section>

      {/* Final CTA */}
      <section className="py-8 bg-blue-50 flex flex-col items-center">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Your Dental Decision Made Easier.</h4>
        <div className="flex gap-4">
          <Button onClick={goToCompare} className="btn-primary px-6">Compare Clinics Now</Button>
          <Button onClick={openAIConcierge} className="btn-secondary px-6 inline-flex items-center gap-2">
            <AIIcon size={16} />
            Use AI Search
          </Button>
        </div>
      </section>

      {/* Important Medical Disclaimer (consistent with other pages) */}
      <MedicalDisclaimer />

      {/* Chat helper textbox (standardized across pages) */}
      <ChatHelperTextbox />
    </MasterTemplate>
  );
};

export default HomePrototype_v2;

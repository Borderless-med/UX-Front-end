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

  return (
  <MasterTemplate title="See All Your Dental Options." subtitle="Make the Smartest Choice.">

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
              ask our AI Concierge to help you choose
            </button>
          </div>
        </div>

      {/* Core Choice Section */}
      <section className="flex flex-col md:flex-row gap-6 justify-center py-10 bg-white">
        <div className="flex flex-row gap-8 justify-center w-full max-w-3xl px-4">
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
            <Button className="btn-primary w-full text-lg mb-2 inline-flex items-center justify-center gap-2">
              <AIIcon className="text-white" size={18} />
              Ask The AI Concierge — Free
            </Button>
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

      {/* Final CTA */}
      <section className="py-8 bg-blue-50 flex flex-col items-center">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Your Smartest Dental Decision Awaits.</h4>
        <div className="flex gap-4">
          <Button className="btn-primary px-6">Compare Clinics Now</Button>
          <Button className="btn-secondary px-6 inline-flex items-center gap-2">
            <AIIcon size={16} />
            Chat with AI Expert
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

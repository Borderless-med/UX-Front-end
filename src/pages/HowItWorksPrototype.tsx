import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import ChatWidget from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';
import AIIcon from '@/components/brand/AIIcon';
import MasterTemplate from '@/components/layout/MasterTemplate';
import ChatHelperTextbox from '@/components/chat/ChatHelperTextbox';

const HowItWorksPrototype = () => {
  const navigate = useNavigate();

  const openAIConcierge = () => {
    const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement | null;
    chatButton?.click();
  };

  return (
    <MasterTemplate title="How It Works">
      {/* Part 1: The Core Dilemma */}
      <section className="py-10 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-800">It All Starts with Your Priority</h2>
            <p className="mt-3 text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
              The first step to finding the perfect dentist is deciding what matters most to you. Our platform helps you find the best match—whether you prioritize savings or convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Savings (JB) */}
            <div className="border-2 border-emerald-500 rounded-xl bg-white shadow-sm p-6">
              <div className="text-2xl">💰</div>
              <h3 className="mt-2 text-xl md:text-2xl font-bold">Consider Regional Options</h3>
              <p className="mt-2 text-slate-700">Explore verified clinics in Johor Bahru offering transparent pricing and quality dental care.</p>
            </div>

            {/* Convenience (SG) */}
            <div className="border-2 border-blue-600 rounded-xl bg-white shadow-sm p-6">
              <div className="text-2xl">🏠</div>
              <h3 className="mt-2 text-xl md:text-2xl font-bold">Stay Close to Home</h3>
              <p className="mt-2 text-slate-700">Find trusted, MOH-accredited dentists right here in Singapore for peace of mind and easy follow-ups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Choose Your Path */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">Two Powerful Ways to Find Your Clinic</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* AI Guided Path */}
            <div className="rounded-xl ring-1 ring-slate-200 p-6 bg-white">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Recommended for New Users</div>
              <h3 className="mt-2 text-xl md:text-2xl font-bold">1. Let Our AI Concierge Guide You</h3>
              <div className="mt-2"><AIIcon size={28} /></div>
              <p className="mt-3 text-slate-700">
                Perfect for when you're not sure where to start. Tell our AI your needs—it analyzes thousands of data points, including real patient reviews, to give you a personalized, unbiased recommendation in seconds.
              </p>
              <div className="mt-5">
                <button onClick={openAIConcierge} className="btn-primary">
                  Ask The AI Concierge
                </button>
              </div>
            </div>

            {/* DIY Filter Path */}
            <div className="rounded-xl ring-1 ring-slate-200 p-6 bg-white">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">For the Hands-On Researcher</div>
              <h3 className="mt-2 text-xl md:text-2xl font-bold">2. Explore with Our Powerful Filters</h3>
              <div className="mt-2 text-2xl">🔎</div>
              <p className="mt-3 text-slate-700">
                Perfect for users who love to be in control. Dive into our directory and use advanced filters to sort clinics by location, treatment, Google rating, license status, and more to create your own shortlist.
              </p>
              <div className="mt-5">
                <button onClick={() => navigate('/clinics?sel=all')} className="btn-secondary">
                  Explore All Clinics
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: End-to-End Solution */}
      <section className="py-12 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">From Discovery to Appointment in Minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
              <div className="text-2xl">📅</div>
              <h4 className="mt-2 text-lg font-semibold">3. Book With Confidence</h4>
              <p className="mt-2 text-slate-700">Once you've found your perfect clinic, use our simple booking form to request your preferred appointment time. Create a free account to manage your bookings.</p>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
              <div className="text-2xl">✈️</div>
              <h4 className="mt-2 text-lg font-semibold">4. Plan Your Travel</h4>
              <p className="mt-2 text-slate-700">For JB appointments, get clinic location and contact details. Ask our AI Concierge for cross-border tips—from traffic to Grab estimates.</p>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
              <div className="text-2xl">💬</div>
              <h4 className="mt-2 text-lg font-semibold">5. Get 24/7 Support</h4>
              <p className="mt-2 text-slate-700">Your journey doesn't end after you book. Our AI assistant is available 24/7, and our human support team is here for anything complex.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">Ready to Make the Smartest Choice?</h2>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={openAIConcierge} className="btn-primary">Ask The AI Concierge</button>
              <button onClick={() => navigate('/clinics?sel=all')} className="btn-secondary">Explore All Clinics</button>
            </div>
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
      <ChatWidget />
      <ChatHelperTextbox />
    </MasterTemplate>
  );
};

export default HowItWorksPrototype;

import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import ChatWidget from '@/components/ChatWidget';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import { proceduresData } from '@/data/proceduresData';
import MasterTemplate from '@/components/layout/MasterTemplate';
import ChatHelperTextbox from '@/components/chat/ChatHelperTextbox';

const ComparePrototype = () => {
  const openAIConcierge = () => {
    const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement | null;
    chatButton?.click();
    setTimeout(() => {
      const chatInput = document.querySelector('textarea[placeholder*="Type your message"]') as HTMLTextAreaElement | null;
      if (chatInput) {
        chatInput.value = 'I am deciding between Singapore vs Johor Bahru for dental care. Can you give me a personal recommendation?';
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.focus();
      }
    }, 500);
  };

  return (
    <MasterTemplate title="Compare Clinics">

      {/* SECTION 1: THE FRAMEWORK */}
      <section className="pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-blue-800">Which Path is Right for You?</h1>
            <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
              Choosing a dentist involves balancing affordability, convenience, and peace of mind. Use this guide to find the best fit for your personal needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10">
            {/* JB Card */}
            <div className="border border-slate-200 rounded-lg shadow-sm pt-2">
              <div className="h-1.5 bg-emerald-600 rounded-t-lg" />
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold">💰 Choose Johor Bahru if...</h3>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-700">
                  <li>Treatment affordability is an important consideration for you.</li>
                  <li>You can dedicate half or full day for your appointment.</li>
                  <li>You're comfortable with cross-border travel (passport required).</li>
                  <li>You prefer extended appointments to complete more dental work.</li>
                  <li>You may wish to combine your dental visit with leisure activities (shopping, dining, sightseeing in JB).</li>
                </ul>
              </div>
            </div>

            {/* SG Card */}
            <div className="border border-slate-200 rounded-lg shadow-sm pt-2">
              <div className="h-1.5 bg-blue-600 rounded-t-lg" />
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold">🏠 Choose Singapore if...</h3>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-700">
                  <li>Convenience, Trust and proximity to home are your top priorities.</li>
                  <li>You need urgent care or have time-sensitive dental concerns.</li>
                  <li>You prefer to avoid travel and cross-border logistics.</li>
                  <li>You value having multiple short appointments close to your routine.</li>
                  <li>You may qualify for CHAS subsidies* (Blue/Orange/Green cardholders receive varying subsidies at participating clinics).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PERSONALIZED SOLUTION */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="border border-slate-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">Still Unsure? Get a Personal Recommendation.</h2>
            <p className="mt-3 text-base md:text-lg text-slate-600">
              Our AI Concierge can analyze your specific needs—including treatment type, budget, and travel preferences—to give you a data-driven recommendation in seconds.
            </p>
            <div className="mt-6">
              <button onClick={openAIConcierge} className="btn-primary px-6 py-3 rounded-lg shadow">
                Ask The AI Concierge — Free
              </button>
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

export default ComparePrototype;

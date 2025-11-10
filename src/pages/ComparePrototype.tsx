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
              Choosing a dentist involves more than just price. It's about balancing savings, convenience, and peace of mind. Use this guide to find the best fit for your personal needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10">
            {/* JB Card */}
            <div className="border border-slate-200 rounded-lg shadow-sm pt-2">
              <div className="h-1.5 bg-emerald-600 rounded-t-lg" />
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold">💰 Choose Johor Bahru if...</h3>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-700">
                  <li><span className="font-semibold">Maximum Savings</span> is your #1 priority.</li>
                  <li>You are planning <span className="font-semibold">major procedures</span> (e.g., implants, veneers, multiple crowns).</li>
                  <li>You are comfortable with <span className="font-semibold">cross-border travel</span> and have a valid passport.</li>
                  <li>You can set aside a <span className="font-semibold">half or full day</span> for your appointment.</li>
                </ul>
              </div>
            </div>

            {/* SG Card */}
            <div className="border border-slate-200 rounded-lg shadow-sm pt-2">
              <div className="h-1.5 bg-blue-600 rounded-t-lg" />
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold">🏠 Choose Singapore if...</h3>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-700">
                  <li><span className="font-semibold">Ultimate Convenience</span> is your #1 priority.</li>
                  <li>You need a <span className="font-semibold">simple or urgent procedure</span> (e.g., cleaning, filling, toothache).</li>
                  <li>You prefer to avoid travel and stay close to home.</li>
                  <li>You require <span className="font-semibold">multiple, short follow-up</span> appointments.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE DATA */}
      <section className="py-10 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">A Transparent Look at Regional Pricing</h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 max-w-4xl mx-auto border border-dashed border-slate-400 rounded-md p-3">
              <span className="font-semibold">Important Disclaimer:</span> The prices below are estimates. Singapore (SG) prices are based on typical private clinic rates. Johor Bahru (JB) prices are sourced from our partner clinics. All pricing is indicative and should be verified with the clinic before treatment.
            </p>
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="p-4">
              <PriceComparisonTable procedures={proceduresData} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PERSONALIZED SOLUTION */}
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

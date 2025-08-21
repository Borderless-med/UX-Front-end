
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PriceComparisonTable from './PriceComparisonTable';
import StatsCards from './StatsCards';
import PricingBookingDisclaimer from './PricingBookingDisclaimer';
import { proceduresData } from '@/data/proceduresData';

const PriceComparison = () => {
  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-dark mb-4">
            Dental Price Comparison
          </h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Compare dental treatment costs between Singapore and Johor Bahru. 
            All prices are in Singapore Dollars (S$).
          </p>
        </div>

        <Card className="shadow-lg border border-blue-light">
          <CardHeader className="bg-blue-primary/10 border-b border-blue-light">
            <CardTitle className="text-2xl text-blue-dark">Treatment Price Comparison</CardTitle>
            <CardDescription className="text-neutral-gray">
              Savings when choosing Malaysian dental clinics over Singapore alternatives
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PriceComparisonTable procedures={proceduresData} />
          </CardContent>
        </Card>

        {/* AI-Powered Clinic Recommendations */}
        <div className="mt-8 mb-8">
          <div className="bg-blue-light border border-blue-primary/20 rounded-lg p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-primary/10 rounded-full p-3">
                  <svg className="w-8 h-8 text-blue-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-dark mb-4">
                Get AI-Powered Clinic Recommendations
              </h3>
              <p className="text-lg text-neutral-gray mb-6 max-w-3xl mx-auto">
                Our AI analyzes your specific preferences, treatment needs, location requirements, and quality expectations to recommend clinics that perfectly match your criteria - not just based on price alone.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-neutral-gray">
                <span className="bg-white/50 px-3 py-1 rounded-full">✨ Preference Analysis</span>
                <span className="bg-white/50 px-3 py-1 rounded-full">📍 Location Matching</span>
                <span className="bg-white/50 px-3 py-1 rounded-full">⭐ Quality Assessment</span>
                <span className="bg-white/50 px-3 py-1 rounded-full">🔍 Treatment Specialization</span>
              </div>
              <Button 
                size="sm"
                onClick={() => {
                  // Find and click the chat widget to open it
                  const chatButton = document.querySelector('[data-chat-widget]') as HTMLElement;
                  if (chatButton) {
                    chatButton.click();
                    // Add a small delay to ensure chat opens, then simulate typing a message
                    setTimeout(() => {
                      const chatInput = document.querySelector('textarea[placeholder*="Type your message"]') as HTMLTextAreaElement;
                      if (chatInput) {
                        chatInput.value = "Help me find the perfect clinic based on my specific needs and preferences";
                        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                        chatInput.focus();
                      }
                    }, 500);
                  }
                }}
                className="bg-blue-primary hover:bg-blue-accent text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Ask AI Concierge
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StatsCards />
        </div>

        <div className="mt-8">
          <PricingBookingDisclaimer />
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;

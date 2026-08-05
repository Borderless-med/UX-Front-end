import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GiveawayThankYouProps {
  userName?: string;
}

const GiveawayThankYou: React.FC<GiveawayThankYouProps> = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      {/* Success Animation */}
      <div className="relative">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4 relative">
          <Gift className="h-12 w-12 text-green-600" />
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 You're Entered{userName ? `, ${userName.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Your entry for the <strong>Xiaomi Mijia Toothbrush</strong> giveaway has been confirmed.
        </p>
        <p className="text-gray-600">
          We'll notify you via WhatsApp within 7 days if you're the lucky winner!
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-blue-900 text-lg">What's Next?</h3>
        <p className="text-sm text-blue-800 mb-4">
          You came here for dental savings. Let's find you the best clinic prices now!
        </p>

        {/* PRIMARY ACTION: View Clinics */}
        <Button
          onClick={() => navigate('/clinics')}
          className="w-full bg-blue-primary hover:bg-blue-dark h-14 text-base font-bold shadow-lg"
        >
          <MapPin className="h-5 w-5 mr-2" />
          View or Book Verified Clinics
        </Button>

        {/* SECONDARY ACTION: AI Assistant */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full h-12 text-base font-semibold border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Try Our AI Dental Assistant
        </Button>
      </div>

      {/* Additional Benefits */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <div className="text-center">
          <div className="text-2xl mb-1">🏥</div>
          <p className="text-xs font-medium text-gray-700">200+ Clinics</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">💰</div>
          <p className="text-xs font-medium text-gray-700">Price Compare</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🤖</div>
          <p className="text-xs font-medium text-gray-700">AI Assistant</p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
        Good luck! Winner will be randomly selected and announced via WhatsApp.
      </p>
    </div>
  );
};

export default GiveawayThankYou;

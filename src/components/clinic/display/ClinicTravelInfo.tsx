import { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface TravelFAQ {
  question: string;
  answer: string;
}

interface ClinicTravelInfoProps {
  clinicName: string;
  township?: string;
}

const ClinicTravelInfo = ({ clinicName, township }: ClinicTravelInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Top 5 most relevant FAQs for getting to clinics
  const relevantFAQs: TravelFAQ[] = [
    {
      question: 'What documents do I need to cross?',
      answer: 'Valid passport (ideally 6+ months left). If driving a Singapore car into Malaysia, you also need VEP registration and Touch \'n Go card.'
    },
    {
      question: 'Best time to cross to avoid jams?',
      answer: 'Mid-morning (10 AM–3 PM) or late evening after 9 PM usually lighter. Avoid weekday mornings (7–9:30 AM) and evenings (5–8 PM).'
    },
    {
      question: 'What are my transport options?',
      answer: 'Bus, Train (Shuttle Tebrau), Taxi/Grab, or private car. Bus is most economical, Taxi/Grab is fastest.'
    },
    {
      question: township 
        ? `How do I get from JB CIQ to ${township}?`
        : 'How do I get from JB CIQ to the clinic?',
      answer: township && township.toLowerCase().includes('mount austin')
        ? 'Taxi/Grab is easiest—expect 20–30 minutes off-peak from JB CIQ to Mount Austin.'
        : 'Most clinics are 10–25 minutes by Taxi/Grab from JB CIQ. Plan for extra time during peak hours.'
    },
    {
      question: 'How much buffer time should I add?',
      answer: 'Add 45–60 minutes extra if crossing near peak periods (weekday AM/PM). For midday crossings, 30 minutes buffer is usually sufficient.'
    }
  ];

  return (
    <Card className="mt-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-base">Getting Here from Singapore</h3>
            <p className="text-sm text-gray-600">Essential travel info for your visit</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Quick Info Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-900">Allow extra time</p>
              <p className="text-yellow-800">Add 45-60 min buffer during peak hours (weekday 7-9:30 AM, 5-8 PM)</p>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-2">
            {relevantFAQs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="font-semibold text-gray-900 text-sm mb-1">{faq.question}</p>
                <p className="text-gray-700 text-xs leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Link to Full Travel Guide */}
          <Link
            to="/travel-guide"
            className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <span>View Complete Travel Guide</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ClinicTravelInfo;

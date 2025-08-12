import { Bot, User, CheckCircle } from 'lucide-react';

interface PathwaySelectionProps {
  onAIPath: () => void;
  onManualPath: () => void;
}

const PathwaySelection = ({ onAIPath, onManualPath }: PathwaySelectionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Choose Your Preferred Experience</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* AI Concierge Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-8 min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart AI Concierge</h3>
              <p className="text-lg text-gray-700 mb-6">
                Let our AI assistant provide personalized recommendations<br />
                using advanced sentiment analysis
              </p>
            </div>
            <div className="text-base text-blue-700 font-semibold">Perfect for: First-time patients, those seeking guidance</div>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow min-h-[200px]">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Sentiment-powered clinic recommendations</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Authentic review analysis</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Conversational Q&A guidance</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Assisted booking process</span>
            </div>
          </div>
          
          <button
            onClick={onAIPath}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg mt-auto"
          >
            Start with AI Concierge
          </button>
        </div>
        
        {/* Manual Process Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-8 min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-gray-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Self-Service Booking</h3>
              <p className="text-lg text-gray-700 mb-6">Browse clinics yourself, filter options, and complete the booking form independently at your own pace</p>
            </div>
            <div className="text-base text-gray-700 font-semibold">Perfect for: Experienced patients, those who prefer control</div>
          </div>
          
          <div className="space-y-4 mb-8 flex-grow min-h-[200px]">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Full browsing control</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Advanced filtering options</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Compare at your own pace</span>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              <span className="text-lg text-gray-700 font-medium">Familiar booking process</span>
            </div>
          </div>
          
          <button
            onClick={onManualPath}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg mt-auto"
          >
            Browse & Book Directly
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwaySelection;
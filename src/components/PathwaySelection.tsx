import { Bot, Calendar, CheckCircle } from 'lucide-react';

interface PathwaySelectionProps {
  onAIPath: () => void;
  onManualPath: () => void;
}

const PathwaySelection = ({ onAIPath, onManualPath }: PathwaySelectionProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Preferred Experience</h2>
        <p className="text-lg text-gray-600">Select the approach that works best for you</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Concierge Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center mb-6">
            <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart AI Concierge</h3>
            <p className="text-gray-700 mb-4">Let our AI assistant guide you through clinic selection with advanced sentiment analysis and personalized recommendations</p>
            <div className="text-sm text-blue-700 font-medium mb-4">Perfect for: First-time patients, those seeking guidance</div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Sentiment-powered clinic recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Authentic review analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Conversational Q&A guidance</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Assisted booking process</span>
            </div>
          </div>
          
          <button
            onClick={onAIPath}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start with AI Concierge
          </button>
        </div>
        
        {/* Manual Process Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center mb-6">
            <div className="bg-gray-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Self-Service Booking</h3>
            <p className="text-gray-700 mb-4">Browse clinics yourself, filter options, and complete the booking form independently at your own pace</p>
            <div className="text-sm text-gray-700 font-medium mb-4">Perfect for: Experienced patients, those who prefer control</div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Full browsing control</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Advanced filtering options</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Compare at your own pace</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Familiar booking process</span>
            </div>
          </div>
          
          <button
            onClick={onManualPath}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Browse & Book Directly
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwaySelection;
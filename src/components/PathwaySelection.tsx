import { Bot, User, CheckCircle } from 'lucide-react';

interface PathwaySelectionProps {
  onAIPath: () => void;
  onManualPath: () => void;
}

const PathwaySelection = ({ onAIPath, onManualPath }: PathwaySelectionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Choose Your Preferred Experience</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10">
        {/* AI Concierge Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-4 sm:mb-6 md:mb-8 min-h-[140px] sm:min-h-[200px] md:min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-blue-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Smart AI Concierge</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 md:mb-6">
                <span className="sm:hidden">Personalized AI-powered clinic recommendations</span>
                <span className="hidden sm:inline">Get personalized clinic recommendations<br className="hidden md:inline" />
                <span className="md:inline"> powered by AI sentiment analysis</span></span>
              </p>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-blue-700 font-semibold">
              <span className="sm:hidden">Perfect for first-time patients</span>
              <span className="hidden sm:inline">Perfect for: First-time patients, those seeking guidance</span>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 flex-grow min-h-[120px] sm:min-h-[160px] md:min-h-[200px]">
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Smart recommendations</span>
                <span className="hidden sm:inline">Sentiment-powered clinic recommendations</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Review analysis</span>
                <span className="hidden sm:inline">Authentic review analysis</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Q&A guidance</span>
                <span className="hidden sm:inline">Conversational Q&A guidance</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Assisted booking</span>
                <span className="hidden sm:inline">Assisted booking process</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={onAIPath}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base md:text-lg mt-auto"
          >
            <span className="sm:hidden">Start AI Concierge</span>
            <span className="hidden sm:inline">Start with AI Concierge</span>
          </button>
        </div>
        
        {/* Manual Process Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-4 sm:mb-6 md:mb-8 min-h-[140px] sm:min-h-[200px] md:min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-gray-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <User className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Browse & Compare</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 md:mb-6">
                <span className="sm:hidden">Browse clinics & compare options</span>
                <span className="hidden sm:inline">Explore our verified clinics, compare options, and book when you're ready</span>
              </p>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
              <span className="sm:hidden">Perfect for experienced patients</span>
              <span className="hidden sm:inline">Perfect for: Experienced patients, those who prefer to research first</span>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 flex-grow min-h-[120px] sm:min-h-[160px] md:min-h-[200px]">
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Browse clinics</span>
                <span className="hidden sm:inline">Browse all verified clinics</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Search & filter</span>
                <span className="hidden sm:inline">Advanced search & filtering</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Compare clinics</span>
                <span className="hidden sm:inline">Compare clinics side-by-side</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">Direct booking</span>
                <span className="hidden sm:inline">Book directly from clinic pages</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={onManualPath}
            className="w-full bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base md:text-lg mt-auto"
          >
            <span className="sm:hidden">Start Browsing</span>
            <span className="hidden sm:inline">Start Browsing Clinics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwaySelection;
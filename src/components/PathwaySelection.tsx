import { Bot, User, CheckCircle } from 'lucide-react';

interface PathwaySelectionProps {
  onAIPath: () => void;
  onManualPath: () => void;
}

const PathwaySelection = ({ onAIPath, onManualPath }: PathwaySelectionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 md:mb-16">
      <div className="text-center mb-3 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-6">Choose Your Preferred Experience</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-10">
        {/* AI Concierge Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-2 sm:mb-4 md:mb-8 min-h-[100px] sm:min-h-[140px] md:min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-blue-500 rounded-full w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-6">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-4">Get Expert Advice in 60 Seconds</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 md:mb-6">
                <span className="sm:hidden">Ask our AI: "Is JB dental care worth it?"</span>
                <span className="hidden sm:inline">The only AI that reads between the lines<br className="hidden md:inline" />
                <span className="md:inline"> of 500+ real patient reviews</span></span>
              </p>
              <div className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-full font-semibold inline-block">
                Try 40 questions FREE - Sign up in 30 seconds
              </div>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-blue-700 font-semibold">
              <span className="sm:hidden">Perfect for first-time JB patients</span>
              <span className="hidden sm:inline">Perfect for: First-time JB patients, cost-conscious families</span>
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2 md:space-y-4 mb-2 sm:mb-4 md:mb-8 flex-grow min-h-[80px] sm:min-h-[120px] md:min-h-[200px]">
            <div className="flex items-start space-x-1 sm:space-x-2 md:space-x-4">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">"Should I get my root canal in JB?"</span>
                <span className="hidden sm:inline">"Should I get my root canal in JB or Singapore?"</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">"Which clinic has best implant reviews?"</span>
                <span className="hidden sm:inline">"Which clinic has the best reviews for dental implants?"</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">"What's the real cost difference?"</span>
                <span className="hidden sm:inline">"What's the real cost difference for my treatment?"</span>
              </span>
            </div>
            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium">
                <span className="sm:hidden">"Book appointment that fits my schedule"</span>
                <span className="hidden sm:inline">"Help me book an appointment that fits my schedule"</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={onAIPath}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 md:py-5 md:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm md:text-lg mt-auto"
          >
            <span className="sm:hidden">Try AI FREE</span>
            <span className="hidden sm:inline">Try Our AI Expert FREE</span>
          </button>
        </div>
        
        {/* Manual Process Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex flex-col h-full">
          <div className="text-center mb-2 sm:mb-4 md:mb-8 min-h-[100px] sm:min-h-[140px] md:min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="bg-gray-600 rounded-full w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-6">
                <User className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-4">Browse & Compare</h3>
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
          
          <div className="space-y-1 sm:space-y-2 md:space-y-4 mb-2 sm:mb-4 md:mb-8 flex-grow min-h-[80px] sm:min-h-[120px] md:min-h-[200px]">
            <div className="flex items-start space-x-1 sm:space-x-2 md:space-x-4">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-1" />
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
            className="w-full bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 md:py-5 md:px-8 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm md:text-lg mt-auto"
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
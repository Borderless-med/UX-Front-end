
import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingClinicTab = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = window.scrollY / scrollHeight;
      setIsVisible(scrollProgress > 0.25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToPartnerApplication = () => {
    navigate('/partner-application');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Version - Right Corner */}
      <div className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-50 animate-slide-in-right">
        <button
          onClick={navigateToPartnerApplication}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="group bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
          style={{
            width: isExpanded ? 'auto' : '80px',
            height: '80px',
            paddingLeft: '20px',
            paddingRight: isExpanded ? '24px' : '20px',
          }}
        >
          <Handshake 
            size={isExpanded ? 40 : 36} 
            className="text-white flex-shrink-0 transition-all duration-300" 
          />
          <span
            className={`ml-4 whitespace-nowrap font-semibold text-lg transition-all duration-300 ${
              isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
            }`}
          >
            Clinics: Join Now
          </span>
        </button>
      </div>

      {/* Mobile Version - Bottom Center */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
        <button
          onClick={navigateToPartnerApplication}
          className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center px-6 py-4 transform hover:scale-105"
        >
          <Handshake size={40} className="text-white mr-3" />
          <span className="font-semibold text-lg whitespace-nowrap">Clinics: Join Now</span>
        </button>
      </div>
    </>
  );
};

export default FloatingClinicTab;

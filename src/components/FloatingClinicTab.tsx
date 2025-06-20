
import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';

const FloatingClinicTab = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = window.scrollY / scrollHeight;
      setIsVisible(scrollProgress > 0.25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToApplySection = () => {
    const applySection = document.getElementById('apply-clinic') || document.getElementById('waitlist');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Version - Right Corner */}
      <div className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-50 animate-slide-in-right">
        <button
          onClick={scrollToApplySection}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="group bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white rounded-full shadow-lg transition-all duration-300 flex items-center"
          style={{
            width: isExpanded ? 'auto' : '64px',
            height: '64px',
            paddingLeft: '16px',
            paddingRight: isExpanded ? '20px' : '16px',
          }}
        >
          <Handshake size={32} className="text-white flex-shrink-0" />
          <span
            className={`ml-3 whitespace-nowrap font-medium transition-all duration-300 ${
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
          onClick={scrollToApplySection}
          className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white rounded-full shadow-lg transition-all duration-300 flex items-center px-4 py-3"
        >
          <Handshake size={32} className="text-white mr-2" />
          <span className="font-medium whitespace-nowrap">Clinics: Join Now</span>
        </button>
      </div>
    </>
  );
};

export default FloatingClinicTab;

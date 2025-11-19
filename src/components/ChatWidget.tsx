
import { useState, useRef, useCallback, useEffect } from 'react';
import { MessageCircle, X, GripVertical } from 'lucide-react';
import ChatWindow from './chat/ChatWindow';

interface ChatWidgetProps {
  onAuthClick?: () => void;
}

const ChatWidget = ({ onAuthClick }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 384, height: 500 });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(true);
  const isResizing = useRef(false);

  // Load saved dimensions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatWidget-dimensions');
    if (saved) {
      const parsedDimensions = JSON.parse(saved);
      setDimensions(parsedDimensions);
    }
  }, []);

  // Initial hint bubble timer
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setShowHint(false), 3500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Save dimensions to localStorage
  const saveDimensions = useCallback((newDimensions: { width: number; height: number }) => {
    localStorage.setItem('chatWidget-dimensions', JSON.stringify(newDimensions));
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowHint(false);
  };

  // Custom resize logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      const newWidth = Math.max(320, Math.min(800, startWidth + (e.clientX - startX)));
      const newHeight = Math.max(300, Math.min(window.innerHeight * 0.8, startHeight + (startY - e.clientY)));
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      saveDimensions(dimensions);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, saveDimensions]);

  return (
    <>
      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-20 md:left-6">
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={toggleChat} />
          
          {/* Desktop resizable chat window */}
          <div 
            ref={chatContainerRef}
            className="hidden md:block relative bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
            style={{ 
              width: `${dimensions.width}px`, 
              height: `${dimensions.height}px`,
              minWidth: '320px',
              minHeight: '300px',
              maxWidth: '800px',
              maxHeight: '80vh'
            }}
          >
            <ChatWindow onClose={toggleChat} onAuthClick={onAuthClick} />
            
            {/* Resize Handle */}
            <div 
              className="absolute top-0 right-0 w-6 h-6 cursor-nw-resize bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center group"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            >
              <GripVertical size={12} className="text-muted-foreground group-hover:text-foreground transition-colors rotate-45" />
            </div>
          </div>
          
          {/* Mobile fullscreen */}
          <div className="md:hidden h-full">
            <ChatWindow onClose={toggleChat} onAuthClick={onAuthClick} />
          </div>
        </div>
      )}

      {/* Chat Toggle Button + Hint */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          {/* Small hint bubble above icon */}
          {!isOpen && showHint && (
            <div
              className="absolute -top-3 left-16 md:left-16 -translate-y-full bg-white/95 backdrop-blur border border-blue-400 rounded-md shadow px-2 py-1 text-[11px] leading-tight text-gray-800"
              style={{ pointerEvents: 'none', maxWidth: '160px' }}
            >
              Tap to chat
            </div>
          )}
          <button
          onClick={toggleChat}
          data-chat-widget
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
          className={`group bg-blue-primary hover:bg-blue-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
            isOpen ? 'w-12 h-12' : 'w-14 h-14'
          }`}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={28} className="text-white" />
          )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;

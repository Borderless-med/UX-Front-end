
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './chat/ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-20 md:left-6 md:w-96 md:h-[500px]">
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={toggleChat} />
          {/* Desktop resizable chat window */}
          <div className="hidden md:block h-full w-full resize overflow-auto min-w-80 min-h-96 max-w-2xl max-h-[80vh]">
            <ChatWindow onClose={toggleChat} />
          </div>
          {/* Mobile fallback */}
          <div className="md:hidden h-full">
            <ChatWindow onClose={toggleChat} />
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleChat}
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
    </>
  );
};

export default ChatWidget;


import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './chat/ChatWindow';
import { ResizablePanelGroup, ResizablePanel } from './ui/resizable';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-20 md:left-6 md:min-w-80 md:min-h-96 md:max-w-2xl md:max-h-[80vh]">
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={toggleChat} />
          <ResizablePanelGroup direction="vertical" className="hidden md:flex">
            <ResizablePanel defaultSize={100} minSize={30} maxSize={100}>
              <ChatWindow onClose={toggleChat} />
            </ResizablePanel>
          </ResizablePanelGroup>
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

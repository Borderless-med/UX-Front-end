import React from 'react';

interface ChatHelperTextboxProps {
  className?: string;
}

// Fixed-position helper textbox shown near the chat widget across pages
const ChatHelperTextbox: React.FC<ChatHelperTextboxProps> = ({ className }) => {
  return (
    <div
      className={`fixed bottom-10 left-20 z-50 flex items-center ${className || ''}`}
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="bg-white border border-blue-400 rounded-lg shadow px-4 py-2 ml-2 flex flex-col justify-center"
        style={{ fontSize: '1rem', color: '#222', pointerEvents: 'auto', minWidth: '220px' }}
      >
        <span className="text-center">Hello! Need help?</span>
        <span className="text-center">Just ask me anything.</span>
      </div>
    </div>
  );
};

export default ChatHelperTextbox;

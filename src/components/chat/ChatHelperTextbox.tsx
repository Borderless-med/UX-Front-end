import React, { useEffect, useState } from 'react';

interface ChatHelperTextboxProps {
  className?: string;
}

// Fixed-position helper textbox shown near the chat widget across pages
const ChatHelperTextbox: React.FC<ChatHelperTextboxProps> = ({ className }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`hidden sm:flex fixed bottom-24 left-2 z-40 items-center ${className || ''}`}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div
        className="bg-white/95 backdrop-blur border border-blue-400 rounded-lg shadow px-2 py-1 flex flex-col justify-center"
        style={{ fontSize: '0.80rem', color: '#222', pointerEvents: 'auto', minWidth: '110px', maxWidth: '140px' }}
      >
        <span className="text-center leading-tight">Need help?</span>
        <span className="text-center leading-tight">Ask me anything.</span>
      </div>
    </div>
  );
};

export default ChatHelperTextbox;

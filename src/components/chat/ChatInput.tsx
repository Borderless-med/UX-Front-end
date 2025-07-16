
import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ value, onChange, onSend, disabled = false }: ChatInputProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend(value.trim());
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
      <div className="flex items-end space-x-2">
        <div className="flex-1 min-w-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="p-2 bg-blue-primary text-white rounded-lg hover:bg-blue-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

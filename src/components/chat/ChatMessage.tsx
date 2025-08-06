
import { User, Bot } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={`max-w-xs md:max-w-sm ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg shadow-sm ${
            isUser
              ? 'bg-blue-primary text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.text}</p>
          ) : (
            <MarkdownRenderer content={message.text} isUser={isUser} />
          )}
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {time}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

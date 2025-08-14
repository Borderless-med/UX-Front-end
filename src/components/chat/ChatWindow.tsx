
import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface HistoryItem {
  role: 'user' | 'model';
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I can help you find dental clinics, compare prices, and answer questions about dental care in Singapore and Johor Bahru. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionAppliedFilters, setSessionAppliedFilters] = useState<Record<string, any>>({});
  const [sessionCandidatePool, setSessionCandidatePool] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Convert messages to history format (exclude initial welcome message)
      const conversationHistory: HistoryItem[] = updatedMessages
        .filter(msg => msg.id !== '1') // Filter out welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      console.log('Invoking dynamic-function with conversation history:', conversationHistory);
      
      // Use Supabase edge function to route the conversation history
      const { data, error } = await supabase.functions.invoke('dynamic-function', {
        body: { 
          history: conversationHistory,
          applied_filters: sessionAppliedFilters
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log('Function response:', data);
      
      // Update session applied filters if returned by API
      if (data.applied_filters) {
        setSessionAppliedFilters(data.applied_filters);
        console.log('Updated session applied filters:', data.applied_filters);
      }
      
      // Update session candidate pool if returned by API
      if (data.candidate_pool) {
        setSessionCandidatePool(data.candidate_pool);
        console.log('Updated session candidate pool:', data.candidate_pool);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

    } catch (error) {
      console.error('Error calling dynamic-function:', error);
      
      // Display error message to user
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative w-full h-full md:rounded-lg bg-white shadow-xl border border-gray-200 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-primary text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">AI</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Concierge</h3>
            <p className="text-xs text-blue-150">Online now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatWindow;

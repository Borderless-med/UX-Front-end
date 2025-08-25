
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

// Helper function to extract user details from message text
const extractUserDetailsFromMessage = (messageText: string) => {
  const details: { name?: string; email?: string; phone?: string } = {};
  
  // Extract name (basic pattern: "My name is [Name]" or "[Name]" at start)
  const nameMatch = messageText.match(/(?:my name is|i am|i'm)\s+([^,.\n]+)/i) || 
                   messageText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
  if (nameMatch) {
    details.name = nameMatch[1].trim();
  }
  
  // Extract email
  const emailMatch = messageText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    details.email = emailMatch[0];
  }
  
  // Extract phone (international format)
  const phoneMatch = messageText.match(/\+\d{1,3}[\s-]?\d{2,3}[\s-]?\d{3,4}[\s-]?\d{3,4}/);
  if (phoneMatch) {
    details.phone = phoneMatch[0];
  }
  
  return details;
};

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
  const [sessionBookingContext, setSessionBookingContext] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    // Step 1: Take the user's new message and add it to the conversation
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
      // Step 2: Create complete history array from ALL messages (excluding welcome message)
      const history = updatedMessages
        .filter(msg => msg.id !== '1') // Exclude only the initial welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      // Step 3: Create the three session variables required by backend
      const requestBody = {
        history: history,
        applied_filters: sessionAppliedFilters || {},
        candidate_pool: sessionCandidatePool || [],
        booking_context: sessionBookingContext || {}
      };

      console.log('=== SENDING TO BACKEND ===');
      console.log('History length:', history.length);
      console.log('Complete request body:', requestBody);
      console.log('==========================');

      // Step 4: Call the Supabase Edge Function with all three variables
      const { data, error } = await supabase.functions.invoke('dynamic-function', {
        body: requestBody,
        headers: {
          'x-environment': (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
        },
      });

      if (error) {
        throw error;
      }

      // Step 5: Parse response text, applied_filters, and candidate_pool from response
      if (data && data.response) {
        // Use the response directly (AI backend already includes booking links)
        let finalResponseText = data.response;

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: finalResponseText,
          sender: 'ai',
          timestamp: new Date(),
        };

        // Step 7: Update chat display with AI response and update session variables
        setMessages(prev => [...prev, aiMessage]);
        
        // Update session state with new applied_filters and candidate_pool
        if (data.applied_filters) {
          setSessionAppliedFilters(data.applied_filters);
          console.log('Updated applied_filters:', data.applied_filters);
        }
        if (data.candidate_pool) {
          setSessionCandidatePool(data.candidate_pool);
          console.log('Updated candidate_pool:', data.candidate_pool);
        }
        if (data.booking_context) {
          setSessionBookingContext(data.booking_context);
          console.log('Updated booking_context:', data.booking_context);
        }
      } else {
        throw new Error('No response received from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
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

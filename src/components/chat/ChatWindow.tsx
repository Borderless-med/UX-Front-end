import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { restInvokeFunction } from '@/utils/restClient';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to detect environment based on hostname
const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  return 'production';
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { user, sessionId, setSessionId } = useAuth();

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- CRITICAL FIX: Use refs to hold the immediate session state ---
  const sessionAppliedFilters = useRef<Record<string, any>>({});
  const sessionCandidatePool = useRef<any[]>([]);
  const sessionBookingContext = useRef<Record<string, any>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    if (!user) {
      const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      const botResponse: Message = { id: (Date.now() + 1).toString(), text: "Hello! To get started and enjoy all the features of our AI Concierge, please sign up or log in. We'd love to help you find the perfect dental clinic!", sender: 'ai', timestamp: new Date() };
      setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user', timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const history = updatedMessages
        .filter(msg => msg.id !== '1')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      // --- CRITICAL FIX: Read the .current value from the refs ---
      const requestBody: any = {
        history: history,
        applied_filters: sessionAppliedFilters.current,
        candidate_pool: sessionCandidatePool.current,
        booking_context: sessionBookingContext.current,
        user_id: user.id
      };

      // Use sessionId from AuthContext for persistent session
      if (sessionId) {
        requestBody.session_id = sessionId;
      }

      console.log(">>>>> Sending this body to backend:", JSON.stringify(requestBody, null, 2));

      const data = await restInvokeFunction('dynamic-function', {
        body: requestBody,
        headers: { 'x-environment': getEnvironment() },
      }, {
        timeout: 30000,
        retries: 1
      });

      if (data && data.response) {
        if (data.session_id) {
          setSessionId(data.session_id);
          localStorage.setItem('gsp-chatbot-session-id', data.session_id);
          console.log('<<<<< Session ID received:', data.session_id);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        // --- CRITICAL FIX: Update the .current value of the refs ---
        if (data.applied_filters) {
          console.log("<<<<< Updating applied_filters state:", data.applied_filters);
          sessionAppliedFilters.current = data.applied_filters;
        }
        if (data.candidate_pool) {
          console.log("<<<<< Updating candidate_pool state with", data.candidate_pool.length, "clinics");
          sessionCandidatePool.current = data.candidate_pool;
        }
        if (data.booking_context) {
          console.log("<<<<< Updating booking_context state:", data.booking_context);
          sessionBookingContext.current = data.booking_context;
        }

      } else {
        throw new Error('No response received from AI');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || 'Sorry, I encountered an error. Please try again.',
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
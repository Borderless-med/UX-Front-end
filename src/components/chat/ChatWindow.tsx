import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
// --- NEW: Import the useAuth hook to get user data ---
import { restInvokeFunction } from '@/utils/restClient'; // <--- ADD THIS LINE
import { useAuth } from '@/contexts/AuthContext';

// --- PASTE THIS HELPER FUNCTION HERE ---

// Helper function to detect environment based on hostname
const getEnvironment = () => {
  const hostname = window.location.hostname;
  
  // If it's a localhost or development domain, it's development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  
  // Otherwise, assume it's production (Vercel preview URLs, live domain, etc.)
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
  // --- NEW: Get the user object from the AuthContext ---
  const { user } = useAuth();

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

    // --- Step 1: Add the user's new message to the UI ---
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
      // --- Step 2: Prepare the request for the backend ---
      const history = updatedMessages
        .filter(msg => msg.id !== '1')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      const requestBody: any = {
        history: history,
        applied_filters: sessionAppliedFilters || {},
        candidate_pool: sessionCandidatePool || [],
        booking_context: sessionBookingContext || {}
      };

      // Read the existing session ID from local storage
      const sessionId = localStorage.getItem('chat_session_id');
      if (sessionId) {
        requestBody.session_id = sessionId;
      }

      // =================================================================
      // --- NEW: Add the user's ID to the request if they are logged in ---
      if (user) {
        requestBody.user_id = user.id;
        console.log('Authenticated user ID sent:', user.id);
      } else {
        console.log('No authenticated user found.');
      }
      // =================================================================

      
      // This calls the Edge Function using the reusable REST client
      const data = await restInvokeFunction('dynamic-function', {
        body: requestBody,
        headers: {
          'x-environment': getEnvironment(), // This tells the function whether we are in dev or prod
        },
      }, {
        timeout: 30000,  // 30 second timeout for AI responses
        retries: 1       // Single retry for edge functions
      });

      // --- Step 4: Process the successful response ---
      if (data && data.response) {
        // Store the session ID from the response
        if (data.session_id) {
          localStorage.setItem('chat_session_id', data.session_id);
          console.log('Session ID received and saved:', data.session_id);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
        };

        // --- Step 5: Update the UI with the AI's response ---
        setMessages(prev => [...prev, aiMessage]);
        
        if (data.applied_filters) setSessionAppliedFilters(data.applied_filters);
        if (data.candidate_pool) setSessionCandidatePool(data.candidate_pool);
        if (data.booking_context) setSessionBookingContext(data.booking_context);
        
      } else {
        throw new Error('No response received from AI');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        // --- NEW: Display the specific error message from the backend ---
        text: error.message || 'Sorry, I encountered an error while processing your message. Please try again.',
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
          // ... (typing indicator code is unchanged) ...
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
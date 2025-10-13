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
  onAuthClick?: () => void;
}

const ChatWindow = ({ onClose, onAuthClick }: ChatWindowProps) => {
  const { user, session, sessionId, setSessionId } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Hi there! I'm your AI Dental Expert.\n\n🎯 **I can help you with:**\n• "Should I get my root canal in JB or Singapore?"\n• "Which clinic has the best implant reviews?"\n• "What's the real cost difference for my treatment?"\n\n💬 I've analyzed 500+ real patient reviews to give you honest, personalized recommendations.\n\n${!user ? "**Please sign up to start chatting** (FREE account with 40 conversations per month)" : "What dental question can I help you with today?"}`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- FIXED: Use state to hold session state (not refs) ---
  const [sessionAppliedFilters, setSessionAppliedFilters] = useState<Record<string, any>>({});
  const [sessionCandidatePool, setSessionCandidatePool] = useState<any[]>([]);
  const [sessionBookingContext, setSessionBookingContext] = useState<Record<string, any>>({});
  const [sessionStateLoaded, setSessionStateLoaded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- NEW: Restore session state when component mounts ---
  useEffect(() => {
    const restoreSessionState = async () => {
      if (user && sessionId && !sessionStateLoaded) {
        try {
          console.log(`🔄 Restoring session state for session: ${sessionId}`);
          // Debug: Show session and Authorization header value before restore-session
          console.log("DEBUG: session (restore)", session);
          console.log("DEBUG: Authorization header (restore)", session?.access_token);
          
          const data = await restInvokeFunction('restore-session', {
            body: {
              session_id: sessionId,
              user_id: user.id
            },
            headers: {
              'x-environment': getEnvironment(),
              'Authorization': 'Bearer ' + session?.access_token
            }
          });

          if (data && data.success && data.state) {
            console.log('✅ Session state restored:', data.state);
            setSessionAppliedFilters(data.state.applied_filters || {});
            setSessionCandidatePool(data.state.candidate_pool || []);
            setSessionBookingContext(data.state.booking_context || {});
            setSessionStateLoaded(true);
          } else {
            console.log('ℹ️ No previous session state found, starting fresh');
            setSessionStateLoaded(true);
          }
        } catch (error) {
          console.warn('⚠️ Could not restore session state:', error);
          setSessionStateLoaded(true); // Still mark as loaded to prevent infinite loops
        }
      } else if (!user || !sessionId) {
        // Reset session state if no user or session
        setSessionAppliedFilters({});
        setSessionCandidatePool([]);
        setSessionBookingContext({});
        setSessionStateLoaded(true);
      }
    };

    restoreSessionState();
  }, [user, sessionId, sessionStateLoaded]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    if (!user) {
      const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Create a more compelling sign-up CTA message
      const botResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        text: `Great question! 🤔 To give you personalized recommendations based on 500+ real patient reviews, please sign up for a free account first.\n\n🔐 **FREE Account Includes:** 40 conversations per month\n\n🎯 I can help answer:\n• "Which JB clinic has the best implant reviews?"\n• "What's the real cost difference vs Singapore?"\n• "Is this clinic worth the 2-hour travel?"\n\n**Sign up takes 30 seconds!** ${onAuthClick ? 'Click the blue button below to get started.' : 'Click the registration button in the top menu.'}`, 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setTimeout(() => setMessages(prev => [...prev, botResponse]), 500);
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user', timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);
    // Debug: Show session and Authorization header value before chat send
    console.log("DEBUG: session (chat)", session);
    console.log("DEBUG: Authorization header (chat)", session?.access_token);

    try {
      const history = updatedMessages
        .filter(msg => msg.id !== '1')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          content: msg.text
        }));

      // --- FIXED: Use state values instead of refs ---
      const requestBody: any = {
        history: history,
        applied_filters: sessionAppliedFilters,
        candidate_pool: sessionCandidatePool,
        booking_context: sessionBookingContext,
        user_id: user.id
      };

      // Use sessionId from AuthContext for persistent session
      if (sessionId) {
        requestBody.session_id = sessionId;
      }

      console.log(">>>>> Sending this body to backend:", JSON.stringify(requestBody, null, 2));

      const data = await restInvokeFunction('dynamic-function', {
        body: requestBody,
        headers: {
          'x-environment': getEnvironment(),
          'Authorization': 'Bearer ' + session?.access_token
        },
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

        // --- FIXED: Update state values instead of refs ---
        if (data.applied_filters) {
          console.log("<<<<< Updating applied_filters state:", data.applied_filters);
          setSessionAppliedFilters(data.applied_filters);
        }
        if (data.candidate_pool) {
          console.log("<<<<< Updating candidate_pool state with", data.candidate_pool.length, "clinics");
          setSessionCandidatePool(data.candidate_pool);
        }
        if (data.booking_context) {
          console.log("<<<<< Updating booking_context state:", data.booking_context);
          setSessionBookingContext(data.booking_context);
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
            <span className="text-sm font-bold">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Dental Expert</h3>
            <p className="text-xs text-blue-150">{!user ? "Sign up required" : "40 chats/month • Online now"}</p>
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
      <div>
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={isTyping}
        />
        
        {/* Sign-up CTA for unauthenticated users */}
        {!user && onAuthClick && (
          <div className="p-4 bg-blue-50 border-t border-blue-100">
            <button
              onClick={() => {
                onClose();
                onAuthClick();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🚀 Sign Up Free - Start Chatting Now!
            </button>
            <p className="text-xs text-gray-600 text-center mt-2">40 conversations per month • No credit card required</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
import { ChatContext, ChatContextConfig } from '@/types/chat';

export const CHAT_CONTEXTS: Record<NonNullable<ChatContext>, ChatContextConfig> = {
  "ai-concierge": {
    welcome: "Hi! I'm your AI dental concierge. I can help you find the perfect dental clinic in Singapore and Johor Bahru, compare prices, and answer any questions about dental care. What would you like help with today?"
  },
  "direct-chat": {
    welcome: "Hello! I can help you find dental clinics, compare prices, and answer questions about dental care in Singapore and Johor Bahru. What can I help you with today?"
  }
};

export const getContextConfig = (context: ChatContext): ChatContextConfig => {
  if (!context || !CHAT_CONTEXTS[context]) {
    return CHAT_CONTEXTS["direct-chat"];
  }
  return CHAT_CONTEXTS[context];
};
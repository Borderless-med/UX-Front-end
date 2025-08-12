import { ChatContext, ChatContextConfig } from '@/types/chat';

export const CHAT_CONTEXTS: Record<NonNullable<ChatContext>, ChatContextConfig> = {
  "ai-concierge": {
    welcome: "Hi! I'm here to help you find the perfect dental clinic in Singapore and Johor Bahru. Let's start by understanding what you're looking for. What type of dental treatment do you need?",
    quickReplies: [
      { text: "General Checkup & Cleaning", action: "I need a general checkup and cleaning" },
      { text: "Teeth Whitening", action: "I'm interested in teeth whitening" },
      { text: "Dental Implants", action: "I need dental implants" },
      { text: "Braces/Orthodontics", action: "I'm looking for braces or orthodontic treatment" },
      { text: "Emergency Dental Care", action: "I need emergency dental care" }
    ]
  },
  "direct-chat": {
    welcome: "Hello! I can help you find dental clinics, compare prices, and answer questions about dental care in Singapore and Johor Bahru. What can I help you with today?",
    quickReplies: [
      { text: "Find a dentist near me", action: "Help me find a dentist near me" },
      { text: "Compare clinic prices", action: "I want to compare clinic prices" },
      { text: "Emergency dental help", action: "I need emergency dental help" },
      { text: "Treatment recommendations", action: "Give me treatment recommendations" },
      { text: "Clinic reviews", action: "Show me clinic reviews" }
    ]
  }
};

export const getContextConfig = (context: ChatContext): ChatContextConfig => {
  if (!context || !CHAT_CONTEXTS[context]) {
    return CHAT_CONTEXTS["direct-chat"];
  }
  return CHAT_CONTEXTS[context];
};
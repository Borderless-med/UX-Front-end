export type ChatContext = "ai-concierge" | "direct-chat" | null;

export interface ChatContextConfig {
  welcome: string;
}
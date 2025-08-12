export type ChatContext = "ai-concierge" | "direct-chat" | null;

export interface QuickReplyButton {
  text: string;
  action: string;
}

export interface ChatContextConfig {
  welcome: string;
  quickReplies: QuickReplyButton[];
}
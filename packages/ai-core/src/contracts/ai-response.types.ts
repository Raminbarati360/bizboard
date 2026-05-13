export interface AiChatUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AiChatResponse {
  provider: string;
  model: string;
  content: string;
  usage?: AiChatUsage;
  raw?: unknown;
}

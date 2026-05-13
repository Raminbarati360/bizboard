import type { AiMessage } from './ai-message.types.js';
import type { AiChatResponse } from './ai-response.types.js';
import type { AiToolDefinition } from './ai-tool.types.js';

export interface AiChatRequest {
  model: string;
  messages: AiMessage[];
  tools?: AiToolDefinition[];
  temperature?: number;
  responseFormat?: 'text' | 'json';
  requestId?: string;
}

export interface AiProvider {
  readonly name: string;
  chat(request: AiChatRequest): Promise<AiChatResponse>;
}

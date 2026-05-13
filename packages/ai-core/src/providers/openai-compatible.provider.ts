import type { AiProvider, AiChatRequest } from '../contracts/ai-provider.interface.js';
import type { AiChatResponse } from '../contracts/ai-response.types.js';

export interface OpenAiCompatibleProviderOptions {
  name: string;
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
}

export class OpenAiCompatibleProvider implements AiProvider {
  readonly name: string;
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: OpenAiCompatibleProviderOptions) {
    this.name = options.name;
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? 60_000;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    if (!this.apiKey) {
      return {
        provider: this.name,
        model: request.model,
        content: 'AI provider is configured but API key is not set. This is expected on a safe staging skeleton.',
        usage: { totalTokens: 0 }
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.apiKey}`,
          ...this.defaultHeaders
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.2,
          response_format: request.responseFormat === 'json' ? { type: 'json_object' } : undefined
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`AI provider ${this.name} failed with ${response.status}: ${body.slice(0, 500)}`);
      }

      const raw = await response.json() as any;
      return {
        provider: this.name,
        model: request.model,
        content: raw.choices?.[0]?.message?.content ?? '',
        usage: {
          promptTokens: raw.usage?.prompt_tokens,
          completionTokens: raw.usage?.completion_tokens,
          totalTokens: raw.usage?.total_tokens
        },
        raw
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

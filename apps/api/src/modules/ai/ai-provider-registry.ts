import { Injectable } from '@nestjs/common';
import { loadEnv } from '@bizboard/config';
import { DeepSeekProvider, GapGptProvider, OpenAiProvider, type AiProvider } from '@bizboard/ai-core';

@Injectable()
export class AiProviderRegistry {
  private readonly providers: Map<string, AiProvider>;
  private readonly env = loadEnv(process.env);

  constructor() {
    this.providers = new Map<string, AiProvider>([
      [
        'gapgpt',
        new GapGptProvider({
          baseUrl: this.env.GAPGPT_BASE_URL,
          apiKey: this.env.GAPGPT_API_KEY,
          timeoutMs: this.env.AI_REQUEST_TIMEOUT_MS
        })
      ],
      [
        'openai',
        new OpenAiProvider({
          baseUrl: this.env.OPENAI_BASE_URL,
          apiKey: this.env.OPENAI_API_KEY,
          organizationId: this.env.OPENAI_ORGANIZATION_ID,
          projectId: this.env.OPENAI_PROJECT_ID,
          timeoutMs: this.env.AI_REQUEST_TIMEOUT_MS
        })
      ],
      [
        'deepseek',
        new DeepSeekProvider({
          baseUrl: this.env.DEEPSEEK_BASE_URL,
          apiKey: this.env.DEEPSEEK_API_KEY,
          timeoutMs: this.env.AI_REQUEST_TIMEOUT_MS
        })
      ]
    ]);
  }

  getDefaultProvider() {
    return this.get(this.env.AI_DEFAULT_PROVIDER);
  }

  get(name: string) {
    const provider = this.providers.get(name);
    if (!provider) throw new Error(`AI provider is not registered: ${name}`);
    return provider;
  }

  modelFor(providerName = this.env.AI_DEFAULT_PROVIDER) {
    if (providerName === 'gapgpt') return this.env.GAPGPT_CHAT_MODEL;
    if (providerName === 'openai') return this.env.OPENAI_CHAT_MODEL;
    if (providerName === 'deepseek') return this.env.DEEPSEEK_CHAT_MODEL;
    return this.env.AI_DEFAULT_CHAT_MODEL;
  }
}

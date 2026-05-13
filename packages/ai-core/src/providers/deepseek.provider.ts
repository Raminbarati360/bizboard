import { OpenAiCompatibleProvider } from './openai-compatible.provider.js';

export class DeepSeekProvider extends OpenAiCompatibleProvider {
  constructor(options: { baseUrl: string; apiKey?: string; timeoutMs?: number }) {
    super({ name: 'deepseek', ...options });
  }
}

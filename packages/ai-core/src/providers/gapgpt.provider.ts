import { OpenAiCompatibleProvider } from './openai-compatible.provider.js';

export class GapGptProvider extends OpenAiCompatibleProvider {
  constructor(options: { baseUrl: string; apiKey?: string; timeoutMs?: number }) {
    super({ name: 'gapgpt', ...options });
  }
}

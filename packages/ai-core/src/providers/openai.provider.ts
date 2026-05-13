import { OpenAiCompatibleProvider } from './openai-compatible.provider.js';

export class OpenAiProvider extends OpenAiCompatibleProvider {
  constructor(options: { baseUrl: string; apiKey?: string; timeoutMs?: number; organizationId?: string; projectId?: string }) {
    super({
      name: 'openai',
      baseUrl: options.baseUrl,
      apiKey: options.apiKey,
      timeoutMs: options.timeoutMs,
      defaultHeaders: {
        ...(options.organizationId ? { 'OpenAI-Organization': options.organizationId } : {}),
        ...(options.projectId ? { 'OpenAI-Project': options.projectId } : {})
      }
    });
  }
}

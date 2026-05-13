import { Injectable } from '@nestjs/common';
import { SHOPPING_ASSISTANT_SYSTEM_PROMPT, aiTools } from '@bizboard/ai-core';
import type { AiMessage } from '@bizboard/ai-core';
import { AiProviderRegistry } from './ai-provider-registry.js';
import { AiUsageLoggerService } from './ai-usage-logger.service.js';

@Injectable()
export class AiRouterService {
  constructor(
    private readonly registry: AiProviderRegistry,
    private readonly usageLogger: AiUsageLoggerService
  ) {}

  async shoppingAssistant(userMessage: string) {
    const requestId = crypto.randomUUID();
    const startedAt = Date.now();
    const provider = this.registry.getDefaultProvider();
    const model = this.registry.modelFor(provider.name);
    const messages: AiMessage[] = [
      { role: 'system', content: SHOPPING_ASSISTANT_SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ];

    const response = await provider.chat({
      requestId,
      model,
      messages,
      tools: aiTools,
      responseFormat: 'text',
      temperature: 0.2
    });

    this.usageLogger.log(requestId, response, startedAt);
    return { requestId, response };
  }
}

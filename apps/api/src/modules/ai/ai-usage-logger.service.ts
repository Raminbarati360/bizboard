import { Injectable } from '@nestjs/common';
import type { AiChatResponse } from '@bizboard/ai-core';

@Injectable()
export class AiUsageLoggerService {
  log(requestId: string, response: AiChatResponse, startedAt: number) {
    const latencyMs = Date.now() - startedAt;
    console.log(JSON.stringify({
      event: 'ai.request.completed',
      requestId,
      provider: response.provider,
      model: response.model,
      latencyMs,
      usage: response.usage
    }));
  }
}

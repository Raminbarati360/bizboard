import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { aiMessageSchema } from '@bizboard/schemas';
import type { AiAssistantResponse } from '@bizboard/types';
import { AiRouterService } from './ai-router.service.js';

@ApiTags('AI')
@Controller('ai/conversations')
export class AiController {
  constructor(private readonly aiRouter: AiRouterService) {}

  @Post()
  createConversation() {
    return { id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  }

  @Post(':id/messages')
  async message(@Param('id') id: string, @Body() body: unknown): Promise<AiAssistantResponse & { conversationId: string; providerRequestId: string }> {
    const input = aiMessageSchema.parse(body);
    const { requestId, response } = await this.aiRouter.shoppingAssistant(input.message);
    return {
      conversationId: id,
      providerRequestId: requestId,
      message: response.content || `برای «${input.message}» فعلاً اتصال AI mock/safe فعال است. بعد از تنظیم GAPGPT_API_KEY پاسخ واقعی از AiRouterService می‌آید.`,
      recommendedProducts: [],
      followUpQuestions: ['بودجه‌تان چقدر است؟', 'استفاده اصلی شما چیست؟', 'خرید از فروشگاه دارای سایت می‌خواهید یا پرداخت امن بیزبورد؟'],
      confidence: 'low',
      reasoningSummaryForUser: 'همه درخواست‌های AI از AiRouterService عبور می‌کند و هیچ provider مستقیمی داخل business logic صدا زده نمی‌شود.',
      filtersUsed: {}
    };
  }
}

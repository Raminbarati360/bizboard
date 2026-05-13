import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiProviderRegistry } from './ai-provider-registry.js';
import { AiRouterService } from './ai-router.service.js';
import { AiUsageLoggerService } from './ai-usage-logger.service.js';

@Module({
  controllers: [AiController],
  providers: [AiProviderRegistry, AiRouterService, AiUsageLoggerService]
})
export class AiModule {}

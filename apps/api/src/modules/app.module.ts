import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { BusinessesModule } from './businesses/businesses.module.js';
import { AiModule } from './ai/ai.module.js';
import { CommerceModule } from './commerce/commerce.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    CatalogModule,
    BusinessesModule,
    AiModule,
    CommerceModule,
    AdminModule
  ]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller.js';
import { OffersController } from './offers.controller.js';
import { CatalogService } from './catalog.service.js';

@Module({ controllers: [CatalogController, OffersController], providers: [CatalogService] })
export class CatalogModule {}

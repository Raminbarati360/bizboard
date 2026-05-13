import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service.js';

@ApiTags('Offers')
@Controller('products/:id/offers')
export class OffersController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  offers(@Param('id') productId: string) {
    return this.catalog.offers(productId);
  }
}

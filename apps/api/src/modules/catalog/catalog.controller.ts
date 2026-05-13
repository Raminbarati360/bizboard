import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service.js';

@ApiTags('Catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  categories(@Query('type') type?: string) {
    return this.catalog.categories(type);
  }

  @Get('products')
  products(@Query('q') q?: string) {
    return this.catalog.products(q);
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    const product = this.catalog.productBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}

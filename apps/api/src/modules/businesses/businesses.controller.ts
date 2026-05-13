import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createBusinessSchema } from '@bizboard/schemas';

@ApiTags('Business')
@Controller('businesses')
export class BusinessesController {
  @Post()
  create(@Body() body: unknown) {
    const input = createBusinessSchema.parse(body);
    return {
      id: `biz-${input.slug}`,
      status: 'draft',
      ...input,
      createdAt: new Date().toISOString(),
      message: 'Business shell created. Persist with repository in Sprint 2.'
    };
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return {
      id: `biz-${slug}`,
      slug,
      name: 'کسب‌وکار نمونه بیزبورد',
      businessType: 'online_shop',
      ratingAvg: 4.4,
      ratingCount: 12,
      isVerified: true,
      sections: ['overview', 'products', 'reviews', 'contact']
    };
  }
}

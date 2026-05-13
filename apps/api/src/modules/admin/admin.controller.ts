import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  @Get('products')
  products() {
    return { items: [], note: 'Admin product list shell.' };
  }

  @Get('raw-ingestion-items')
  rawIngestionItems() {
    return { items: [], note: 'Raw ingestion review shell.' };
  }
}

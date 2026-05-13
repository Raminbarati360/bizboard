import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Commerce')
@Controller('orders')
export class OrdersController {
  @Post()
  create(@Body() body: unknown) {
    return {
      id: crypto.randomUUID(),
      status: 'pending_payment',
      payload: body,
      createdAt: new Date().toISOString(),
      note: 'Order shell. Persist and ledger flow in Sprint 5.'
    };
  }
}

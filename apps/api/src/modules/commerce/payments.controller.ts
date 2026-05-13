import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  @Post(':orderId/attempts')
  createAttempt(@Param('orderId') orderId: string) {
    return {
      id: crypto.randomUUID(),
      orderId,
      gateway: 'mock',
      status: 'created',
      redirectUrl: `/mock-gateway/${orderId}`
    };
  }

  @Post('callback/:gateway')
  callback(@Param('gateway') gateway: string, @Query() query: unknown, @Body() body: unknown) {
    return {
      gateway,
      verified: false,
      idempotencyKey: crypto.randomUUID(),
      query,
      body,
      note: 'Real server-to-server verify must be implemented before production payment.'
    };
  }
}

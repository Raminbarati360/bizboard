import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { PaymentsController } from './payments.controller.js';

@Module({ controllers: [OrdersController, PaymentsController] })
export class CommerceModule {}

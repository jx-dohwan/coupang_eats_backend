import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payments.service';
import { PaymentResolver } from './payments.resolver';

@Module({
    controllers: [PaymentsController],
    imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
    providers: [PaymentService, PaymentResolver],
  })
  export class PaymentsModule { }
  
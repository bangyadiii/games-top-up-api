import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MidtransService } from './midtrans/midtrans.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MidtransGateway } from './midtrans/midtrans.gateway';
import { MidtransGateway } from './midtrans/midtrans.gateway';

@Module({
  providers: [TransactionsService, MidtransService, ConfigModule, MidtransGateway],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}

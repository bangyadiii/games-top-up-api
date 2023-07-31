import {
  Controller,
  UseGuards,
  Logger,
  Body,
  Post,
  Request,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { OrderCoinDTO } from './dto/order-coin.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { JsonResponse } from 'src/shared/Interfaces/JsonResponse';
import { User } from '@prisma/client';
import { Response } from 'express';
import { PaymentNotificationDTO } from './dto/payment-notification.dto';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('/notifications')
  async midtransWebhook(
    @Body() payload: PaymentNotificationDTO,
    @Request() request: any,
    @Res() res: Response,
  ) {
    await this.transactionService.paymentNotification(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async order(
    @Body() body: OrderCoinDTO,
    @Request() request: any,
    @Res() res: Response,
  ) {
    const data = await this.transactionService.orderCoin(
      body,
      request.user as User,
    );
    const resp: JsonResponse<typeof data> = {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    };

    return res.status(HttpStatus.OK).json(resp);
  }
}

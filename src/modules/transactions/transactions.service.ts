import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { OrderCoinDTO } from './dto/order-coin.dto';
import { MidtransService } from './midtrans/midtrans.service';
import { Logger } from '@nestjs/common/services';
import { User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentNotificationDTO } from './dto/payment-notification.dto';
import PaymentNotificationEvent from 'src/shared/Events/payment-notification.event';
import { nanoid } from 'nanoid';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly dbservice: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly midtransService: MidtransService,
  ) {}

  async paymentNotification(data: PaymentNotificationDTO) {
    const [transactionNofitication] = await this.eventEmitter.emitAsync(
      'payment.notification',
      new PaymentNotificationEvent(data),
    );
    const transaction = await this.dbservice.transaction.findUniqueOrThrow({
      where: {
        orderId: data.order_id,
      },
    });

    if (data.signature_key != transactionNofitication.signature_key)
      throw new BadRequestException('transaction invalid.');

    const transactionStatus = data.transaction_status;
    if (transactionStatus == 'capture') {
      if (data.fraud_status == 'accept') {
        transaction.status = 'Success';
      }
    } else if (transactionStatus == 'settlement') {
      transaction.status = 'Success';
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      transaction.status = 'Failed';
    } else if (transactionStatus == 'pending') {
      transaction.status = 'Pending';
    }
    try {
      const updated = await this.dbservice.transaction.update({
        data: {
          status: transaction.status,
        },
        where: {
          id: transaction.id,
          updatedAt: transaction.updatedAt,
        },
      });
      return updated;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async orderCoin(data: OrderCoinDTO, user: User) {
    try {
      const product = await this.dbservice.product.findUniqueOrThrow({
        where: { id: data.productId },
      });

      const transaction = await this.dbservice.transaction.create({
        data: {
          grossAmount: product.price,
          orderId: `PGORDERID_${nanoid(10)}`.toUpperCase(),
          productId: product.id,
          userId: user.id,
          status: 'Pending',
        },
      });

      if (!transaction) {
        throw new InternalServerErrorException('create new transaction failed');
      }

      const customerInformation = {
        email: user.email,
        name: user.username,
      };
      const transactionDetails = {
        order_id: product.id,
        gross_amount: product.price,
        quantity: product.coinQuantity,
      };

      const transactionParam = {
        customer_details: customerInformation,
        transaction_details: transactionDetails,
      };

      const result = await this.midtransService.getSnapUrl(transactionParam);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

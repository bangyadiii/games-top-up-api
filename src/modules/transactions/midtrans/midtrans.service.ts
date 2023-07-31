import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Logger } from '@nestjs/common/services';
import PaymentNotificationEvent from 'src/shared/Events/payment-notification.event';
import { PaymentNotificationDTO } from '../dto/payment-notification.dto';
import { OnEvent } from '@nestjs/event-emitter';

interface TransactionDetails {
  customer_details: {
    email: string;
    name: string;
  };
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
}

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private readonly TOKEN_AUTHORIZATION: string;
  private transactionDetail: TransactionDetails;
  private MIDTRANS_BASE_URL: string;
  private readonly MIDTRANS_V2_BASE_URL: string;
  private MIDTRANS_SERVER_KEY: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.MIDTRANS_SERVER_KEY = this.configService.getOrThrow(
      'MIDTRANS_SERVER_KEY',
    );

    if (this.configService.getOrThrow('NODE_ENV') !== 'PRODUCTION') {
      this.MIDTRANS_BASE_URL = this.configService.getOrThrow(
        'MIDTRANS_SANDBOX_URL',
      );
      this.MIDTRANS_V2_BASE_URL = this.configService.getOrThrow(
        'MIDTRANS_SANDBOX_V2_URL',
      );
    } else {
      this.MIDTRANS_BASE_URL = this.configService.getOrThrow(
        'MIDTRANS_PRODUCTION_URL',
      );
    }

    this.TOKEN_AUTHORIZATION = Buffer.from(
      this.MIDTRANS_SERVER_KEY + ':',
    ).toString('base64');
  }

  async getSnapUrl(
    transactionDetail: TransactionDetails,
  ): Promise<{ token: string; redirect_url: string }> {
    this.transactionDetail = transactionDetail;

    try {
      const result = await this.httpService.axiosRef.post(
        this.MIDTRANS_BASE_URL,
        this.transactionDetail,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${this.TOKEN_AUTHORIZATION}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return result.data;
    } catch (error: any) {
      this.logger.error(error);
      return error;
    }
  }

  @OnEvent('payment.notification', { async: true })
  async validateNotification(
    data: PaymentNotificationDTO,
  ): Promise<PaymentNotificationEvent> {
    const result =
      await this.httpService.axiosRef.get<PaymentNotificationEvent>(
        `${this.MIDTRANS_V2_BASE_URL}/${data.order_id}/status`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${this.TOKEN_AUTHORIZATION}`,
            'Content-Type': 'application/json',
          },
        },
      );

    return result.data;
  }
}

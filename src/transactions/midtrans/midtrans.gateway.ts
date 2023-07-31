import { Transaction } from '@prisma/client';

export abstract class AbstractPaymentGateway {
  abstract processPayment(transaction: Transaction): void;
}

export class PaymentGateway implements AbstractPaymentGateway {
  processPayment(transaction: Transaction): void {
    //
  }
}

export class CardGateway implements AbstractPaymentGateway {
  processPayment(transaction: Transaction): void {
    //
  }
}

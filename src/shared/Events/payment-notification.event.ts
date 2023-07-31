import { PaymentNotificationDTO } from 'src/modules/transactions/dto/payment-notification.dto';

class PaymentNotificationEvent {
  // Properti yang ada pada semua bentuk response
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;

  // Properti untuk tipe khusus credit_card
  masked_card?: string;
  bank?: string;
  card_type?: string;
  channel_response_message?: string;
  channel_response_code?: string;
  approval_code?: string;

  // Properti untuk tipe khusus gopay
  settlement_time?: string;

  // Properti untuk tipe khusus qris
  issuer?: string;
  acquirer?: string;

  // Properti untuk tipe khusus bank_transfer
  va_numbers?: { va_number: string; bank: string }[];
  payment_amounts?: { paid_at: string; amount: string }[];

  constructor(data: PaymentNotificationDTO) {
    this.transaction_id = data.transaction_id;
    this.order_id = data.order_id;
    this.transaction_time = data.transaction_time;
    this.transaction_status = data.transaction_status;
  }
}

export default PaymentNotificationEvent;

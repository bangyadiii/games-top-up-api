export type PaymentNotificationDTO = {
  // Menambahkan properti yang ada pada semua bentuk response
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
} & ( // Tambahkan tipe-tipe khusus untuk tiap bentuk response sebagai bagian dari tipe union
  | {
      payment_type: 'credit_card';
      masked_card: string;
      bank: string;
      card_type: string;
      channel_response_message: string;
      channel_response_code: string;
      approval_code: string;
    }
  | { payment_type: 'gopay'; settlement_time: string }
  | { payment_type: 'qris'; issuer: string; acquirer: string }
  | {
      payment_type: 'bank_transfer';
      va_numbers: { va_number: string; bank: string }[];
      payment_amounts: { paid_at: string; amount: string }[];
    }
);

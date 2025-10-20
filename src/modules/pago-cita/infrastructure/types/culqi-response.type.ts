export interface CulqiChargeResponse {
  id: string;
  object: 'charge' | 'order';
  amount: number;
  amount_refunded: number;
  currency_code: string;
  email: string;
  description: string;
  source?: {
    id: string;
    object: string;
    brand?: string;
    last4?: string;
  };
  outcome: {
    type: string;
    code: string;
    merchant_message: string;
    user_message: string;
  };
  creation_date: number;
  payment_url?: string;
  qr_code?: string;
  [key: string]: any;
}

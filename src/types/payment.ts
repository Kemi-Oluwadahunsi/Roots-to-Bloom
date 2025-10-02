// Payment and Order related types

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
  created: number;
}

export interface CheckoutSession {
  id: string;
  url: string;
  success_url: string;
  cancel_url: string;
  customer_email?: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface OrderData {
  userId?: string;
  sessionId?: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  shipping: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  paymentIntentId?: string;
  paymentStatus: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckoutRequest {
  items: {
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  shipping: ShippingInfo;
  userId?: string;
  sessionId?: string;
  currency?: string;
}

export interface PaymentMetadata {
  orderId: string;
  userId?: string;
  sessionId?: string;
  customerEmail: string;
}


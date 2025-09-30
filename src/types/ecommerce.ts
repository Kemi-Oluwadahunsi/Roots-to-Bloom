// E-commerce Types and Interfaces
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  sizePrice?: {
    size: string;
    price: number;
  };
  addedAt: Date;
  userId?: string; // For authenticated users
  sessionId?: string; // For guest users
}

export interface Cart {
  id: string;
  userId?: string; // For authenticated users
  sessionId?: string; // For guest users
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
}

export interface EnhancedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  stock: number;
  sku?: string;
  variants?: ProductVariant[];
  sizePrices?: {
    size: string;
    price: number;
  }[];
  isActive: boolean;
  tags: string[];
  weight?: number; // For shipping calculations
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string; // For authenticated users
  sessionId?: string; // For guest users
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variant?: ProductVariant;
  total: number;
}

export interface Payment {
  id: string;
  orderId: string;
  userId?: string;
  sessionId?: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'wallet' | 'netbanking';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  gateway: 'stripe' | 'razorpay' | 'paypal';
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  cities?: string[];
  rates: {
    standard: number;
    express: number;
    overnight: number;
  };
  freeShippingThreshold?: number;
  isActive: boolean;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  selectedItems: Set<string>; // Track selected items for checkout
  addToCart: (product: EnhancedProduct, quantity: number, sizePrice?: { size: string; price: number }) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  updateCartItemSize: (itemId: string, sizePrice: { size: string; price: number }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  getCartTotal: () => number;
  getSelectedTotal: () => number;
  getCartItemCount: () => number;
  syncCartWithUser: (userId: string) => Promise<void>;
  mergeGuestCart: (sessionId: string, userId: string) => Promise<void>;
}

export interface CheckoutContextType {
  currentStep: number;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentMethod: string;
  shippingMethod: string;
  discountCode: string;
  discount: Discount | null;
  order: Order | null;
  loading: boolean;
  error: string | null;
  setCurrentStep: (step: number) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address) => void;
  setPaymentMethod: (method: string) => void;
  setShippingMethod: (method: string) => void;
  applyDiscount: (code: string) => Promise<boolean>;
  createOrder: () => Promise<Order>;
  processPayment: (order: Order) => Promise<Payment>;
}

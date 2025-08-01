export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  features: string[];
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  additionalInfo?: string;
}

export interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isValid: boolean;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  discount: number;
  finalAmount: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}
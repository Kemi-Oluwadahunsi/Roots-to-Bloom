import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { OrderData, ShippingInfo } from '../types/payment';
import type { CartItem } from '../types/ecommerce';

const ORDERS_COLLECTION = 'orders';

/**
 * Create a new order in Firestore
 * @param orderData - Order data
 * @returns Promise<string> - Order ID
 */
export const createOrder = async (
  cartItems: CartItem[],
  shipping: ShippingInfo,
  userId?: string,
  sessionId?: string,
  currency: string = 'MYR'
): Promise<string> => {
  try {
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% tax
    const shippingCost = 0; // Will be calculated by shipping provider
    const discount = 0; // Will be calculated if discount code applied
    const total = subtotal + tax + shippingCost - discount;

    // Format items for order
    const items = cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      size: item.sizePrice?.size || 'Standard',
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData: Record<string, unknown> = {
      items,
      shipping,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      currency,
      paymentStatus: 'pending' as const,
      orderStatus: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add userId if it exists
    if (userId) {
      orderData.userId = userId;
    }

    // Only add sessionId if it exists
    if (sessionId) {
      orderData.sessionId = sessionId;
    }

    const ordersRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(ordersRef, orderData);
    
    console.log('Order created successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Get order by ID
 * @param orderId - Order ID
 * @returns Promise<OrderData | null>
 */
export const getOrder = async (orderId: string): Promise<OrderData | null> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return null;
    }

    const data = orderSnap.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as OrderData;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

/**
 * Update order payment status
 * @param orderId - Order ID
 * @param paymentIntentId - Stripe Payment Intent ID
 * @param status - Payment status
 */
export const updateOrderPaymentStatus = async (
  orderId: string,
  paymentIntentId: string,
  status: OrderData['paymentStatus']
): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      paymentIntentId,
      paymentStatus: status,
      orderStatus: status === 'succeeded' ? 'confirmed' : 'pending',
      updatedAt: serverTimestamp(),
    });
    
    console.log('Order payment status updated:', orderId);
  } catch (error) {
    console.error('Error updating order payment status:', error);
    throw new Error('Failed to update order');
  }
};

/**
 * Get user orders
 * @param userId - User ID
 * @returns Promise<OrderData[]>
 */
export const getUserOrders = async (userId: string): Promise<OrderData[]> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: OrderData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as OrderData);
    });

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Update order status
 * @param orderId - Order ID
 * @param status - Order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderData['orderStatus']
): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Order status updated:', orderId, status);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Find pending order by email (for payment verification)
 * @param email - Customer email
 * @returns Promise<string | null> - Order ID
 */
export const findPendingOrderByEmail = async (email: string): Promise<string | null> => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where('shipping.email', '==', email),
      where('paymentStatus', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding pending order:', error);
    return null;
  }
};

/**
 * Generate order number
 * Format: ORD-YYYYMMDD-XXXXX
 */
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
};


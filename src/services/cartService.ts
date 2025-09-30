import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Cart, CartItem } from "../types/ecommerce";

const CARTS_COLLECTION = "carts";

// Generate session ID for guest users
export const generateSessionId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID for guest users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

// Create a new cart
const createCart = (userId?: string, sessionId?: string): Cart => {
  const now = new Date();
  return {
    id: userId || sessionId || generateSessionId(),
    userId: userId || '',
    sessionId: sessionId || '',
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    createdAt: now,
    updatedAt: now,
  };
};

// Get user's cart from Firebase
export const getUserCart = async (userId: string): Promise<Cart | null> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const data = cartSnap.data() as {
        userId?: string;
        sessionId?: string;
        items?: CartItem[];
        subtotal?: number;
        tax?: number;
        shipping?: number;
        discount?: number;
        total?: number;
        createdAt?: unknown;
        updatedAt?: unknown;
      };
      return {
        id: cartSnap.id,
        userId: data.userId,
        sessionId: data.sessionId,
        items: data.items || [],
        subtotal: data.subtotal || 0,
        tax: data.tax || 0,
        shipping: data.shipping || 0,
        discount: data.discount || 0,
        total: data.total || 0,
        createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
        updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
      };
    }
    
    // Create new cart if none exists
    const newCart = createCart(userId);
    await setDoc(cartRef, {
      ...newCart,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return newCart;
  } catch (error) {
    console.error("Error getting user cart:", error);
    throw new Error("Failed to get user cart");
  }
};

// Get guest cart from localStorage
export const getGuestCart = async (): Promise<Cart | null> => {
  try {
    const sessionId = getSessionId();
    const cartData = localStorage.getItem(`guest_cart_${sessionId}`);
    
    if (cartData) {
      const cart = JSON.parse(cartData);
      // Convert date strings back to Date objects
      cart.createdAt = new Date(cart.createdAt);
      cart.updatedAt = new Date(cart.updatedAt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cart.items = cart.items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
      return cart;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting guest cart:", error);
    return null;
  }
};

// Add item to user's cart
export const addToUserCart = async (userId: string, item: CartItem): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    
    // Check if item already exists (same product and variant)
    const cartSnap = await getDoc(cartRef);
    let existingItems: CartItem[] = [];
    
    if (cartSnap.exists()) {
      const data = cartSnap.data() as { items?: CartItem[] };
      existingItems = data.items || [];
    }
    
    // Check if item with same product and sizePrice exists
    const existingItemIndex = existingItems.findIndex(
      existingItem => 
        existingItem.productId === item.productId && 
        JSON.stringify(existingItem.sizePrice || {}) === JSON.stringify(item.sizePrice || {})
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      existingItems[existingItemIndex].quantity += item.quantity;
      existingItems[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item - clean the item data to remove undefined values
      const cleanItem = {
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        ...(item.sizePrice && { sizePrice: item.sizePrice }),
        addedAt: item.addedAt,
        userId: item.userId || '',
        sessionId: item.sessionId || '',
      };
      existingItems.push(cleanItem);
    }
    
    await setDoc(cartRef, {
      userId,
      items: existingItems,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
  } catch (error) {
    console.error("Error adding to user cart:", error);
    throw new Error("Failed to add item to user cart");
  }
};

// Add item to guest cart
export const addToGuestCart = async (item: CartItem): Promise<void> => {
  try {
    const sessionId = getSessionId();
    let cart = await getGuestCart();
    
    if (!cart) {
      cart = createCart(undefined, sessionId);
    }
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      existingItem => 
        existingItem.productId === item.productId && 
        JSON.stringify(existingItem.sizePrice || {}) === JSON.stringify(item.sizePrice || {})
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item
      cart.items.push(item);
    }
    
    cart.updatedAt = new Date();
    
    // Save to localStorage
    localStorage.setItem(`guest_cart_${sessionId}`, JSON.stringify(cart));
    
  } catch (error) {
    console.error("Error adding to guest cart:", error);
    throw new Error("Failed to add item to guest cart");
  }
};

// Update user cart item quantity
export const updateUserCartItem = async (userId: string, itemId: string, quantity: number): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      throw new Error("Cart not found");
    }
    
    const cartData = cartSnap.data() as { items?: CartItem[] };
    const items: CartItem[] = cartData.items || [];
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }
    
    items[itemIndex].quantity = quantity;
    
    await updateDoc(cartRef, {
      items,
      updatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Error updating user cart item:", error);
    throw new Error("Failed to update cart item");
  }
};

// Update user cart item size and price
export const updateUserCartItemSize = async (userId: string, itemId: string, sizePrice: { size: string; price: number }): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      throw new Error("Cart not found");
    }
    
    const cartData = cartSnap.data() as { items?: CartItem[] };
    const items: CartItem[] = cartData.items || [];
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }
    
    items[itemIndex].price = sizePrice.price;
    items[itemIndex].sizePrice = sizePrice;
    
    await updateDoc(cartRef, {
      items,
      updatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Error updating user cart item size:", error);
    throw new Error("Failed to update cart item size");
  }
};

// Update guest cart item quantity
export const updateGuestCartItem = async (itemId: string, quantity: number): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const cart = await getGuestCart();
    
    if (!cart) {
      throw new Error("Cart not found");
    }
    
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = new Date();
    
    localStorage.setItem(`guest_cart_${sessionId}`, JSON.stringify(cart));
    
  } catch (error) {
    console.error("Error updating guest cart item:", error);
    throw new Error("Failed to update cart item");
  }
};

// Update guest cart item size and price
export const updateGuestCartItemSize = async (itemId: string, sizePrice: { size: string; price: number }): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const cart = await getGuestCart();
    
    if (!cart) {
      throw new Error("Cart not found");
    }
    
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }
    
    cart.items[itemIndex].price = sizePrice.price;
    cart.items[itemIndex].sizePrice = sizePrice;
    cart.updatedAt = new Date();
    
    localStorage.setItem(`guest_cart_${sessionId}`, JSON.stringify(cart));
    
  } catch (error) {
    console.error("Error updating guest cart item size:", error);
    throw new Error("Failed to update cart item size");
  }
};

// Remove item from user cart
export const removeFromUserCart = async (userId: string, itemId: string): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      throw new Error("Cart not found");
    }
    
    const cartData = cartSnap.data() as { items?: CartItem[] };
    const items: CartItem[] = cartData.items || [];
    
    const filteredItems = items.filter(item => item.id !== itemId);
    
    await updateDoc(cartRef, {
      items: filteredItems,
      updatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Error removing from user cart:", error);
    throw new Error("Failed to remove item from cart");
  }
};

// Remove item from guest cart
export const removeFromGuestCart = async (itemId: string): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const cart = await getGuestCart();
    
    if (!cart) {
      throw new Error("Cart not found");
    }
    
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = new Date();
    
    localStorage.setItem(`guest_cart_${sessionId}`, JSON.stringify(cart));
    
  } catch (error) {
    console.error("Error removing from guest cart:", error);
    throw new Error("Failed to remove item from cart");
  }
};

// Clear user cart
export const clearUserCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await updateDoc(cartRef, {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      updatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Error clearing user cart:", error);
    throw new Error("Failed to clear cart");
  }
};

// Clear guest cart
export const clearGuestCart = async (): Promise<void> => {
  try {
    const sessionId = getSessionId();
    localStorage.removeItem(`guest_cart_${sessionId}`);
    
  } catch (error) {
    console.error("Error clearing guest cart:", error);
    throw new Error("Failed to clear cart");
  }
};

// Update user cart totals
export const updateUserCartTotals = async (
  userId: string, 
  totals: { subtotal: number; tax: number; shipping: number; discount: number; total: number }
): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await updateDoc(cartRef, {
      ...totals,
      updatedAt: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Error updating user cart totals:", error);
    throw new Error("Failed to update cart totals");
  }
};

// Update guest cart totals
export const updateGuestCartTotals = async (
  totals: { subtotal: number; tax: number; shipping: number; discount: number; total: number }
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const cart = await getGuestCart();
    
    if (cart) {
      cart.subtotal = totals.subtotal;
      cart.tax = totals.tax;
      cart.shipping = totals.shipping;
      cart.discount = totals.discount;
      cart.total = totals.total;
      cart.updatedAt = new Date();
      
      localStorage.setItem(`guest_cart_${sessionId}`, JSON.stringify(cart));
    }
    
  } catch (error) {
    console.error("Error updating guest cart totals:", error);
    throw new Error("Failed to update cart totals");
  }
};

// Merge guest cart with user cart
export const mergeGuestCart = async (guestCart: Cart, userId: string): Promise<void> => {
  try {
    const userCart = await getUserCart(userId);
    
    if (!userCart) {
      throw new Error("Failed to get user cart");
    }
    
    // Merge items from guest cart
    for (const guestItem of guestCart.items) {
      const cleanGuestItem = {
        id: guestItem.id,
        productId: guestItem.productId,
        productName: guestItem.productName,
        productImage: guestItem.productImage,
        price: guestItem.price,
        quantity: guestItem.quantity,
        ...(guestItem.sizePrice && { sizePrice: guestItem.sizePrice }),
        addedAt: guestItem.addedAt,
        userId: userId,
        sessionId: '',
      };
      await addToUserCart(userId, cleanGuestItem);
    }
    
  } catch (error) {
    console.error("Error merging guest cart:", error);
    throw new Error("Failed to merge cart");
  }
};

// Export cart service object
export const cartService = {
  generateSessionId,
  getSessionId,
  getUserCart,
  getGuestCart,
  addToUserCart,
  addToGuestCart,
  updateUserCartItem,
  updateGuestCartItem,
  updateUserCartItemSize,
  updateGuestCartItemSize,
  removeFromUserCart,
  removeFromGuestCart,
  clearUserCart,
  clearGuestCart,
  updateUserCartTotals,
  updateGuestCartTotals,
  mergeGuestCart,
};

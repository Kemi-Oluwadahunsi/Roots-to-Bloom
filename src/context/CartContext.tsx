import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import type { Cart, CartItem, EnhancedProduct, CartContextType } from '../types/ecommerce';
import { CartState, CartAction, initialState } from '../types/cartTypes';

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    case 'ADD_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
          updatedAt: new Date(),
        },
      };
    
    case 'UPDATE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item.id === action.payload.itemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
          updatedAt: new Date(),
        },
      };
    
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== action.payload),
          updatedAt: new Date(),
        },
      };
    
    case 'CLEAR_CART':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          updatedAt: new Date(),
        },
      };
    
    case 'UPDATE_TOTALS':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          subtotal: action.payload.subtotal,
          tax: action.payload.tax,
          shipping: action.payload.shipping,
          discount: action.payload.discount,
          total: action.payload.total,
          updatedAt: new Date(),
        },
      };
    
    default:
      return state;
  }
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { currentUser } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load cart from localStorage and Firebase
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      let cart: Cart | null = null;

      if (currentUser) {
        // Load user's cart from Firebase
        cart = await cartService.getUserCart(currentUser.uid);
      } else {
        // Load guest cart from localStorage
        cart = await cartService.getGuestCart();
      }

      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (product: EnhancedProduct, quantity: number, sizePrice?: { size: string; price: number }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const cartItem: CartItem = {
        id: `${product.id}-${sizePrice?.size || 'default'}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: sizePrice?.price || product.price,
        quantity,
        ...(sizePrice && { sizePrice }),
        addedAt: new Date(),
        userId: currentUser?.uid,
        sessionId: currentUser ? '' : cartService.getSessionId(),
      };

      if (currentUser) {
        // Add to user's cart in Firebase
        await cartService.addToUserCart(currentUser.uid, cartItem);
      } else {
        // Add to guest cart in localStorage
        await cartService.addToGuestCart(cartItem);
      }

      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      
      // Recalculate totals
      await calculateTotals();
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      if (currentUser) {
        await cartService.updateUserCartItem(currentUser.uid, itemId, quantity);
      } else {
        await cartService.updateGuestCartItem(itemId, quantity);
      }

      dispatch({ type: 'UPDATE_ITEM', payload: { itemId, quantity } });
      
      // Recalculate totals
      await calculateTotals();
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (currentUser) {
        await cartService.removeFromUserCart(currentUser.uid, itemId);
      } else {
        await cartService.removeFromGuestCart(itemId);
      }

      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      
      // Recalculate totals
      await calculateTotals();
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (currentUser) {
        await cartService.clearUserCart(currentUser.uid);
      } else {
        await cartService.clearGuestCart();
      }

      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Calculate cart totals
  const calculateTotals = async () => {
    if (!state.cart) return;

    const subtotal = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% tax - this should be configurable
    const shipping = 0; // Shipping will be calculated at checkout based on provider
    const discount = 0; // Will be calculated when discount codes are applied
    const total = subtotal + tax + shipping - discount;

    dispatch({
      type: 'UPDATE_TOTALS',
      payload: { subtotal, tax, shipping, discount, total },
    });

    // Update totals in storage
    if (currentUser) {
      await cartService.updateUserCartTotals(currentUser.uid, { subtotal, tax, shipping, discount, total });
    } else {
      await cartService.updateGuestCartTotals({ subtotal, tax, shipping, discount, total });
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return state.cart?.total || 0;
  };

  // Get cart item count (number of unique products, not total quantity)
  const getCartItemCount = () => {
    return state.cart?.items.length || 0;
  };

  // Update cart item size
  const updateCartItemSize = async (itemId: string, sizePrice: { size: string; price: number }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (currentUser) {
        await cartService.updateUserCartItemSize(currentUser.uid, itemId, sizePrice);
      } else {
        await cartService.updateGuestCartItemSize(itemId, sizePrice);
      }

      // Update local state
      if (state.cart) {
        const updatedItems = state.cart.items.map(item =>
          item.id === itemId
            ? { ...item, price: sizePrice.price, sizePrice }
            : item
        );
        dispatch({ type: 'SET_CART', payload: { ...state.cart, items: updatedItems } });
      }

      // Recalculate totals
      await calculateTotals();
    } catch (error) {
      console.error('Error updating cart item size:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item size' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Toggle item selection for checkout
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAllItems = () => {
    if (state.cart) {
      setSelectedItems(new Set(state.cart.items.map(item => item.id)));
    }
  };

  // Deselect all items
  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  // Get selected items total
  const getSelectedTotal = () => {
    if (!state.cart) return 0;
    return state.cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Sync cart with user (when user logs in)
  const syncCartWithUser = async (userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get guest cart
      const guestCart = await cartService.getGuestCart();
      
      if (guestCart && guestCart.items.length > 0) {
        // Merge guest cart with user cart
        await cartService.mergeGuestCart(guestCart, userId);
      }
      
      // Load user's cart
      const userCart = await cartService.getUserCart(userId);
      dispatch({ type: 'SET_CART', payload: userCart });
      
      // Clear guest cart
      await cartService.clearGuestCart();
    } catch (error) {
      console.error('Error syncing cart with user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Merge guest cart with user cart
  const mergeGuestCart = async (_sessionId: string, userId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const guestCart = await cartService.getGuestCart();
      if (guestCart) {
        await cartService.mergeGuestCart(guestCart, userId);
      }
      
      // Load updated user cart
      const userCart = await cartService.getUserCart(userId);
      dispatch({ type: 'SET_CART', payload: userCart });
    } catch (error) {
      console.error('Error merging guest cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to merge cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: CartContextType = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    selectedItems,
    addToCart,
    updateCartItem,
    updateCartItemSize,
    removeFromCart,
    clearCart,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getCartTotal,
    getSelectedTotal,
    getCartItemCount,
    syncCartWithUser,
    mergeGuestCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart State Interface
export interface CartState {
  cart: import('./ecommerce').Cart | null;
  loading: boolean;
  error: string | null;
}

// Cart Actions
export type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: import('./ecommerce').Cart | null }
  | { type: 'ADD_ITEM'; payload: import('./ecommerce').CartItem }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TOTALS'; payload: { subtotal: number; tax: number; shipping: number; discount: number; total: number } };

// Initial State
export const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};


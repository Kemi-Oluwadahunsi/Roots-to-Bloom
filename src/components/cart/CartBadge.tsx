import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from './CartDrawer';

const CartBadge: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getCartItemCount } = useCart();
  
  const itemCount = getCartItemCount();

  const handleCartClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <button
        onClick={handleCartClick}
        className="relative p-2 text-[#48392e] dark:text-[#e0e0e0] hover:text-[#4b774a] dark:hover:text-[#6a9e69] transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="w-6 h-6" />
        
        {/* Cart Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#4b774a] dark:bg-[#6a9e69] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
      />
    </>
  );
};

export default CartBadge;

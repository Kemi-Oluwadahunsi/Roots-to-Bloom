import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/useToast';
import type { EnhancedProduct } from '../../types/ecommerce';

interface AddToCartButtonProps {
  product: EnhancedProduct;
  sizePrice?: { size: string; price: number };
  className?: string;
  showQuantity?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  sizePrice,
  className = '',
  showQuantity = true,
  size = 'md'
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, loading } = useCart();
  const { showSuccess, showError } = useToast();

  const selectedStock = product.stock || 100; // Default stock
  const isOutOfStock = selectedStock <= 0;
  const isSizeRequired = !sizePrice; // Disable if no size selected

  const handleAddToCart = async () => {
    if (isOutOfStock || loading || isAdding || isSizeRequired) return;

    try {
      setIsAdding(true);
      await addToCart(product, quantity, sizePrice);
      
      // Show success feedback
      const sizeText = sizePrice ? ` (${sizePrice.size})` : '';
      showSuccess(`${product.name}${sizeText} added to cart!`);
      
      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= selectedStock) {
      setQuantity(newQuantity);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const buttonSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quantity Selector */}
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity:
          </label>
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className={`${buttonSizeClasses[size]} flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-center font-medium min-w-[3rem]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= selectedStock}
              className={`${buttonSizeClasses[size]} flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedStock} available
          </span>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading || isAdding || isSizeRequired}
        className={`
          w-full ${sizeClasses[size]} rounded-md font-medium transition-all duration-200
          flex items-center justify-center space-x-2
          ${isOutOfStock || isSizeRequired
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-[#4b774a] hover:bg-[#3d5f3c] dark:bg-[#6a9e69] dark:hover:bg-[#5a8e59] text-white hover:shadow-lg transform hover:-translate-y-0.5'
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        `}
      >
        {isAdding || loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Adding...</span>
          </>
        ) : isOutOfStock ? (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Out of Stock</span>
          </>
        ) : isSizeRequired ? (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Select Size First</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>

      {/* Size Selection Message */}
      {isSizeRequired && (
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          📏 Please select a size to add to cart
        </div>
      )}

      {/* Stock Status */}
      {selectedStock <= 5 && selectedStock > 0 && !isSizeRequired && (
        <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
          ⚠️ Only {selectedStock} left in stock!
        </div>
      )}

      {isOutOfStock && (
        <div className="text-sm text-red-600 dark:text-red-400 font-medium">
          This item is currently out of stock
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;

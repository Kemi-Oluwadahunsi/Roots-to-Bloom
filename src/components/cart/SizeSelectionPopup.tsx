import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/useToast';
import type { EnhancedProduct } from '../../types/ecommerce';

interface SizeSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: EnhancedProduct;
}

const SizeSelectionPopup: React.FC<SizeSelectionPopupProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, loading } = useCart();
  const { showSuccess, showError } = useToast();

  const selectedSizePrice = product.sizePrices?.find(sp => sp.size === selectedSize);
  const isSizeSelected = !!selectedSize;
  const isOutOfStock = (product.stock || 100) <= 0;

  const handleAddToCart = async () => {
    if (!isSizeSelected || isOutOfStock || loading || isAdding) return;

    try {
      setIsAdding(true);
      await addToCart(product, quantity, selectedSizePrice);
      
      // Show success feedback
      showSuccess(`${product.name} (${selectedSizePrice.size}) added to cart!`);
      onClose(); // Close popup after success
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleClose = () => {
    setSelectedSize('');
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Popup */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0]">
                  Select Size & Quantity
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category} - {product.tags?.[1] || 'Product'}
                    </p>
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-3">
                    Select Size: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.sizePrices?.map((sizePrice) => (
                      <button
                        key={sizePrice.size}
                        onClick={() => setSelectedSize(sizePrice.size)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                          selectedSize === sizePrice.size
                            ? 'border-[#4b774a] dark:border-[#6a9e69] bg-[#4b774a]/10 dark:bg-[#6a9e69]/10 text-[#4b774a] dark:text-[#6a9e69]'
                            : 'border-gray-300 dark:border-gray-600 hover:border-[#4b774a] dark:hover:border-[#6a9e69] text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">{sizePrice.size}</div>
                          <div className="text-xs opacity-75">${sizePrice.price.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {!isSizeSelected && (
                    <p className="text-sm text-red-500 mt-2">Please select a size</p>
                  )}
                </div>

                {/* Quantity Selection */}
                {isSizeSelected && (
                  <div>
                    <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-3">
                      Quantity:
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= (product.stock || 100)}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {(product.stock || 100)} available
                      </span>
                    </div>
                  </div>
                )}

                {/* Price Display */}
                {isSizeSelected && selectedSizePrice && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSize} × {quantity}
                      </span>
                      <span className="text-lg font-bold text-[#4b774a] dark:text-[#6a9e69]">
                        ${(selectedSizePrice.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stock Warning */}
                {(product.stock || 100) <= 5 && (product.stock || 100) > 0 && (
                  <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    ⚠️ Only {product.stock || 100} left in stock!
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isSizeSelected || isOutOfStock || loading || isAdding}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !isSizeSelected || isOutOfStock
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-[#4b774a] hover:bg-[#3d5f3c] dark:bg-[#6a9e69] dark:hover:bg-[#5a8e59] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isAdding || loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Adding to Cart...</span>
                    </>
                  ) : !isSizeSelected ? (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Select Size First</span>
                    </>
                  ) : isOutOfStock ? (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Out of Stock</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Help Text */}
                {!isSizeSelected && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                    📏 Please select a size to continue
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeSelectionPopup;

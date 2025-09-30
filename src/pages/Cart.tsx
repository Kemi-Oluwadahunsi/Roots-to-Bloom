import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Check, Square } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductContext } from '../context/ProductContext';
import { useToast } from '../hooks/useToast';
import { useCurrency } from '../hooks/useCurrency';

const Cart: React.FC = () => {
  const { 
    cart, 
    updateCartItem, 
    updateCartItemSize,
    removeFromCart, 
    clearCart, 
    getCartItemCount, 
    loading,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedTotal
  } = useCart();
  const { getProduct } = useProductContext();
  const navigate = useNavigate();
  const [selectedSizePrices, setSelectedSizePrices] = useState<Record<string, { size: string; price: number }>>({});
  const { showSuccess, showError, showWarning } = useToast();
  const { formatUserPrice } = useCurrency();

  // Initialize size prices for each item
  useEffect(() => {
    if (cart?.items) {
      const initialSizes: Record<string, { size: string; price: number }> = {};
      cart.items.forEach(item => {
        if (item.sizePrice) {
          initialSizes[item.id] = item.sizePrice;
        } else {
          // Get the first available size price from the product
          const product = getProduct(item.productId);
          if (product?.sizePrices?.[0]) {
            initialSizes[item.id] = product.sizePrices[0];
          }
        }
      });
      setSelectedSizePrices(initialSizes);
    }
  }, [cart?.items, getProduct]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
        showSuccess('Item removed from cart');
      } else {
        await updateCartItem(itemId, newQuantity);
      }
    } catch (err) {
      showError('Failed to update cart item:' + err);
    }
  };

  const handleSizeChange = async (itemId: string, sizePrice: { size: string; price: number }) => {
    try {
      setSelectedSizePrices(prev => ({ ...prev, [itemId]: sizePrice }));
      await updateCartItemSize(itemId, sizePrice);
      showSuccess('Size updated successfully');
    } catch (err) {
      showError('Failed to update size:' + err);
    }
  };

  const handleCheckout = () => {
    if (selectedItemsCount === 0) {
      showWarning('Please select items to checkout');
      return;
    }
    // For now, navigate to checkout with all selected items
    // In the future, we can pass selected items to checkout
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const selectedItemsCount = selectedItems.size;
  const selectedTotal = getSelectedTotal();

  if (!cart || cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-[calc(100vh-10rem)] bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Shopping Cart
              </h1>
              <p className="text-[#4b774a] dark:text-[#6a9e69]">
                Your cart is empty
              </p>
            </div>

            {/* Empty Cart */}
            <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-12 text-center">
              <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-[#4b774a] dark:bg-[#6a9e69] text-white px-8 py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
              Shopping Cart
            </h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69]">
              {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-3 space-y-6">
              {/* Selection Controls */}
              <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={selectedItemsCount === cart.items.length ? deselectAllItems : selectAllItems}
                      className="flex items-center space-x-2 text-[#4b774a] dark:text-[#6a9e69] hover:text-[#3d5f3c] dark:hover:text-[#5a8e59] transition-colors"
                    >
                      {selectedItemsCount === cart.items.length ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {selectedItemsCount === cart.items.length ? 'Deselect All' : 'Select All'}
                      </span>
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedItemsCount} of {cart.items.length} items selected
                    </span>
                  </div>
                  <button
                    onClick={clearCart}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              {cart.items.map((item, index) => {
                const product = getProduct(item.productId);
                const isSelected = selectedItems.has(item.id);
                const currentSizePrice = selectedSizePrices[item.id];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-[#4b774a] dark:ring-[#6a9e69]' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-6">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className={`mt-2 p-1 rounded transition-colors ${
                          isSelected 
                            ? 'text-[#4b774a] dark:text-[#6a9e69]' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                          {item.productName}
                        </h3>

                        {/* Size Selection */}
                        {product?.sizePrices && product.sizePrices.length > 1 && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Size:
                            </label>
                            <select
                              value={currentSizePrice?.size || ''}
                              onChange={(e) => {
                                const selectedSize = product.sizePrices.find(sp => sp.size === e.target.value);
                                if (selectedSize) handleSizeChange(item.id, selectedSize);
                              }}
                              disabled={loading}
                              className="max-w-sm py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:opacity-50"
                            >
                              {product.sizePrices.map((sizePrice) => (
                                <option key={sizePrice.size} value={sizePrice.size}>
                                  {sizePrice.size} - {formatUserPrice(sizePrice.price)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Current Price */}
                        <p className="text-xl font-bold text-[#4b774a] dark:text-[#6a9e69]">
                          {formatUserPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-center font-medium min-w-[3rem]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0]">
                          {formatUserPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-6">
                  Order Summary
                </h2>

                {/* Selected Items Summary */}
                {selectedItemsCount > 0 && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''} selected for checkout
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal {selectedItemsCount > 0 ? '(Selected)' : ''}:
                    </span>
                    <span className="font-medium">
                      {formatUserPrice(selectedItemsCount > 0 ? selectedTotal : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (5%):</span>
                    <span className="font-medium">
                      {formatUserPrice((selectedItemsCount > 0 ? selectedTotal : 0) * 0.05)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                    <span className="font-medium text-gray-500 dark:text-gray-400 italic">
                      Calculated at checkout
                    </span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount:</span>
                      <span className="font-medium">-{formatUserPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-[#48392e] dark:text-[#e0e0e0]">Total:</span>
                      <span className="text-[#4b774a] dark:text-[#6a9e69]">
                        {formatUserPrice(
                          (selectedItemsCount > 0 ? selectedTotal : 0) + 
                          (selectedItemsCount > 0 ? selectedTotal : 0) * 0.05 - 
                          cart.discount
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItemsCount === 0 || loading}
                    className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {selectedItemsCount > 0 
                        ? `Checkout ${selectedItemsCount} Item${selectedItemsCount !== 1 ? 's' : ''}` 
                        : 'Select Items to Checkout'
                      }
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400 text-center">
                    🔒 Secure checkout with SSL encryption
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
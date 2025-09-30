import React from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Check, Square } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../hooks/useCurrency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    updateCartItem, 
    removeFromCart, 
    getCartItemCount, 
    loading,
    selectedItems,
    toggleItemSelection,
    getSelectedTotal
  } = useCart();
  const navigate = useNavigate();
  const { formatUserPrice } = useCurrency();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/95 bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-screen w-full max-w-sm sm:max-w-md bg-white dark:bg-[#2a2a2a] shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-[#4b774a] dark:text-[#6a9e69]" />
            <h2 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0]">
              Shopping Cart ({getCartItemCount()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {cart && cart.items.length > 0 ? (
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  return (
                    <div key={item.id} className={`flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors ${
                      isSelected ? 'ring-2 ring-[#4b774a] dark:ring-[#6a9e69]' : ''
                    }`}>
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className={`p-1 rounded transition-colors ${
                          isSelected 
                            ? 'text-[#4b774a] dark:text-[#6a9e69]' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      {/* Product Image */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
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
                        <h3 className="text-xs font-medium text-[#48392e] dark:text-[#e0e0e0] truncate">
                          {item.productName}
                        </h3>
                        {item.sizePrice && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Size: {item.sizePrice.size}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-[#4b774a] dark:text-[#6a9e69]">
                          {formatUserPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add some products to get started
                </p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              {/* Selection Info */}
              {selectedItems.size > 0 && (
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400 text-center">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal {selectedItems.size > 0 ? '(Selected)' : ''}
                  </span>
                  <span className="font-medium">
                    {formatUserPrice(selectedItems.size > 0 ? getSelectedTotal() : 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                  <span className="font-medium">
                    {formatUserPrice((selectedItems.size > 0 ? getSelectedTotal() : 0) * 0.05)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-500 dark:text-gray-400 italic">
                    Calculated at checkout
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span className="font-medium">-{formatUserPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#48392e] dark:text-[#e0e0e0]">Total</span>
                    <span className="text-[#4b774a] dark:text-[#6a9e69]">
                      {formatUserPrice(
                        (selectedItems.size > 0 ? getSelectedTotal() : 0) + 
                        (selectedItems.size > 0 ? getSelectedTotal() : 0) * 0.05 - 
                        cart.discount
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0}
                  className={`w-full py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
                    selectedItems.size > 0
                      ? 'bg-[#4b774a] dark:bg-[#6a9e69] text-white hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59]'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {selectedItems.size > 0 
                      ? `Checkout ${selectedItems.size} Item${selectedItems.size !== 1 ? 's' : ''}` 
                      : 'Select Items to Checkout'
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

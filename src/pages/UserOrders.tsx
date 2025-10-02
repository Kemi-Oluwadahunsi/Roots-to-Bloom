import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserOrders, updateOrderStatus } from '../services/orderService';
import { useCurrency } from '../hooks/useCurrency';
import { useToast } from '../hooks/useToast';
import type { OrderData } from '../types/payment';

const UserOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { formatUserPrice } = useCurrency();
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userOrders = await getUserOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [currentUser, navigate, loadOrders]);

  const handleCancelOrder = async (orderId: string, orderStatus: string) => {
    if (orderStatus === 'shipped' || orderStatus === 'delivered') {
      showError('Cannot cancel orders that have been shipped');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this order? A refund will be processed.')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await updateOrderStatus(orderId, 'cancelled');
      showSuccess('Order cancelled successfully. Refund will be processed within 5-10 business days.');
      await loadOrders(); // Reload orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      showError('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const canCancelOrder = (status: string) => {
    return status !== 'shipped' && status !== 'delivered' && status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#4b774a] dark:text-[#6a9e69] animate-spin mx-auto mb-4" />
          <p className="text-[#48392e] dark:text-[#e0e0e0]">Loading your orders...</p>
        </div>
      </div>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-[#4b774a] dark:text-[#6a9e69] hover:text-[#3d5f3c] dark:hover:text-[#5a8e59] mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
              My Orders
            </h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69]">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-[#4b774a] dark:bg-[#6a9e69] text-white'
                    : 'bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                No orders found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' 
                  ? "You haven't placed any orders yet."
                  : `No ${filter} orders found.`
                }
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-[#4b774a] dark:bg-[#6a9e69] text-white px-6 py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.createdAt.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(order.orderStatus)}
                        <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0]">
                          Order #{order.createdAt.getTime().toString().slice(-8)}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {order.createdAt.toLocaleDateString('en-MY', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'succeeded' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Size: {item.size} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatUserPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="font-medium">{formatUserPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                        <span className="font-medium">{formatUserPrice(order.tax)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                          <span className="font-medium">{formatUserPrice(order.shippingCost)}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                          <span>Discount:</span>
                          <span className="font-medium">-{formatUserPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-[#48392e] dark:text-[#e0e0e0]">Total:</span>
                        <span className="text-[#4b774a] dark:text-[#6a9e69]">{formatUserPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Address:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{order.shipping.name}</p>
                      <p>{order.shipping.address.line1}</p>
                      {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                      <p>{order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}</p>
                      <p>{order.shipping.address.country}</p>
                      <p className="mt-1">📧 {order.shipping.email}</p>
                      <p>📱 {order.shipping.phone}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {canCancelOrder(order.orderStatus) && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(order.createdAt.toString(), order.orderStatus)}
                        disabled={cancellingOrderId === order.createdAt.toString()}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrderId === order.createdAt.toString() ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Cancel Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        ⚠️ This order has been cancelled. Refund will be processed within 5-10 business days.
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrders;


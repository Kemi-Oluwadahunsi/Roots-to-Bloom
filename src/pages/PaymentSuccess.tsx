import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { verifyPaymentStatus } from '../services/stripeService';
import { findPendingOrderByEmail, updateOrderPaymentStatus } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { currentUser } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Invalid payment session');
        setVerifying(false);
        return;
      }

      try {
        const result = await verifyPaymentStatus(sessionId);
        
        if (result.status === 'succeeded' || result.status === 'paid') {
          // Find the pending order by email and update it
          const customerEmail = result.customerEmail;
          if (customerEmail) {
            const foundOrderId = await findPendingOrderByEmail(customerEmail);
            if (foundOrderId) {
              // Update order payment status in Firestore
              await updateOrderPaymentStatus(foundOrderId, sessionId, 'succeeded');
              setOrderId(foundOrderId);
            }
          }
          
          // Clear the cart after successful payment
          await clearCart();
        } else {
          setError('Payment verification failed. Please contact support.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Unable to verify payment. Please contact support with your order details.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#4b774a] dark:text-[#6a9e69] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Verification Error
            </h2>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#4b774a] dark:bg-[#6a9e69] text-white px-6 py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
            </motion.div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>

            {/* Order Info */}
            {orderId && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
                <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                  Order ID
                </p>
                <p className="text-lg font-mono font-semibold text-green-900 dark:text-green-300">
                  {orderId}
                </p>
              </div>
            )}

            {/* Confirmation Email Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                📧 A confirmation email has been sent to your email address with order details and tracking information.
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-[#4b774a] dark:text-[#6a9e69]" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-[#4b774a] dark:text-[#6a9e69] mr-2">1.</span>
                  <span>We'll prepare your order for shipment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4b774a] dark:text-[#6a9e69] mr-2">2.</span>
                  <span>You'll receive a shipping confirmation with tracking number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4b774a] dark:text-[#6a9e69] mr-2">3.</span>
                  <span>Track your package until it arrives at your doorstep</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentUser && (
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors flex items-center justify-center space-x-2"
                >
                  <Package className="w-5 h-5" />
                  <span>View My Orders</span>
                </button>
              )}
              <button
                onClick={() => navigate('/products')}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;


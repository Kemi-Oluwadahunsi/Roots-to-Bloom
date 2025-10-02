import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Card */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8 text-center">
            {/* Cancel Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-16 h-16 text-orange-600 dark:text-orange-400" />
              </div>
            </motion.div>

            {/* Cancel Message */}
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
              Payment Cancelled
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your payment was cancelled and no charges were made. Your cart items are still saved.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 Your cart items are still available. You can review them and try again when you're ready.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-3 rounded-md hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Return to Cart</span>
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help?{' '}
                <button
                  onClick={() => navigate('/contact')}
                  className="text-[#4b774a] dark:text-[#6a9e69] hover:underline font-medium"
                >
                  Contact our support team
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCancel;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../hooks/useCurrency';
import { useToast } from '../hooks/useToast';
import { createCheckoutSession, redirectToCheckout, isStripeConfigured } from '../services/stripeService';
import { createOrder } from '../services/orderService';
import { cartService } from '../services/cartService';
import type { ShippingInfo } from '../types/payment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const shippingSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  line1: yup.string().required('Address is required'),
  line2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  postal_code: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
});

const Checkout: React.FC = () => {
  const { cart, selectedItems } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { formatUserPrice, getCurrencyCode } = useCurrency();
  const { showError, showWarning } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '',
      email: userProfile?.email || '',
      phone: userProfile?.phone?.number || '',
      line1: userProfile?.address?.line1 || '',
      line2: userProfile?.address?.line2 || '',
      city: userProfile?.address?.city || '',
      state: userProfile?.address?.state || '',
      postal_code: userProfile?.address?.zipCode || '',
      country: userProfile?.address?.country || 'Malaysia',
    },
  });

  // Redirect if cart is empty or no items selected
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      showWarning('Your cart is empty');
      navigate('/products');
      return;
    }

    if (selectedItems.size === 0) {
      showWarning('Please select items to checkout');
      navigate('/cart');
    }
  }, [cart, selectedItems, navigate, showWarning]);

  // Check Stripe configuration
  useEffect(() => {
    if (!isStripeConfigured()) {
      showError('Payment system is not configured. Please contact support.');
    }
  }, [showError]);

  const selectedCartItems = cart?.items.filter(item => selectedItems.has(item.id)) || [];
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const shippingCost = 0; // Will be calculated by shipping provider
  const discount = 0;
  const total = subtotal + tax + shippingCost - discount;

  const onSubmit = async (data: ShippingFormData) => {
    if (!isStripeConfigured()) {
      showError('Payment system is not available. Please contact support.');
      return;
    }

    if (selectedCartItems.length === 0) {
      showWarning('No items selected for checkout');
      return;
    }

    try {
      setIsProcessing(true);

      // Prepare shipping info
      const shippingInfo: ShippingInfo = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        },
      };

      // Create order in Firebase first
      await createOrder(
        selectedCartItems,
        shippingInfo,
        currentUser?.uid,
        currentUser ? undefined : cartService.getSessionId(), // sessionId for guest users only
        getCurrencyCode()
      );

      // Prepare checkout items
      const checkoutItems = selectedCartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        size: item.sizePrice?.size || 'Standard',
        price: item.price,
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const session = await createCheckoutSession({
        items: checkoutItems,
        shipping: shippingInfo,
        userId: currentUser?.uid,
        currency: getCurrencyCode(),
      });

      // Redirect to Stripe Checkout
      if (session.url) {
        await redirectToCheckout(session.url);
      } else {
        throw new Error('Failed to get checkout URL');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showError(error instanceof Error ? error.message : 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-[#4b774a] dark:text-[#6a9e69] hover:text-[#3d5f3c] dark:hover:text-[#5a8e59] mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
              Secure Checkout
            </h1>
            <p className="text-[#4b774a] dark:text-[#6a9e69] flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Your payment information is secure and encrypted
            </p>
          </div>

          {!isStripeConfigured() && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Payment system is not configured. Please contact support.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-6">
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="+60 12 345 6789"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('line1')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="123 Main Street"
                    />
                    {errors.line1 && (
                      <p className="mt-1 text-sm text-red-500">{errors.line1.message}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      {...register('line2')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('city')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                        placeholder="Kuala Lumpur"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('state')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                        placeholder="Selangor"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('postal_code')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                        placeholder="50000"
                      />
                      {errors.postal_code && (
                        <p className="mt-1 text-sm text-red-500">{errors.postal_code.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('country')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    >
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing || !isStripeConfigured()}
                    className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-4 rounded-md font-medium hover:bg-[#3d5f3c] dark:hover:bg-[#5a8e59] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Proceed to Secure Payment</span>
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-400 text-center flex items-center justify-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Powered by Stripe - Industry-leading security & PCI compliance
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {selectedCartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
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
                          {item.sizePrice?.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatUserPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">{formatUserPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (5%):</span>
                    <span className="font-medium">{formatUserPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                    <span className="font-medium text-gray-500 dark:text-gray-400 italic text-xs">
                      Calculated by provider
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount:</span>
                      <span className="font-medium">-{formatUserPrice(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-[#48392e] dark:text-[#e0e0e0]">Total:</span>
                      <span className="text-[#4b774a] dark:text-[#6a9e69]">
                        {formatUserPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;


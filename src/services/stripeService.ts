import { loadStripe, Stripe } from "@stripe/stripe-js";
import type { CreateCheckoutRequest, CheckoutSession } from "../types/payment";

// Get Stripe publishable key from environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Singleton Stripe instance
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or initialize Stripe instance
 * @returns Promise<Stripe | null>
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error(
        "Stripe publishable key is missing. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file."
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create a Stripe Checkout Session
 * This calls your Firebase Cloud Function which creates the session securely
 * @param checkoutData - Checkout request data
 * @returns Promise<CheckoutSession>
 */
export const createCheckoutSession = async (
  checkoutData: CreateCheckoutRequest
): Promise<CheckoutSession> => {
  try {
    // Use Vercel Serverless Function endpoint
    // In development: /api/create-checkout
    // In production: https://your-domain.vercel.app/api/create-checkout
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/api/create-checkout`;

    // Call the Vercel Serverless Function
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create checkout session");
    }

    const session: CheckoutSession = await response.json();
    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create checkout session"
    );
  }
};

/**
 * Redirect to Stripe Checkout
 * This is the most secure way - Stripe hosts the payment page
 * @param checkoutUrl - Stripe Checkout URL from session
 */
export const redirectToCheckout = async (checkoutUrl: string): Promise<void> => {
  try {
    // Simply redirect to the Stripe Checkout URL
    // Modern Stripe API returns URL directly from session
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error("Error redirecting to checkout:", error);
    throw error;
  }
};

/**
 * Verify payment status
 * @param sessionId - Stripe Checkout Session ID
 * @returns Promise<{ status: string; orderId?: string }>
 */
export const verifyPaymentStatus = async (
  sessionId: string
): Promise<{
  status: string;
  customerEmail?: string;
  orderId?: string;
  error?: string;
}> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/api/verify-payment`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      status: "error",
      error:
        error instanceof Error ? error.message : "Failed to verify payment",
    };
  }
};

/**
 * Format amount for Stripe (converts to cents)
 * @param amount - Amount in dollars
 * @returns Amount in cents
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Stripe (converts from cents)
 * @param amount - Amount in cents
 * @returns Amount in dollars
 */
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

/**
 * Validate Stripe configuration
 * @returns boolean
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY;
};

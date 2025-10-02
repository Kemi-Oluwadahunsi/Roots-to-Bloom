import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe with secret key (secure on Vercel backend)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

/**
 * VERCEL SERVERLESS FUNCTION
 * Creates a Stripe Checkout Session
 * This runs on Vercel's backend - secret key is safe here!
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {

  // Enable CORS
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://rtbloom.vercel.app',
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, shipping, userId, currency = 'myr' } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    if (!shipping || !shipping.email) {
      return res.status(400).json({ error: 'Shipping information with email is required' });
    }

    // Calculate totals (MUST be done on backend for security!)
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => {
      return sum + (item.price * item.quantity);
    }, 0);
    const tax = subtotal * 0.05; // 5% tax

    // Create line items for Stripe
    const lineItems = items.map((item: { productName: string; size: string; price: number; quantity: number; productImage?: string }) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.productName,
          description: `Size: ${item.size}`,
          images: item.productImage ? [item.productImage] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add tax as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: 'Tax (5%)',
            description: 'Sales tax',
            images: [],
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    // Get base URL for redirects
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.origin || 'http://localhost:5173';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Can add 'fpx', 'grabpay' for Malaysia
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,
      customer_email: shipping.email,
      metadata: {
        userId: userId || 'guest',
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingPhone: shipping.phone,
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['MY', 'SG', 'ID', 'TH', 'PH', 'US', 'GB', 'AU', 'CA'], // Major countries
      },
      // Customer can save shipping details for future
      phone_number_collection: {
        enabled: true,
      },
    });

    console.log('✅ Stripe checkout session created:', session.id);

    return res.status(200).json({
      id: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create checkout session' 
    });
  }
}


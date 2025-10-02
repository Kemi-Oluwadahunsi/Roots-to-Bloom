import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

/**
 * VERCEL SERVERLESS FUNCTION
 * Handles Stripe webhook events
 * CRITICAL: Verifies webhook signatures for security!
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('❌ Missing signature or webhook secret');
    return res.status(400).json({ error: 'Webhook Error: Missing signature' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);
    
    // Verify webhook signature (CRITICAL for security!)
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Webhook signature verification failed:', message);
    return res.status(400).json({ error: `Webhook Error: ${message}` });
  }

  // Handle different event types
  // Note: We log events here for monitoring
  // Order updates happen from frontend to avoid needing Firebase Admin SDK
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Checkout session completed:', session.id);
        console.log('   Payment status:', session.payment_status);
        console.log('   Customer email:', session.customer_email);
        console.log('   Amount total:', session.amount_total, session.currency);
        console.log('   User ID:', session.metadata?.userId);
        
        // Frontend's PaymentSuccess page will update the order in Firestore
        // This avoids needing Firebase Admin SDK credentials
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Payment intent succeeded:', paymentIntent.id);
        console.log('   Amount:', paymentIntent.amount, paymentIntent.currency);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment intent failed:', paymentIntent.id);
        console.log('   Failure reason:', paymentIntent.last_payment_error?.message);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('⏰ Checkout session expired:', session.id);
        console.log('   Customer email:', session.customer_email);
        console.log('   Session expired without payment');
        // Order remains in 'pending' status, can be cleaned up later
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt of event
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper to get raw body for signature verification
async function getRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Configure to receive raw body
export const config = {
  api: {
    bodyParser: false,
  },
};


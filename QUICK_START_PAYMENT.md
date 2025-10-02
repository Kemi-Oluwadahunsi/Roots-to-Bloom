# 🚀 Quick Start - FREE Stripe Payment Setup

## ⚡ 5-Minute Setup (Free Forever!)

### **What You Need:**

1. Stripe account (free)
2. Vercel account (free)
3. Firebase project (free Spark plan is enough!)

---

## 📋 Step-by-Step

### **1. Get Stripe Keys** (2 minutes)

```bash
1. Visit stripe.com → Sign up
2. Dashboard → Developers → API keys
3. Copy Publishable key (pk_test_...)
4. Copy Secret key (sk_test_...)
```

### **2. Deploy to Vercel** (2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (will prompt for environment variables)
vercel --prod
```

### **3. Add Environment Variables** (1 minute)

In **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

```env
STRIPE_SECRET_KEY = sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET = whsec_... (add after webhook setup in step 4)
```

**Note:** Only Stripe keys needed in Vercel! Firebase credentials already in your local `.env`.

In your **local .env** file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://your-app.vercel.app
```

### **4. Setup Webhook** (2 minutes)

```bash
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: https://your-app.vercel.app/api/webhook
3. Select events: checkout.session.completed
4. Copy webhook secret (whsec_...)
5. Add to Vercel: STRIPE_WEBHOOK_SECRET = whsec_...
```

### **5. Test!** (1 minute)

```bash
1. Visit your site
2. Add products to cart
3. Checkout
4. Use test card: 4242 4242 4242 4242
5. See success page!
```

---

## ✅ That's It!

**Total Cost:** $0/month 🎉

**What You Get:**
- ✅ Secure payment processing
- ✅ PCI compliant
- ✅ Bank-level security
- ✅ Professional checkout
- ✅ Auto-scaling
- ✅ Global CDN

---

## 📚 Full Documentation

- **Complete Setup:** `VERCEL_STRIPE_SETUP.md`
- **Security Details:** `STRIPE_SETUP.md`
- **Troubleshooting:** Check the docs above

---

## 🆘 Quick Fixes

**Problem:** "Payment system not configured"
**Fix:** Add `VITE_STRIPE_PUBLISHABLE_KEY` to .env, restart server

**Problem:** "Failed to create checkout"
**Fix:** Check Vercel logs: `vercel logs`, verify environment variables

**Problem:** "Webhook not working"
**Fix:** Verify webhook URL and signing secret

---

## 🎯 Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0025 0000 3155 | 🔐 Requires 3D Secure |

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

---

**Start accepting payments in 5 minutes!** 💳✨


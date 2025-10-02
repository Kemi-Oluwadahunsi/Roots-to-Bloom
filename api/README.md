# Vercel Serverless Functions - Stripe Payment API

This directory contains **secure backend functions** for Stripe payment processing that run on Vercel's FREE serverless platform.

---

## 📁 Files

### **`create-checkout.ts`**
- **Purpose:** Creates Stripe Checkout Session
- **Method:** POST
- **Endpoint:** `/api/create-checkout`
- **Security:** Uses Stripe secret key (backend only)
- **Returns:** Checkout session ID and URL

### **`webhook.ts`**
- **Purpose:** Receives payment confirmations from Stripe
- **Method:** POST
- **Endpoint:** `/api/webhook`
- **Security:** Verifies Stripe webhook signatures
- **Updates:** Order status in Firestore

### **`verify-payment.ts`**
- **Purpose:** Verifies payment after user redirected back
- **Method:** POST
- **Endpoint:** `/api/verify-payment`
- **Returns:** Payment status

---

## 🔐 Security

### **Why This Is Secure:**

1. **Secret keys never exposed:**
   - Stripe secret key only in Vercel environment variables
   - Never in frontend code
   - Never in Git repository

2. **Webhook verification:**
   - All webhooks verified with Stripe signature
   - Prevents fake payment confirmations
   - Ensures requests actually from Stripe

3. **Backend validation:**
   - Payment amounts calculated on backend
   - Frontend can't manipulate prices
   - Order validation before processing

4. **Firebase Admin SDK:**
   - Secure Firestore access from backend
   - Bypasses client security rules
   - Credentials encrypted on Vercel

---

## 🧪 Local Testing

```bash
# Run Vercel dev server (includes API)
vercel dev

# Frontend: http://localhost:3000
# API: http://localhost:3000/api/*
```

### **Test Endpoints:**

```bash
# Test create-checkout
curl -X POST http://localhost:3000/api/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productName": "Test", "price": 10, "quantity": 1, "size": "100ml"}],
    "shipping": {"name": "Test", "email": "test@example.com", "phone": "123"}
  }'

# Test verify-payment
curl -X POST http://localhost:3000/api/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "cs_test_..."}'
```

---

## 📊 Environment Variables Required

These are set in **Vercel Dashboard** → **Environment Variables**:

```
STRIPE_SECRET_KEY          # sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET      # whsec_... (from Stripe webhook setup)
FIREBASE_PROJECT_ID        # your-project-id
FIREBASE_CLIENT_EMAIL      # firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY       # -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
```

---

## 🚀 Deployment

### **Automatic Deployment:**
```bash
# Every git push to main deploys automatically via Vercel GitHub integration
git push origin main
```

### **Manual Deployment:**
```bash
vercel --prod
```

### **View Logs:**
```bash
vercel logs --follow
```

---

## 📈 Vercel Free Tier

✅ **100GB bandwidth/month**
✅ **100 serverless executions/day**
✅ **Unlimited projects**
✅ **Automatic HTTPS**
✅ **Edge caching**

**More than enough for:** Hundreds of orders per day!

---

## 🛠️ Troubleshooting

### **Function not working:**
1. Check Vercel logs: `vercel logs`
2. Verify environment variables are set
3. Ensure `api/package.json` dependencies installed
4. Redeploy: `vercel --prod`

### **Webhook not triggering:**
1. Check Stripe Dashboard → Webhooks → Events
2. Verify endpoint URL matches deployment
3. Check signing secret is correct
4. Send test webhook from Stripe Dashboard

### **Firebase permission denied:**
1. Verify service account credentials
2. Check private key has `\n` properly formatted
3. Ensure Firestore rules allow Admin SDK access

---

## 💡 Tips

1. **Always use `vercel dev` for local testing** (not `npm run dev`)
2. **Check logs regularly:** `vercel logs`
3. **Monitor Stripe Dashboard** for payment events
4. **Test webhooks** before going live
5. **Keep secrets in Vercel only** (never in code!)

---

## 🎯 Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Deployed to production
- [ ] Webhook endpoint configured in Stripe
- [ ] Test payment completed successfully
- [ ] Webhook events received and logged
- [ ] Order created in Firestore
- [ ] Success page displays correctly

---

**Functions are ready to handle payments securely!** 🔒💳



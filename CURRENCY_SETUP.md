# Currency System Setup Guide

## Overview

The Roots-to-Bloom app now uses **live exchange rates** via the ExchangeRate-API to display prices in user's preferred currency.

---

## 🔑 API Key Setup

### 1. Get Your Free API Key

1. Visit [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Click **"Get Free Key"**
3. Sign up with your email
4. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0`)

### 2. Add to Environment Variables

Add this line to your `.env` file:

```env
VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
```

**Note:** Replace `your_api_key_here` with your actual API key.

---

## 📊 Free Tier Limits

ExchangeRate-API free tier includes:

- ✅ **1,500 requests per month**
- ✅ **Updates every 24 hours**
- ✅ **160+ currencies supported**
- ✅ **No credit card required**

With caching (1 hour cache), 1,500 requests = ~62 days of continuous usage!

---

## 🚀 How It Works

### **1. Automatic Caching**

- Exchange rates are cached for **1 hour**
- Reduces API calls dramatically
- Falls back to hardcoded rates if API fails

### **2. Smart Loading**

- Rates preload when app starts
- Cached rates used for instant display
- Shows loading indicator (`RM...`) while fetching

### **3. Real-Time Updates**

- Rates automatically refresh after 1 hour
- Users get accurate conversion prices
- No manual updates needed!

---

## 💱 Supported Currencies

| Code | Currency | Symbol |
|------|----------|--------|
| MYR  | Malaysian Ringgit | RM |
| USD  | US Dollar | $ |
| EUR  | Euro | € |
| GBP  | British Pound | £ |
| SGD  | Singapore Dollar | S$ |
| AUD  | Australian Dollar | A$ |
| JPY  | Japanese Yen | ¥ |
| CNY  | Chinese Yuan | ¥ |
| INR  | Indian Rupee | ₹ |
| NGN  | Nigerian Naira | ₦ |
| CAD  | Canadian Dollar | C$ |

---

## 🛠️ Implementation Details

### **Files Modified:**

1. **`/src/services/exchangeRateService.ts`** - API integration & caching
2. **`/src/utils/currency.ts`** - Currency utilities (async + sync versions)
3. **`/src/hooks/useCurrency.ts`** - React hook with rate fetching
4. **`/src/App.tsx`** - Preloads rates on app start

### **Key Features:**

- ✅ Automatic API rate caching
- ✅ Fallback to hardcoded rates if API fails
- ✅ Synchronous display (no loading flickers)
- ✅ Works for guest and authenticated users
- ✅ Updates when user changes currency preference

---

## 🧪 Testing

### **Test the System:**

1. **Without API Key** (Fallback mode):
   - Remove `VITE_EXCHANGE_RATE_API_KEY` from `.env`
   - App uses hardcoded fallback rates
   - Check console: "using fallback rates"

2. **With API Key** (Live rates):
   - Add your API key to `.env`
   - Restart dev server: `npm run dev`
   - Check console: "Exchange rates updated successfully"
   - Change currency in Profile → See live conversion

3. **Cache Testing:**
   - First load: API call made
   - Refresh page: Cached rates used (no API call)
   - Wait 1 hour: New API call made automatically

---

## 📝 Console Logs

When working correctly, you'll see:

```txt
Fetching live exchange rates...
Exchange rates updated successfully
Using cached exchange rates  // After 1st fetch
```

If API fails:

```typescript
Error fetching exchange rates, using fallback: [error]
```

---

## 🔄 Manual Rate Refresh (Optional)

To add a manual refresh button (e.g., in Admin Dashboard):

```typescript
import { refreshExchangeRates } from '../services/exchangeRateService';

const handleRefresh = async () => {
  await refreshExchangeRates();
  alert('Exchange rates refreshed!');
};
```

---

## ⚠️ Important Notes

1. **Base Currency:** All prices stored in **MYR** in database
2. **Conversion:** Happens on display only (not in database)
3. **Guest Users:** See prices in MYR by default
4. **Registered Users:** Can select preferred currency in Profile
5. **Fallback Safety:** If API fails, hardcoded rates ensure app works

---

## 🆘 Troubleshooting

### **Problem: Prices show "RM..."**

- **Cause:** Fetching exchange rates
- **Fix:** Wait 1-2 seconds, or check API key

### **Problem: All prices still in MYR**

- **Cause:** User hasn't selected currency
- **Fix:** Go to Profile → Edit → Select Currency → Save

### **Problem: "Error fetching exchange rates"**

- **Cause:** Invalid API key or network issue
- **Fix:** Check API key in `.env`, restart server
- **Fallback:** App uses hardcoded rates automatically

### **Problem: Rate seems wrong**

- **Cause:** Using cached rate (up to 1 hour old)
- **Fix:** Normal behavior, rates update hourly
- **Force Update:** Call `refreshExchangeRates()` manually

---

## 📈 Monitoring API Usage

Check your API usage at:

- [ExchangeRate-API Dashboard](https://app.exchangerate-api.com/dashboard)

Track:

- Requests used / remaining
- Last update time
- API status

---

## 🎯 Production Recommendations

1. **Upgrade to Paid Plan** (Optional):
   - More requests if needed
   - Hourly updates instead of daily
   - Historical data access

2. **Add Error Monitoring:**
   - Log API failures
   - Alert on high failure rates
   - Monitor cache performance

3. **Consider CDN Caching:**
   - Cache rates at CDN level
   - Reduce server API calls
   - Faster global performance

---

## ✅ Success Checklist

- [ ] API key added to `.env`
- [ ] Dev server restarted
- [ ] Console shows "Exchange rates updated successfully"
- [ ] Changed currency in Profile
- [ ] Prices display in new currency
- [ ] Refreshed page, rates still show correctly
- [ ] Tested on Products, Cart, and Product Details pages

---

**All Set!** Your currency system now uses live exchange rates! 🎉💱

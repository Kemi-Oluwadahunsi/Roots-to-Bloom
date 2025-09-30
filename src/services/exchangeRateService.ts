// Exchange rate service using ExchangeRate-API
const API_BASE = "https://v6.exchangerate-api.com/v6";
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_CURRENCY = "MYR";

// Cache structure
interface RateCache {
  rates: Record<string, number>;
  timestamp: number;
}

// In-memory cache (expires after 1 hour)
let rateCache: RateCache | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Fallback rates in case API fails
const FALLBACK_RATES: Record<string, number> = {
  MYR: 1.0,
  USD: 0.21,
  EUR: 0.20,
  GBP: 0.17,
  SGD: 0.29,
  AUD: 0.33,
  JPY: 33.0,
  CNY: 1.53,
  INR: 18.5,
  NGN: 350.0,
  CAD: 0.30,
};

// Check if cache is still valid
const isCacheValid = (): boolean => {
  if (!rateCache) return false;
  const now = Date.now();
  return (now - rateCache.timestamp) < CACHE_DURATION;
};

// Fetch latest exchange rates from API
export const fetchExchangeRates = async (): Promise<Record<string, number>> => {
  // Return cached rates if still valid
  if (isCacheValid() && rateCache) {
    console.log('Using cached exchange rates');
    return rateCache.rates;
  }

  try {
    console.log('Fetching live exchange rates...');
    const response = await fetch(`${API_BASE}/${API_KEY}/latest/${BASE_CURRENCY}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    
    if (data.result === 'success' && data.conversion_rates) {
      // Cache the rates
      rateCache = {
        rates: data.conversion_rates,
        timestamp: Date.now(),
      };
      
      console.log('Exchange rates updated successfully');
      return data.conversion_rates;
    } else {
      throw new Error(data['error-type'] || 'Invalid API response');
    }
  } catch (error) {
    console.error('Error fetching exchange rates, using fallback:', error);
    // Return fallback rates if API fails
    return FALLBACK_RATES;
  }
};

// Get exchange rate for a specific currency pair
export const getExchangeRate = async (from: string, to: string): Promise<number> => {
  if (from === to) return 1.0;

  try {
    const rates = await fetchExchangeRates();
    
    // If from is MYR (base currency)
    if (from === BASE_CURRENCY) {
      return rates[to] || FALLBACK_RATES[to] || 1.0;
    }
    
    // If to is MYR (base currency)
    if (to === BASE_CURRENCY) {
      return 1 / (rates[from] || FALLBACK_RATES[from] || 1.0);
    }
    
    // For other currency pairs, convert through MYR
    const fromRate = rates[from] || FALLBACK_RATES[from] || 1.0;
    const toRate = rates[to] || FALLBACK_RATES[to] || 1.0;
    return toRate / fromRate;
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    // Use fallback rates
    const fromRate = FALLBACK_RATES[from] || 1.0;
    const toRate = FALLBACK_RATES[to] || 1.0;
    return toRate / fromRate;
  }
};

// Preload rates on app initialization (optional)
export const preloadExchangeRates = async (): Promise<void> => {
  if (!isCacheValid()) {
    await fetchExchangeRates();
  }
};

// Force refresh rates (useful for manual refresh button)
export const refreshExchangeRates = async (): Promise<Record<string, number>> => {
  rateCache = null; // Clear cache
  return await fetchExchangeRates();
};

// Get cache info for debugging
export const getCacheInfo = () => {
  if (!rateCache) return { cached: false };
  
  const age = Date.now() - rateCache.timestamp;
  const remaining = CACHE_DURATION - age;
  
  return {
    cached: true,
    ageMinutes: Math.floor(age / 60000),
    remainingMinutes: Math.floor(remaining / 60000),
  };
};

// Currency utilities for the application
import { getExchangeRate } from '../services/exchangeRateService';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

// Supported currencies (symbols and names only, rates fetched from API)
export const currencies: Record<string, CurrencyInfo> = {
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
  },
};

// Get currency info by code
export const getCurrency = (code: string = 'MYR'): CurrencyInfo => {
  return currencies[code] || currencies.MYR;
};

// Convert price from MYR to target currency (async - fetches live rates)
export const convertPrice = async (priceInMYR: number, targetCurrency: string = 'MYR'): Promise<number> => {
  if (targetCurrency === 'MYR') return priceInMYR;
  
  const rate = await getExchangeRate('MYR', targetCurrency);
  return priceInMYR * rate;
};

// Format price with currency symbol (async - fetches live rates)
export const formatPrice = async (
  priceInMYR: number, 
  targetCurrency: string = 'MYR',
  showCode: boolean = false
): Promise<string> => {
  const currency = getCurrency(targetCurrency);
  const convertedPrice = await convertPrice(priceInMYR, targetCurrency);
  
  // Format based on currency
  let formattedAmount: string;
  
  // JPY and some currencies don't use decimals
  if (currency.code === 'JPY' || currency.code === 'NGN') {
    formattedAmount = Math.round(convertedPrice).toLocaleString();
  } else {
    formattedAmount = convertedPrice.toFixed(2);
  }
  
  // Return with symbol and optionally code
  if (showCode) {
    return `${currency.symbol}${formattedAmount} ${currency.code}`;
  }
  return `${currency.symbol}${formattedAmount}`;
};

// Synchronous versions for when rates are already cached
export const convertPriceSync = (priceInMYR: number, targetCurrency: string, rate: number): number => {
  if (targetCurrency === 'MYR') return priceInMYR;
  return priceInMYR * rate;
};

export const formatPriceSync = (
  priceInMYR: number, 
  targetCurrency: string,
  rate: number,
  showCode: boolean = false
): string => {
  const currency = getCurrency(targetCurrency);
  const convertedPrice = convertPriceSync(priceInMYR, targetCurrency, rate);
  
  // Format based on currency
  let formattedAmount: string;
  
  // JPY and some currencies don't use decimals
  if (currency.code === 'JPY' || currency.code === 'NGN') {
    formattedAmount = Math.round(convertedPrice).toLocaleString();
  } else {
    formattedAmount = convertedPrice.toFixed(2);
  }
  
  // Return with symbol and optionally code
  if (showCode) {
    return `${currency.symbol}${formattedAmount} ${currency.code}`;
  }
  return `${currency.symbol}${formattedAmount}`;
};

// Get all available currencies as array
export const getAvailableCurrencies = (): CurrencyInfo[] => {
  return Object.values(currencies);
};

// Default currency
export const DEFAULT_CURRENCY = 'MYR';

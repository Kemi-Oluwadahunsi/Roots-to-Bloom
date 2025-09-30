import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatPriceSync, convertPriceSync, getCurrency, DEFAULT_CURRENCY } from '../utils/currency';
import { getExchangeRate } from '../services/exchangeRateService';

// Custom hook to handle currency formatting and conversion
export const useCurrency = () => {
  const { userProfile } = useAuth();
  const [exchangeRate, setExchangeRate] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  
  // Get user's preferred currency or default to MYR
  const preferredCurrency = userProfile?.preferredCurrency || DEFAULT_CURRENCY;
  const currencyInfo = getCurrency(preferredCurrency);
  
  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchRate = async () => {
      if (preferredCurrency === 'MYR') {
        setExchangeRate(1.0);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const rate = await getExchangeRate('MYR', preferredCurrency);
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(1.0); // Fallback to 1.0
      } finally {
        setLoading(false);
      }
    };
    
    fetchRate();
  }, [preferredCurrency]);
  
  // Format price using user's preferred currency (synchronous)
  const formatUserPrice = (priceInMYR: number, showCode: boolean = false): string => {
    if (loading) return `${currencyInfo.symbol}...`;
    return formatPriceSync(priceInMYR, preferredCurrency, exchangeRate, showCode);
  };
  
  // Convert price to user's preferred currency (synchronous)
  const convertUserPrice = (priceInMYR: number): number => {
    if (loading) return priceInMYR;
    return convertPriceSync(priceInMYR, preferredCurrency, exchangeRate);
  };
  
  // Get currency symbol
  const getCurrencySymbol = (): string => {
    return currencyInfo.symbol;
  };
  
  // Get currency code
  const getCurrencyCode = (): string => {
    return currencyInfo.code;
  };
  
  return {
    preferredCurrency,
    currencyInfo,
    exchangeRate,
    loading,
    formatUserPrice,
    convertUserPrice,
    getCurrencySymbol,
    getCurrencyCode,
  };
};

export default useCurrency;

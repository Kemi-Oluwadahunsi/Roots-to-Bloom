// import type React from "react";
// import { useState, useEffect } from "react";

// type Currency = "MYR" | "USD" | "EUR" | "GBP";

// interface CurrencyConverterProps {
//   amount: number;
//   from: Currency;
//   to: Currency;
// }

// const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
//   amount,
//   from,
//   to,
// }) => {
//   const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

//   useEffect(() => {
//     const exchangeRates: Record<Currency, Record<Currency, number>> = {
//       MYR: { USD: 0.24, EUR: 0.22, GBP: 0.19, MYR: 1 },
//       USD: { MYR: 4.17, EUR: 0.92, GBP: 0.79, USD: 1 },
//       EUR: { MYR: 4.55, USD: 1.09, GBP: 0.86, EUR: 1 },
//       GBP: { MYR: 5.26, USD: 1.26, EUR: 1.16, GBP: 1 },
//     };

//     if (from === to) {
//       setConvertedAmount(amount);
//     } else {
//       const rate = exchangeRates[from]?.[to]; // Safe lookup
//       if (rate !== undefined) {
//         setConvertedAmount(amount * rate);
//       } else {
//         setConvertedAmount(null); // Handle invalid conversion
//       }
//     }
//   }, [amount, from, to]);

//   return (
//     <span>
//       {convertedAmount !== null
//        ? `${to} ${convertedAmount.toFixed(2)}`
//         : "Converting..."}
//     </span>
//   );
// };

// export default CurrencyConverter;

import type React from "react";
import { useState, useEffect, useRef } from "react";

// Add up to 10 currencies
export type Currency =
  | "MYR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "SGD"
  | "JPY"
  | "INR"
  | "CNY"
  | "CAD"
  | "NGN";

interface CurrencyConverterProps {
  amount: number;
  from: Currency;
  to: Currency;
}

const API_BASE = "https://v6.exchangerate-api.com/v6";
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

// Simple in-memory cache for rates per session
const rateCache: Record<string, Record<string, number>> = {};

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  from,
  to,
}) => {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRequest = useRef({ amount, from, to });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setConvertedAmount(null);
    lastRequest.current = { amount, from, to };

    if (from === to) {
      setConvertedAmount(amount);
      setLoading(false);
      return;
    }

    // Check cache first
    if (rateCache[from] && rateCache[from][to]) {
      setConvertedAmount(amount * rateCache[from][to]);
      setLoading(false);
      return;
    }

    // Fetch from API
    const fetchRate = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/${API_KEY}/pair/${from}/${to}`
        );
        const data = await res.json();
        if (data.result === "success" && typeof data.conversion_rate === "number") {
          // Cache the rate
          if (!rateCache[from]) rateCache[from] = {};
          rateCache[from][to] = data.conversion_rate;
          if (isMounted && lastRequest.current.amount === amount && lastRequest.current.from === from && lastRequest.current.to === to) {
            setConvertedAmount(amount * data.conversion_rate);
          }
        } else {
          throw new Error(data["error-type"] || "Failed to fetch rate");
        }
      } catch (err: unknown) {
        if (isMounted) setError("Conversion failed");
        console.log(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRate();
    return () => {
      isMounted = false;
    };
  }, [amount, from, to]);

  if (loading) return <span>Converting...</span>;
  if (error) return <span style={{ color: "red" }}>{error}</span>;
  return (
    <span>
      {convertedAmount !== null
        ? `${to} ${convertedAmount.toFixed(2)}`
        : "Converting..."}
    </span>
  );
};

export default CurrencyConverter;

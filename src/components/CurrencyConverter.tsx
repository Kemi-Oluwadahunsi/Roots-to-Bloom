import type React from "react";
import { useState, useEffect } from "react";

type Currency = "MYR" | "USD" | "EUR" | "GBP";

interface CurrencyConverterProps {
  amount: number;
  from: Currency;
  to: Currency;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  from,
  to,
}) => {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    const exchangeRates: Record<Currency, Record<Currency, number>> = {
      MYR: { USD: 0.24, EUR: 0.22, GBP: 0.19, MYR: 1 },
      USD: { MYR: 4.17, EUR: 0.92, GBP: 0.79, USD: 1 },
      EUR: { MYR: 4.55, USD: 1.09, GBP: 0.86, EUR: 1 },
      GBP: { MYR: 5.26, USD: 1.26, EUR: 1.16, GBP: 1 },
    };

    if (from === to) {
      setConvertedAmount(amount);
    } else {
      const rate = exchangeRates[from]?.[to]; // Safe lookup
      if (rate !== undefined) {
        setConvertedAmount(amount * rate);
      } else {
        setConvertedAmount(null); // Handle invalid conversion
      }
    }
  }, [amount, from, to]);

  return (
    <span>
      {convertedAmount !== null
        ? `${to} ${convertedAmount.toFixed(2)}`
        : "Converting..."}
    </span>
  );
};

export default CurrencyConverter;

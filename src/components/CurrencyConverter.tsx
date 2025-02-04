import type React from "react";
import { useState, useEffect } from "react";

interface CurrencyConverterProps {
  amount: number;
  from: string;
  to: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  from,
  to,
}) => {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the exchange rate from an API
    // For this example, we'll use hardcoded exchange rates
    const exchangeRates = {
      MYR: { USD: 0.24, EUR: 0.22, GBP: 0.19 },
      USD: { MYR: 4.17, EUR: 0.92, GBP: 0.79 },
      EUR: { MYR: 4.55, USD: 1.09, GBP: 0.86 },
      GBP: { MYR: 5.26, USD: 1.26, EUR: 1.16 },
    };

    if (from === to) {
      setConvertedAmount(amount);
    } else {
      const rate =
        exchangeRates[from as keyof typeof exchangeRates][
          to as keyof (typeof exchangeRates)[typeof from]
        ];
      setConvertedAmount(amount * rate);
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

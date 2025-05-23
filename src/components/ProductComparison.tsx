import type React from "react";
import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
import CurrencyConverter from "./CurrencyConverter";
import { Currency } from "../data/products"

const ProductComparison: React.FC = () => {
  const { products } = useProductContext();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
const [currency, setCurrency] = useState<Currency>(Currency.MYR);

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
        Product Comparison
      </h2>
      <div className="mb-4">
        <label
          htmlFor="product-select"
          className="block text-sm font-medium text-[#48392e] dark:text-[#f8f7f2] mb-2"
        >
          Select up to 3 products to compare:
        </label>
        <select
          id="product-select"
          onChange={(e) => handleProductSelect(e.target.value)}
          className="w-full sm:w-2/4 lg:w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
        >
          <option value="">Choose a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="currency-select"
          className="block text-sm font-medium text-[#48392e] dark:text-[#f8f7f2] mb-2"
        >
          Select Currency:
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="w-full sm:w-2/4  lg:w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
        >
          {Object.values(Currency).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#4b774a] text-white dark:text-[#e0e0e0]">
              <th className="p-2 border border-gray-300">Product</th>
              <th className="p-2 border border-gray-300">Category</th>
              <th className="p-2 border border-gray-300">Sizes</th>
              <th className="p-2 border border-gray-300">Prices</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((productId) => {
              const product = products.find((p) => p.id === productId);
              if (!product) return null;
              return (
                <tr key={product.id} className="text-xs sm:text-base">
                  <td className="p-2 border border-gray-300">{product.name}</td>
                  <td className="p-2 border border-gray-300">
                    {product.category}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {product.sizePrices.map((sp) => sp.size).join(", ")}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {product.sizePrices.map((sp, index) => (
                      <div key={index}>
                        {sp.size}:{" "}
                        <CurrencyConverter
                          amount={sp.price}
                          from={Currency.MYR}
                          to={currency}
                        />
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;

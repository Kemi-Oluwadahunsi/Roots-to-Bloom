import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductContext } from "../context/ProductContext";
import ProductPopup from "../components/ProductPopup";
import CurrencyConverter from "../components/CurrencyConverter";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProductContext();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [currency, setCurrency] = useState("MYR");

  const product = getProduct(id || "");

  if (!product) {
    return <div>Product not found</div>;
  }

  const selectedSizePrice = product.sizePrices.find(
    (sp) => sp.size === selectedSize
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-[#48392e] mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-[#4b774a] mb-4">
            {product.category} - {product.subCategory}
          </p>
          <div className="mb-4">
            <label
              htmlFor="size-select"
              className="block text-sm font-medium text-[#48392e] mb-2"
            >
              Select Size:
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose a size</option>
              {product.sizePrices.map((sp) => (
                <option key={sp.size} value={sp.size}>
                  {sp.size}
                </option>
              ))}
            </select>
          </div>
          {selectedSizePrice && (
            <div className="mb-4">
              <p className="text-xl font-semibold text-[#d79f63]">
                Price:{" "}
                <CurrencyConverter
                  amount={selectedSizePrice.price}
                  from="MYR"
                  to={currency}
                />
              </p>
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="currency-select"
              className="block text-sm font-medium text-[#48392e] mb-2"
            >
              Select Currency:
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="MYR">MYR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <p className="text-[#48392e] mb-6">{product.description}</p>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-[#4b774a] text-white py-2 px-6 rounded-full hover:bg-[#3a6639] transition duration-300"
            disabled={!selectedSize}
          >
            Shop Now
          </button>
        </div>
      </div>
      {showPopup && (
        <ProductPopup
          shopeeLink={product.shopeeLink}
          lazadaLink={product.lazadaLink}
          onClose={() => setShowPopup(false)}
        />
      )}
    </motion.div>
  );
};

export default ProductDetails;

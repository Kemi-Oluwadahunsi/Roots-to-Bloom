import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductContext } from "../context/ProductContext";
import ProductPopup from "../components/ProductPopup";
import CurrencyConverter from "../components/CurrencyConverter";
import ImageGallery from "../components/ImageGallery";
import ProductFAQ from "../components/ProductFAQ";
import { Currency } from "../data/products";
import { ArrowLeft } from "lucide-react";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProductContext();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [currency, setCurrency] = useState<Currency>(Currency.MYR);

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
      className="container mx-auto xl:w-[60%] pb-16 lg:pb-24 lg:pt-16 pt-20"
    >
      <Link
        to="/products"
        className="inline-flex items-center text-[#4b774a] hover:text-[#3a6639] text-sm lg:text-base mb-4"
      >
        <ArrowLeft className="mr-2 text-sm lg:text-base" />
        Shop More Products
      </Link>
      <div className="grid gap-8 lg:gap-20 md:grid-cols-2 ">
        <div className="md:sticky md:top-24 relative ">
          <div className="bg-transparent absolute inset-0"></div>
          <ImageGallery
            images={product.images || []}
            mainImage={product.image}
            alt={product.name}
          />
        </div>

        <div className="space-y-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4"
            >
              {product.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="sm:text-lg text-[#4b774a] dark:text-[#6a9e69]">
                {product.category} - {product.subCategory}
              </span>
              <div className="flex items-center">
                <span className="text-[#d79f63] dark:text-[#b58552]">★</span>
                <span className="ml-1 text-[#48392e] dark:text-[#e0e0e0]">
                  {product.rating}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="w-[80%] xl:w-full">
              <label
                htmlFor="size-select"
                className="block font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2"
              >
                Select Size:
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
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
              <div className="text-xl font-semibold text-[#d79f63] dark:text-[#b58552]">
                Price:{" "}
                <CurrencyConverter
                  amount={selectedSizePrice.price}
                  from={Currency.MYR}
                  to={currency}
                />
              </div>
            )}

            <div className="w-[80%] xl:w-full">
              <label
                htmlFor="currency-select"
                className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2"
              >
                Select Currency:
              </label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
              >
                {Object.values(Currency).map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
                ;
              </select>
            </div>

            <p className="text-[#48392e] dark:text-[#e0e0e0] text-sm sm:text-base">
              {product.description}
            </p>

            <div className="w-3/4 mx-auto ">
              <button
                onClick={() => setShowPopup(true)}
                className="w-full bg-[#4b774a] dark:bg-[#6a9e69] text-white py-2 px-6 rounded-full hover:bg-opacity-80 transition duration-300 disabled:opacity-50 cursor-pointer"
                disabled={!selectedSize}
              >
                Shop Now
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
              Product Information
            </h2>
            <ProductFAQ product={product} />
          </motion.div>
        </div>
      </div>

      {showPopup && (
        <ProductPopup
          shopeeLink={product.shopeeLink}
          carousellLink={product.carousellLink}
          onClose={() => setShowPopup(false)}
        />
      )}
    </motion.div>
  );
};

export default ProductDetails;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductContext } from "../context/ProductContext";
import ImageGallery from "../components/ImageGallery";
import ProductFAQ from "../components/ProductFAQ";
import ProductReviews from "../components/reviews/ProductReviews";
import AddToCartButton from "../components/cart/AddToCartButton";
import { Currency } from "../data/products";
import { ArrowLeft, Star } from "lucide-react";
import type { EnhancedProduct } from "../types/ecommerce";
import { useCurrency } from "../hooks/useCurrency";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, fetchProductRating, loading: productsLoading } = useProductContext();
  const { formatUserPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState("");
  const [currency, setCurrency] = useState<Currency>(Currency.MYR);
  const [quantity, setQuantity] = useState(1);

  const product = getProduct(id || "");

  useEffect(() => {
    const loadRating = async () => {
      if (id) {
        // setIsLoadingRating(true);
        await fetchProductRating(id);
        // setIsLoadingRating(false);
      }
    };

    loadRating();
  }, [id, fetchProductRating]);

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b774a] mx-auto mb-4"></div>
          <p className="text-[#48392e] dark:text-[#e0e0e0]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
            Product not found
          </h1>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-[#4b774a] text-white rounded-md hover:bg-opacity-90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedSizePrice = product.sizePrices.find(
    (sp) => sp.size === selectedSize
  );

  // Use the calculated rating from Firestore if available, otherwise fall back to the hardcoded rating
  const displayRating = product.calculatedRating || 0;
  const reviewCount = product.reviewCount || 0;

  // Convert product to EnhancedProduct format
  const enhancedProduct: EnhancedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: selectedSizePrice?.price || product.sizePrices[0]?.price || 0,
    image: product.image,
    images: product.images || [product.image],
    category: product.category,
    stock: 100, // Default stock
    isActive: product.status === "Available",
    tags: [product.category, product.subCategory],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create sizePrice object if size is selected
  const sizePrice = selectedSizePrice ? {
    size: selectedSizePrice.size,
    price: selectedSizePrice.price,
  } : undefined;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto xl:w-[60%] pb-16 lg:pb-24 lg:pt-16 pt-20"
    >
      <Link
        to="/products"
        className="inline-flex items-center text-[#4b774a] hover:text-[#3a6639] text-sm lg:text-base mb-4 pl-4 lg:pl-0"
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

        <div className="space-y-6 px-4 lg:px-0">
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
                {displayRating < 0 ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No ratings yet
                  </span>
                ) : (
                  <>
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(displayRating)
                              ? "text-[#d79f63] fill-[#d79f63]"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#48392e] dark:text-[#e0e0e0]">
                      {displayRating.toFixed(1)} ({reviewCount}{" "}
                      {reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </>
                )}
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
                Select Size: <span className="text-red-500">*</span>
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                required
              >
                <option value="">Choose a size</option>
                {product.sizePrices.map((sp) => (
                  <option key={sp.size} value={sp.size}>
                    {sp.size}
                  </option>
                ))}
              </select>
              {!selectedSize && (
                <p className="text-sm text-red-500 mt-1">Size selection is required</p>
              )}
            </div>

            {selectedSizePrice && (
              <div className="text-xl font-semibold text-[#d79f63] dark:text-[#b58552]">
                Price: {formatUserPrice(selectedSizePrice.price)}
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

            {/* Quantity Selector */}
            <div className="w-[80%] xl:w-full">
              <label
                htmlFor="quantity-select"
                className="block font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2"
              >
                Quantity:
              </label>
              <select
                id="quantity-select"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <div className="w-3/4 mx-auto">
              <AddToCartButton
                product={enhancedProduct}
                sizePrice={sizePrice}
                size="lg"
                showQuantity={false}
              />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProductReviews productId={id || ""} />
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductDetails;

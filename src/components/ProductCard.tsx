import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductContext, type SizePrice } from "../context/ProductContext";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import SizeSelectionPopup from "./cart/SizeSelectionPopup";
import type { EnhancedProduct } from "../types/ecommerce";
import { useCurrency } from "../hooks/useCurrency";
// Simple function to get clean Cloudinary URL without transformations
const getCleanImageUrl = (imageUrl: string): string => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // Extract public ID from Cloudinary URL
  const match = imageUrl.match(/\/upload\/[^/]+\/(.+)$/);
  if (match) {
    const publicId = match[1];
    const cloudName = imageUrl.match(/res\.cloudinary\.com\/([^/]+)/)?.[1];
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
  
  return imageUrl;
};

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  sizePrices: SizePrice[];
  rating: number;
  status: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  image,
  sizePrices,
  rating,
  status,
}) => {
  const { fetchProductRating } = useProductContext();
  const { formatUserPrice } = useCurrency();
  const [displayRating, setDisplayRating] = useState(rating);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const lowestPrice = Math.min(...sizePrices.map((sp) => sp.price));
  const highestPrice = Math.max(...sizePrices.map((sp) => sp.price));
  const isAvailable = status === "Available";

  useEffect(() => {
    const loadRating = async () => {
      const { rating: calculatedRating } = await fetchProductRating(id);
      if (calculatedRating > 0) {
        setDisplayRating(calculatedRating);
      }
    };

    loadRating();
  }, [id, fetchProductRating]);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAvailable) return;
    setShowSizePopup(true);
  };

  // Create enhanced product for popup
  const enhancedProduct: EnhancedProduct = {
    id,
    name,
    description: '',
    price: lowestPrice,
    image,
    images: [image],
    category,
    stock: 100,
    isActive: isAvailable,
    tags: [category],
    sizePrices,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <motion.article
      whileHover={{ scale: isAvailable ? 1.05 : 1 }}
      className="bg-[#f8f7f2] p-3 lg:p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl relative flex flex-col"
    >
      {isAvailable ? (
        <>
          <Link to={`/products/${id}`} className="flex-1">
            <img
              src={image ? getCleanImageUrl(image) : "/placeholder.svg"}
              alt={name}
              className="w-full h-32 lg:h-56 object-contain mb-4 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />

            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#48392e] mb-2">
              {name}
            </h3>
            <p className="text-[#4b774a] mb-3">{category}</p>
            
            {/* Price Range */}
            <div className="text-xs sm:text-sm lg:text-base mb-3">
              <span className="text-[#4b774a] font-bold">
                {formatUserPrice(lowestPrice)} - {formatUserPrice(highestPrice)}
              </span>
            </div>
          </Link>
          
          {/* Cart Icon and Reviews Row */}
          <div className="flex justify-between items-center">
            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="p-2 bg-[#4b774a] text-white rounded-full hover:bg-[#3d5f3c] transition-colors"
              title="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            
            {/* Reviews */}
            {displayRating > 0 && (
              <span className="text-[#d79f63] text-xs sm:text-sm">
                ★ {displayRating.toFixed(1)}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <img
            src={image ? getCleanImageUrl(image) : "/placeholder.svg"}
            alt={name}
            className="w-full h-48 lg:h-72 object-cover mb-4 rounded opacity-50"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-[#48392e] mb-2">
            {name}
          </h3>
          <p className="text-[#4b774a] mb-2">{category}</p>
          <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center rounded-lg">
            <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
              Coming Soon
            </span>
          </div>
        </>
      )}

      {/* Size Selection Popup */}
      <SizeSelectionPopup
        isOpen={showSizePopup}
        onClose={() => setShowSizePopup(false)}
        product={enhancedProduct}
      />
    </motion.article>
  );
};

export default ProductCard;

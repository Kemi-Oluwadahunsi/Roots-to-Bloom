import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductContext, type SizePrice } from "../context/ProductContext";
import { useEffect, useState } from "react";
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
  const [displayRating, setDisplayRating] = useState(rating);
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

  return (
    <motion.article
      whileHover={{ scale: isAvailable ? 1.05 : 1 }}
      className="bg-[#f8f7f2] p-3 lg:p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl relative"
    >
      {isAvailable ? (
        <Link to={`/products/${id}`}>
          <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>

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
          <p className="text-[#4b774a] mb-2">{category}</p>
          <div className="flex justify-between items-center text-xs sm:text-sm lg:text-base">
            <span className="text-[#4b774a] font-bold">
              ${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}
            </span>
            {/* {rating > 0 && (
              <span className="text-[#d79f63]">★ {rating.toFixed(1)}</span>
            )} */}
            {displayRating > 0 && (
              <span className="text-[#d79f63]">
                ★ {displayRating.toFixed(1)}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <>
          <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>
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
    </motion.article>
  );
};

export default ProductCard;

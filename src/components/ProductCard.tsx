import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { SizePrice } from "../context/ProductContext";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  sizePrices: SizePrice[];
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  image,
  sizePrices,
  rating,
}) => {
  const lowestPrice = Math.min(...sizePrices.map((sp) => sp.price));
  const highestPrice = Math.max(...sizePrices.map((sp) => sp.price));

  return (
    <motion.article
      whileHover={{ scale: 1.05 }}
      className="bg-[#f8f7f2] p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl"
    >
      <Link to={`/products/${id}`}>
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <h3 className="text-xl font-semibold text-[#48392e] mb-2">{name}</h3>
        <p className="text-[#4b774a] mb-2">{category}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#4b774a] font-bold">
            ${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}
          </span>
          <span className="text-[#d79f63]">★ {rating.toFixed(1)}</span>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;

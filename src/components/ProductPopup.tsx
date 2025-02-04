import type React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ProductPopupProps {
  shopeeLink: string;
  lazadaLink: string;
  onClose: () => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({
  shopeeLink,
  lazadaLink,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#48392e] mb-4">
          Choose a marketplace
        </h2>
        <div className="space-y-4">
          <a
            href={shopeeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-[#d79f63] text-white text-center rounded-md hover:bg-[#c28a4e] transition duration-300"
          >
            Shop on Shopee
          </a>
          <a
            href={lazadaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-[#4b774a] text-white text-center rounded-md hover:bg-[#3a6639] transition duration-300"
          >
            Shop on Lazada
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductPopup;

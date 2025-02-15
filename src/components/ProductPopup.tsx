"use client";

import type React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";

interface ProductPopupProps {
  shopeeLink: string;
  carousellLink: string;
  onClose: () => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({
  shopeeLink,
  carousellLink,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <motion.div
        ref={popupRef}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
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
            className="block w-full py-2 px-4 bg-[#fb5231] text-white text-center rounded-md hover:bg-[#fe6232] transition duration-300"
          >
            Shop on Shopee
          </a>
          <a
            href={carousellLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-[#ff2736] text-white text-center rounded-md hover:bg-[#fe2736] transition duration-300"
          >
            Shop on Carousell
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductPopup;

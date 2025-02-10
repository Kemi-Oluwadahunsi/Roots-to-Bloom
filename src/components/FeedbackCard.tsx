import type React from "react";
import { motion } from "framer-motion";

interface FeedbackCardProps {
  onClose: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 flex items-center justify-center bg-black/90 z-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col ">
        <h3 className="text-xl font-semibold text-[#4b774a] dark:text-[#6a9e69] mb-4">
          Thank you for subscribing!
        </h3>
        <p className="text-[#48392e] dark:text-[#e0e0e0] mb-6">
          You've successfully subscribed to our newsletter. We'll keep you
          updated with the latest news, offers, and beauty tips tailored to your
          interests.
        </p>
        <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-2/3 inline-flex items-center justify-center px-4 py-2 bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#e0e0e0] rounded-full hover:bg-opacity-80 transition duration-300"
            >
              Close
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;

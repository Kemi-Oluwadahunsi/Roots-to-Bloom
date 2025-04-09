import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface ReviewSuccessModalProps {
  onClose: () => void;
}

const ReviewSuccessModal = ({ onClose }: ReviewSuccessModalProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-[#4b774a] dark:text-[#6a9e69] mb-4" />
          <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">
            Thank You!
          </h3>
          <p className="text-[#48392e] dark:text-[#e0e0e0] mb-6">
            Your review has been submitted successfully. We appreciate your
            feedback!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewSuccessModal;

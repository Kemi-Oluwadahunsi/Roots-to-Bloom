import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ReviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewPanel = ({ isOpen, onClose }: ReviewPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-end"
        >
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-[#2a2a2a] w-full max-w-md md:max-w-lg lg:max-w-xl h-full overflow-hidden shadow-xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] sticky top-0 z-10">
              <div className="flex justify-between items-center mt-20">
                <h2 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0]">
                  Customer Reviews
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#48392e] cursor-pointer dark:text-[#e0e0e0] hover:text-[#d79f63] dark:hover:text-[#b58552]"
                  aria-label="Close reviews panel "
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="space-y-8">
                <ReviewForm />
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-4">
                    Recent Reviews
                  </h3>
                  <ReviewList />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewPanel;

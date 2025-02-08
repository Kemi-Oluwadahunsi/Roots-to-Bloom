import type React from "react";
import{ motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center pt-[10rem]">
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-t-transparent border-b-transparent relative"
        style={{
          borderLeftColor: "#d79f63",
          borderRightColor: "#4b774a",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent"
          style={{
            borderLeftColor: "#48392e",
            borderRightColor: "#3a6639",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;

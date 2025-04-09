import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ReviewPanel from "./ReviewPanel";

const ReviewButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={togglePanel}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#4b774a] dark:bg-[#6a9e69] text-white px-1 py-2 sm:px-3 sm:py-4 rounded-l-lg shadow-lg hover:bg-[#3a6639] dark:hover:bg-[#5a8e59] transition-all duration-300 z-40 flex flex-col items-center cursor-pointer"
        aria-label="Open Reviews"
      >
        <MessageSquare size={24} />
        <div
          className="mt-1 text-[0.6rem] sm:text-base font-medium tracking-normal "
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(0deg)",
            letterSpacing: "1px",
          }}
        >
          REVIEWS
        </div>
      </button>
      <ReviewPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ReviewButton;

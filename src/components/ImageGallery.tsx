"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  alt: string;
}

export default function ImageGallery({
  images,
  mainImage,
  alt,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const allImages = [mainImage, ...images];
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(allImages.length > 6);

  const carouselRef = useRef<HTMLDivElement>(null);

  const displayedImage = hoveredImage || selectedImage;

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -80 : 80;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    carouselRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      carouselRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-4 sm:px-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 max-w-md w-[80%] sm:w-[90%] lg:w-full mx-auto"
        >
          <img
            src={displayedImage || "/placeholder.svg"}
            alt={alt}
            className="h-full w-full object-contain sm:object-cover object-center"
          />
          <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-sm sm:max-w-md mx-auto overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-1 sm:gap-2 overflow-x-hidden scrollbar-hide p-2 sm:px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {allImages.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(image)}
              onMouseEnter={() => setHoveredImage(image)}
              onMouseLeave={() => setHoveredImage(null)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer
                ${
                  selectedImage === image
                    ? "ring-2 ring-[#4b774a] dark:ring-[#6a9e69]"
                    : ""
                }`}
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${alt} - View ${index + 1}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>
            </motion.button>
          ))}
        </div>
        {showLeftButton && (
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        {showRightButton && (
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
}

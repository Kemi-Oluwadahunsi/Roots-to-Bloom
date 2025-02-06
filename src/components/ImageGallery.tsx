import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const allImages = [mainImage, ...images];

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <img
            src={selectedImage || "/placeholder.svg"}
            alt={alt}
            className="h-full w-full object-contain object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 
              ${
                selectedImage === image
                  ? "ring-2 ring-[#4b774a] dark:ring-[#6a9e69]"
                  : ""
              }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${alt} - View ${index + 1}`}
              className="h-full w-full object-contain object-center"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

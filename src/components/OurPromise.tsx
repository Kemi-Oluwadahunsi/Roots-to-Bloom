import type React from "react";
import { motion } from "framer-motion";
import { Ban, Leaf, Heart, Droplet } from "lucide-react";

const OurPromise: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className="py-20 bg-[#f0e6d2] dark:bg-[#363636]"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeInUp}
          className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-12"
        >
          Our Promise
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <PromiseItem
            icon={
              <Ban className="w-16 h-16 mx-auto text-[#4b774a] dark:text-[#6a9e69]" />
            }
            title="Paraben & GMO Free"
          />
          <PromiseItem
            icon={
              <Leaf className="w-16 h-16 mx-auto text-[#d79f63] dark:text-[#b58552]" />
            }
            title="Holistic Formulas"
          />
          <PromiseItem
            icon={
              <Heart className="w-16 h-16 mx-auto text-[#4b774a] dark:text-[#6a9e69]" />
            }
            title="Cruelty Free"
          />
          <PromiseItem
            icon={
              <Droplet className="w-16 h-16 mx-auto text-[#d79f63] dark:text-[#b58552]" />
            }
            title="Phthalate & Sulfate Free"
          />
        </div>
      </div>
    </motion.section>
  );
};

const PromiseItem: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({ icon, title }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0]">
        {title}
      </h3>
    </motion.div>
  );
};

export default OurPromise;

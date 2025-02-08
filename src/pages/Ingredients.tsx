"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ingredient {
  name: string;
  image: string;
  description: string;
  category: "skin" | "hair";
}

const ingredients: Ingredient[] = [
  {
    name: "Amla",
    image: "/images/ingredients/amla.jpg",
    description:
      "Rich in Vitamin C, Amla strengthens hair follicles and promotes hair growth.",
    category: "hair",
  },
  {
    name: "Neem",
    image: "/images/ingredients/neem.jpg",
    description:
      "Known for its antibacterial properties, Neem helps combat dandruff and scalp infections.",
    category: "hair",
  },
  {
    name: "Bhringraj",
    image: "/images/ingredients/bhringraj.jpg",
    description:
      "Often called the 'king of herbs', Bhringraj is known to prevent hair fall and premature graying.",
    category: "hair",
  },
  {
    name: "Brahmi",
    image: "/images/ingredients/brahmi.jpg",
    description:
      "Brahmi strengthens hair roots and promotes thicker, healthier hair growth.",
    category: "hair",
  },
  {
    name: "Aloe Vera",
    image: "/images/ingredients/aloe-vera.jpg",
    description:
      "Aloe Vera moisturizes the scalp, reduces dandruff, and conditions hair.",
    category: "hair",
  },
  {
    name: "Hibiscus",
    image: "/images/ingredients/hibiscus.jpg",
    description:
      "Hibiscus promotes hair growth, prevents hair loss, and adds natural shine.",
    category: "hair",
  },
  {
    name: "Ashwagandha",
    image: "/images/ingredients/ashwagandha.jpg",
    description:
      "Ashwagandha improves scalp circulation and helps strengthen hair.",
    category: "hair",
  },
  {
    name: "Shikakai",
    image: "/images/ingredients/shikakai.jpg",
    description:
      "Shikakai cleanses the hair and scalp while promoting hair growth.",
    category: "hair",
  },
  {
    name: "Turmeric",
    image: "/images/ingredients/turmeric.jpg",
    description:
      "Turmeric has anti-inflammatory properties that help soothe and brighten the skin.",
    category: "skin",
  },
  {
    name: "Sandalwood",
    image: "/images/ingredients/sandalwood.jpg",
    description:
      "Sandalwood helps to soothe and cool the skin, reducing redness and irritation.",
    category: "skin",
  },
  {
    name: "Rose",
    image: "/images/ingredients/rose.jpg",
    description:
      "Rose has hydrating properties and helps to balance the skin's pH levels.",
    category: "skin",
  },
  {
    name: "Saffron",
    image: "/images/ingredients/saffron.jpg",
    description:
      "Saffron is known for its skin-brightening and anti-aging properties.",
    category: "skin",
  },
];

const IngredientCard = ({ ingredient }: { ingredient: Ingredient }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={ingredient.image || "/placeholder.svg"}
        alt={ingredient.name}
        className="w-full h-full object-cover"
      />
      <motion.div
        className="absolute inset-0 bg-[#4b774a] bg-opacity-90 dark:bg-[#6a9e69] dark:bg-opacity-90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">
            {ingredient.name}
          </h3>
          <p className="text-white text-sm">{ingredient.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Ingredients = () => {
  const [selectedCategory, setSelectedCategory] = useState<"hair" | "skin">(
    "hair"
  );
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    setFilteredIngredients(
      ingredients.filter(
        (ingredient) => ingredient.category === selectedCategory
      )
    );
  }, [selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-16"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-8 text-center">
          Our Ayurvedic Ingredients
        </h1>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <p className="text-lg text-[#48392e] dark:text-[#e0e0e0] mb-8">
            At Roots to Bloom, we've chosen Ayurvedic ingredients for our skin
            and hair care products because of their time-tested efficacy and
            holistic approach to beauty. Ayurveda, the ancient Indian system of
            medicine, emphasizes the use of natural ingredients to promote
            balance and overall well-being. These powerful botanicals have been
            used for centuries to nourish, heal, and enhance beauty from within.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedCategory("hair")}
              className={`px-6 py-2 rounded-full ${
                selectedCategory === "hair"
                  ? "bg-[#4b774a] text-white"
                  : "bg-white text-[#4b774a] border border-[#4b774a]"
              } transition-colors duration-300`}
            >
              For Hair
            </button>
            <button
              onClick={() => setSelectedCategory("skin")}
              className={`px-6 py-2 rounded-full ${
                selectedCategory === "skin"
                  ? "bg-[#4b774a] text-white"
                  : "bg-white text-[#4b774a] border border-[#4b774a]"
              } transition-colors duration-300`}
            >
              For Skin
            </button>
          </div>
        </motion.section>
        <AnimatePresence>
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {filteredIngredients.map((ingredient) => (
              <IngredientCard key={ingredient.name} ingredient={ingredient} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Ingredients;

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ingredients, type Ingredient } from "../data/ingredients";
import "animate.css";

const IngredientCard: React.FC<{ ingredient: Ingredient }> = ({
  ingredient,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full h-50 lg:h-64 rounded-lg overflow-hidden cursor-pointer "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full">
        <img
          src={ingredient.image || "/placeholder.svg"}
          alt={ingredient.name}
          className="w-full h-full object-cover relative"
        />
        <p className="absolute bottom-0 w-full py-2 text-white font-bold xl:text-lg bg-[#4b774a] bg-opacity-40 dark:bg-[#6a9e69] dark:bg-opacity-60 text-center">
          {ingredient.name}
        </p>
      </div>
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
          <p className="text-white text-xs sm:text-sm">
            {ingredient.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Ingredients: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"hair" | "skin">(
    "hair"
  );
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );
  const [medicalIngredients, setMedicalIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    setFilteredIngredients(
      ingredients.filter(
        (ingredient) =>
          ingredient.category.includes(selectedCategory) &&
          !ingredient.category.includes("medical")
      )
    );
    setMedicalIngredients(
      ingredients.filter((ingredient) =>
        ingredient.category.includes("medical")
      )
    );
  }, [selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-16 sm:px-4 lg:px-0 "
    >
      <div className="flex flex-col lg:flex-row justify-around lg:justify-between items-center mb-[3rem] lg:mb-[5rem] lg:w-[90%] xl:w-[70%] sm:h-[36rem] lg:h-[30rem] lg:pt-16 xl:pt-0 mx-auto animate_animate animate__fadeIn">
        <div className="flex flex-col ">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-4 lg:mb-8 text-center ">
            Inside Our Ingredients
          </h2>
          <p className="text-sm sm:text-base lg:text-lg w-[85%] sm:w-[70%] lg:[w-80%] xl:w-[70%] mx-auto text-[#48392e] dark:text-[#e0e0e0] mb-6 sm:mb-0 lg:mb-8 text-center">
            Learn about the nutrient-rich botanicals and molecular ingredients
            in our luxurious, high-performance formulas.
          </p>
        </div>

        <div className="w-[90%] h-full sm:w-[70%] sm:h-[70%] lg:w-full lg:h-full">
          <img
            src="/images/ingredients/ingredientsMain.webp"
            alt="Ingredient-image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Medical-grade Ingredients */}
      <div className="container mx-auto px-4 mb-8 lg:mb-16 border-t border-t-[#4b774a] dark:border-t-[#6a9e69] pt-8 lg:pt-16">
        <div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-4 text-center">
            Medical-Grade Efficacy Ingredients
          </h2>
          <p className="text-sm sm:text-base lg:text-lg w-[85%] lg:w-[70%] mx-auto text-[#48392e] dark:text-[#e0e0e0] mb-12 text-center ">
            Roots to Bloom uses the best of molecular science and high quality
            ingredients to create high-performing products.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-4 mx-4"
        >
          {medicalIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.name} ingredient={ingredient} />
          ))}
        </motion.div>
      </div>

      {/* Ayurvedic Ingredients */}
      <div className="container mx-auto px-4 border-t border-t-[#4b774a] dark:border-t-[#6a9e69] pt-8 lg:pt-16">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4b774a] dark:text-[#6a9e69] mb-6 lg:mb-8 text-center">
          Active Ayurvedic Ingredients
        </h2>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-12 text-center"
        >
          <p className="text-sm sm:text-base lg:text-lg text-[#48392e] dark:text-[#e0e0e0] mb-8">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8"
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


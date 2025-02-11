import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import ProductComparison from "../components/ProductComparison";

const Products: React.FC = () => {
  const location = useLocation();
  const { products } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubCategory, setActiveSubCategory] = useState("all");
  const [activeSize, setActiveSize] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setActiveCategory(category);
    }
  }, [location]);

  useEffect(() => {
    let filtered = products;
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === activeCategory
      );
    }
    if (activeSubCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.subCategory === activeSubCategory
      );
    }
    if (activeSize !== "all") {
      filtered = filtered.filter((product) =>
        product.sizePrices.some((sp) => sp.size === activeSize)
      );
    }
    setFilteredProducts(filtered);
  }, [products, activeCategory, activeSubCategory, activeSize]);

  const categories = ["all", "hair", "skin"];
  const subCategories = {
    hair: ["all", "shampoos", "conditioners", "masks", "oils", "creams"],
    skin: ["all", "butter creams", "bar soaps", "body scrubs"],
  };
  const sizes = ["all", "100ml", "250ml", "500ml"];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 sm:px-8 lg:px-[3rem] xl:px-[5rem] pb-16 pt-20 lg:pb-24 lg:pt-16 bg-[#f8f7f2] dark:bg-[#1a1a1a]"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-8 text-center">
        Our Products
      </h1>

      <nav className="mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#4b774a] dark:text-[#6a9e69] mb-4">
          Categories
        </h2>
        <ul className="flex flex-wrap gap-2 lg:gap-4">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => {
                  setActiveCategory(category);
                  setActiveSubCategory("all");
                }}
                className={`px-4 py-2 rounded-full cursor-pointer ${
                  activeCategory === category
                    ? "bg-[#d79f63] text-white dark:bg-[#b58552] dark:text-[#1a1a1a]"
                    : "bg-[#ececea] text-[#48392e] dark:bg-[#2a2a2a] dark:text-[#e0e0e0]"
                } transition-colors duration-300`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeCategory !== "all" && (
        <nav className="mb-4 lg:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#4b774a] dark:text-[#6a9e69] mb-4">
            Sub-Categories
          </h2>
          <ul className="flex flex-wrap gap-4">
            {subCategories[activeCategory as keyof typeof subCategories].map(
              (subCategory) => (
                <li key={subCategory}>
                  <button
                    onClick={() => setActiveSubCategory(subCategory)}
                    className={`px-4 py-2 rounded-full cursor-pointer ${
                      activeSubCategory === subCategory
                        ? "bg-[#4b774a] text-white dark:bg-[#6a9e69] dark:text-[#1a1a1a]"
                        : "bg-[#ececea] text-[#48392e] dark:bg-[#2a2a2a] dark:text-[#e0e0e0]"
                    } transition-colors duration-300`}
                  >
                    {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      )}

      <nav className="mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#4b774a] dark:text-[#6a9e69] mb-4">
          Sizes
        </h2>
        <ul className="flex flex-wrap gap-2 sm:gap-4">
          {sizes.map((size) => (
            <li key={size}>
              <button
                onClick={() => setActiveSize(size)}
                className={`px-4 py-2 rounded-full cursor-pointer ${
                  activeSize === size
                    ? "bg-[#4b774a] text-white dark:bg-[#6a9e69] dark:text-[#1a1a1a]"
                    : "bg-[#ececea] text-[#48392e] dark:bg-[#2a2a2a] dark:text-[#e0e0e0]"
                } transition-colors duration-300`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            category={product.category}
            image={product.image}
            sizePrices={product.sizePrices}
            rating={product.rating}
          />
        ))}
      </section>

      <ProductComparison />
    </motion.section>
  );
};

export default Products;


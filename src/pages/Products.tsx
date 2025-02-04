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
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-[#48392e] mb-8 text-center">
        Our Products
      </h1>

      <nav className="mb-8">
        <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">
          Categories
        </h2>
        <ul className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => {
                  setActiveCategory(category);
                  setActiveSubCategory("all");
                }}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category
                    ? "bg-[#d79f63] text-white"
                    : "bg-[#f8f7f2] text-[#48392e]"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeCategory !== "all" && (
        <nav className="mb-8">
          <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">
            Sub-Categories
          </h2>
          <ul className="flex flex-wrap gap-4">
            {subCategories[activeCategory as keyof typeof subCategories].map(
              (subCategory) => (
                <li key={subCategory}>
                  <button
                    onClick={() => setActiveSubCategory(subCategory)}
                    className={`px-4 py-2 rounded-full ${
                      activeSubCategory === subCategory
                        ? "bg-[#4b774a] text-white"
                        : "bg-[#f8f7f2] text-[#48392e]"
                    }`}
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
        <h2 className="text-2xl font-semibold text-[#4b774a] mb-4">Sizes</h2>
        <ul className="flex flex-wrap gap-4">
          {sizes.map((size) => (
            <li key={size}>
              <button
                onClick={() => setActiveSize(size)}
                className={`px-4 py-2 rounded-full ${
                  activeSize === size
                    ? "bg-[#4b774a] text-white"
                    : "bg-[#f8f7f2] text-[#48392e]"
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

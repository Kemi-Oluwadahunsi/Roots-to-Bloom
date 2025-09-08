import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import ProductComparison from "../components/ProductComparison";

const Products: React.FC = () => {
  const location = useLocation();
  const { products, loading: productsLoading, error: productsError } = useProductContext();
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
    hair: ["all", "butters", "shampoos", "conditioners", "masks", "oils" ],
    skin: ["all", "butter creams", "bar soaps", "body scrubs"],
  };
  const sizes = ["all", "100ml/g", "120ml/g", "150ml/g", "200ml/g", "250ml/g", "500ml/g"];

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

      {/* Product Display */}
      {productsLoading ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#f8f7f2] p-3 lg:p-6 rounded-lg shadow-md animate-pulse">
              <div className="w-full h-32 lg:h-56 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </section>
      ) : productsError ? (
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {productsError}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#4b774a] text-white rounded-md hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
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
              status={product.status}
            />
          ))}
        </section>
      ) : (
        <p className="text-red-500 font-semibold mt-4 text-center">
          Products not found
        </p>
      )}

      {/* <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            category={product.category}
            image={product.image}
            sizePrices={product.sizePrices}
            rating={product.rating}
            status={product.status}
          />
        ))}
      </section> */}

      <ProductComparison />
    </motion.section>
  );
};

export default Products;


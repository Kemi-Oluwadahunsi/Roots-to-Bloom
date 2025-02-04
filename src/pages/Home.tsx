import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Sun,
  Droplet,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { blogPosts } from "../data/blogPosts";

const carouselItems = [
  {
    title: "Nurture Your Natural Beauty",
    description:
      "Discover the power of nature with Roots to Bloom's organic skincare and haircare products.",
    image: "/images/hero-skin.jpg",
  },
  {
    title: "Revitalize Your Hair",
    description:
      "Experience the transformation with our natural hair care solutions.",
    image: "/images/hero-hair.jpg",
  },
  {
    title: "Glow with Nature",
    description:
      "Unlock your skin's natural radiance with our botanical-infused products.",
    image: "/images/hero-glow.jpg",
  },
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useProductContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + carouselItems.length) % carouselItems.length
    );
  };

  const featuredProducts = products.slice(0, 3);
  const featuredBlogPosts = blogPosts.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2]"
    >
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden bg-[#f0e6d2]">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <p className="text-xl text-[#48392e] italic text-center mb-8">
            Rooted in Nature, Bloom in Beauty
          </p>
          <div className="relative">
            {carouselItems.map((item, index) => (
              <motion.div
                key={index}
                className={`${
                  index === currentSlide ? "block" : "hidden"
                } flex flex-col lg:flex-row items-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="lg:w-1/2 mb-10 lg:mb-0">
                  <h1 className="text-5xl lg:text-6xl font-bold text-[#48392e] mb-6">
                    {item.title}
                  </h1>
                  <p className="text-xl text-[#4b774a] mb-8">
                    {item.description}
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 bg-[#d79f63] text-[#48392e] rounded-full hover:bg-[#c28a4e] transition duration-300"
                  >
                    Shop Now <ArrowRight className="ml-2" />
                  </Link>
                </div>
                <div className="lg:w-1/2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="rounded-lg shadow-xl"
                  />
                </div>
              </motion.div>
            ))}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#48392e] text-[#f8f7f2] p-2 rounded-full"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#48392e] text-[#f8f7f2] p-2 rounded-full"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8f7f2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] mb-12">
            Why Choose Roots to Bloom?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Leaf className="w-12 h-12 text-[#4b774a]" />}
              title="100% Organic"
              description="Our products are made with certified organic ingredients, ensuring the purest form of nature's goodness."
            />
            <FeatureCard
              icon={<Sun className="w-12 h-12 text-[#d79f63]" />}
              title="Eco-Friendly"
              description="We're committed to sustainable practices and eco-friendly packaging to reduce our environmental impact."
            />
            <FeatureCard
              icon={<Droplet className="w-12 h-12 text-[#4b774a]" />}
              title="Cruelty-Free"
              description="All our products are cruelty-free. We never test on animals and respect all forms of life."
            />
            <FeatureCard
              icon={<Star className="w-12 h-12 text-[#d79f63]" />}
              title="Effective Results"
              description="Our formulas are backed by science and proven to deliver visible results for your skin and hair."
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
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
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#4b774a] text-[#f8f7f2] rounded-full hover:bg-[#3a6639] transition duration-300"
            >
              View All Products <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-[#f0e6d2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] mb-12">
            Latest from Our Blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogPosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                slug={post.slug}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#d79f63] text-[#48392e] rounded-full hover:bg-[#c28a4e] transition duration-300"
            >
              Read More Articles <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#4b774a]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f8f7f2] mb-6">
              Stay Connected
            </h2>
            <p className="text-lg text-[#d79f63] mb-8">
              Subscribe to our newsletter for exclusive offers, beauty tips, and
              new product announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#d79f63]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#d79f63] text-[#48392e] rounded-full hover:bg-[#c28a4e] transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#48392e] mb-2">{title}</h3>
      <p className="text-[#4b774a]">{description}</p>
    </div>
  );
};

const BlogCard: React.FC<{
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}> = ({ title, excerpt, image, slug }) => {
  return (
    <Link to={`/blog/${slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-[#48392e] mb-2">{title}</h3>
          <p className="text-[#4b774a]">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
};

export default Home;


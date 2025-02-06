import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Leaf, Sun, Droplet, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useProductContext } from "../context/ProductContext"

import ProductCard from "../components/ProductCard"
import { blogPosts } from "../data/blogPosts"
import OurPromise from "../components/OurPromise"

const carouselItems = [
  {
    title: "Experience Botanical Glow",
    description:
      "Gentle yet powerful, our botanical-rich formulations are crafted to deeply hydrate, repair, and enhance your natural glow without irritation. Balanced for all skin and hair types, because beauty should feel as good as it looks.",
    image: "/images/Natural-ingredients.png",
  },
  {
    title: "Effective Visible Results",
    description:
      "Made with nutrient-rich butters, herbal extracts, and lightweight oils, our products deliver deep moisture and lasting strength—free from parabens, sulfates, and harsh chemicals. Just nature's best, designed for your best.",
    image: "/images/result4.png",
  },
  {
    title: "Strengthen, Restore, Flourish",
    description:
      "Experience the power of deep moisture with our highly hydrating, non-greasy formulations. Designed to replenish, restore balance, and lock in hydration without clogging pores or weighing hair down.",
    image: "/images/grreen-nature.png",
  },
  {
    title: "Made For Every YOU ~",
    description:
      "For every skin and hair type; dry, oily, or sensitive, curly, coily, or straight. Our formulas are crafted to work in harmony with all textures and skin types. Nature's care, tailored for everyone.",
    image: "/images/allTypes.png",
  },
]

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { products } = useProductContext()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carouselItems.length) % carouselItems.length)
  }

  const featuredProducts = products.slice(0, 3)
  const featuredBlogPosts = blogPosts.slice(0, 3)

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
  }

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a]"
    >
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden bg-[#f0e6d2] dark:bg-[#2a2a2a]">
        <div className="container mx-auto px-4 lg:px-[5rem] py-10 lg:py-20 h-full">
          
          <div className="relative">
            {carouselItems.map((item, index) => (
              <motion.div
                key={index}
                className={`${index === currentSlide ? "block" : "hidden"} flex flex-col lg:flex-row items-center lg:items-start`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="lg:w-1/2 mb-10 lg:mb-0 pt-8">
                  <motion.h1
                    className="text-2xl lg:text-5xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {item.title}
                  </motion.h1>
                  <motion.p
                    className="lg:text-lg text-[#4b774a] dark:text-[#6a9e69] mb-10 text-pretty lg:text-balance w-[90%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {item.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Link
                      to="/products"
                      className="flex lg:inline-flex items-center justify-center px-6 lg:px-12 py-3 bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#e0e0e0] rounded-full hover:bg-opacity-80 transition duration-300"
                    >
                      Shop Now <ArrowRight className="ml-2" />
                    </Link>
                  </motion.div>
                </div>
                <motion.div
                  className="lg:w-1/2 hidden lg:block max-w-[50rem]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="rounded-lg object-cover w-full h-[32rem]"
                  />
                </motion.div>
              </motion.div>
            ))}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 lg:left-[-4rem] transform -translate-y-1/2 bg-[#48392e] dark:bg-[#e0e0e0] opacity-60 text-[#f8f7f2] dark:text-[#1a1a1a] p-1 rounded-full hidden lg:block"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 lg:right-[-4rem] transform -translate-y-1/2 bg-[#48392e] dark:bg-[#e0e0e0] opacity-60 text-[#f8f7f2] dark:text-[#1a1a1a] p-1 rounded-full hidden lg:block"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="py-20 bg-[#f8f7f2] dark:bg-[#1a1a1a]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-12"
          >
            Why Choose Roots to Bloom?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Leaf className="w-12 h-12 text-[#4b774a] dark:text-[#6a9e69]" />}
              title="100% Organic"
              description="Our products are made with certified organic ingredients, ensuring the purest form of nature's goodness."
            />
            <FeatureCard
              icon={<Sun className="w-12 h-12 text-[#d79f63] dark:text-[#b58552]" />}
              title="Eco-Friendly"
              description="We're committed to sustainable practices and eco-friendly packaging to reduce our environmental impact."
            />
            <FeatureCard
              icon={<Droplet className="w-12 h-12 text-[#4b774a] dark:text-[#6a9e69]" />}
              title="Cruelty-Free"
              description="All our products are cruelty-free. We never test on animals and respect all forms of life."
            />
            <FeatureCard
              icon={<Star className="w-12 h-12 text-[#d79f63] dark:text-[#b58552]" />}
              title="Effective Results"
              description="Our formulas are backed by science and proven to deliver visible results for your skin and hair."
            />
          </div>
        </div>
      </motion.section>

      {/* Shop Products Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="py-20 bg-white dark:bg-[#2a2a2a]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-12"
          >
            Shop Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Link to="/products?category=skin" className="block">
                <div className="bg-white dark:bg-[#3a3a3a] rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
                  <img src="/images/products/skin-care.jpg" alt="Skin Care Products" className="w-full h-72 object-contain" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">Skin Care</h3>
                    <p className="text-[#4b774a] dark:text-[#6a9e69]">
                      Discover our range of natural skin care products
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/products?category=hair" className="block">
                <div className="bg-white dark:bg-[#3a3a3a] rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
                  <img src="/images/products/hair-care.webp" alt="Hair Care Products" className="w-full h-72 object-contain" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">Hair Care</h3>
                    <p className="text-[#4b774a] dark:text-[#6a9e69]">
                      Explore our collection of natural hair care solutions
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Promise Section */}
      <OurPromise />

      {/* Featured Products */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="py-20 bg-white dark:bg-[#2a2a2a]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-12"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  image={product.image}
                  sizePrices={product.sizePrices}
                  rating={product.rating}
                />
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-[#f8f7f2] dark:text-[#1a1a1a] rounded-full hover:bg-opacity-80 transition duration-300"
            >
              View All Products <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="py-20 bg-[#f0e6d2] dark:bg-[#2a2a2a]"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-12"
          >
            Latest from Our Blog
          </motion.h2>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogPosts.map((post) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <BlogCard title={post.title} excerpt={post.excerpt} image={post.image} slug={post.slug} />
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#e0e0e0] rounded-full hover:bg-opacity-80 transition duration-300"
            >
              Read More Articles <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-[#4b774a] via-[#d79f63] to-[#4b774a] dark:from-[#3a5a3a] dark:via-[#8f6b42] dark:to-[#3a5a3a]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f8f7f2] mb-6">Stay Connected</h2>
            <p className="text-lg text-[#f8f7f2] mb-8">
              Subscribe to our newsletter for exclusive offers, beauty tips, and new product announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#d79f63] dark:focus:ring-[#b58552] text-[#48392e] dark:text-[#e0e0e0] bg-[#f8f7f2] dark:bg-[#2a2a2a]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#d79f63] dark:bg-[#b58552] text-[#48392e] dark:text-[#e0e0e0] rounded-full hover:bg-opacity-80 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

const FeatureCard: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
}> = ({ icon, title, description }) => {
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
      className="bg-white dark:bg-[#2a2a2a] p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2">{title}</h3>
      <p className="text-[#4b774a] dark:text-[#6a9e69]">{description}</p>
    </motion.div>
  )
}

const BlogCard: React.FC<{
  title: string
  excerpt: string
  image: string
  slug: string
}> = ({ title, excerpt, image, slug }) => {
  return (
    <Link to={`/blog/${slug}`} className="block">
      <div className="bg-white dark:bg-[#3a3a3a] rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl ">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-base lg:text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2 truncate">
            {title}
          </h3>
          <p className="text-[#4b774a] dark:text-[#6a9e69] line-clamp-2 text-ellipsis">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Home


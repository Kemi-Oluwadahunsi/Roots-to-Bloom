import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { blogPosts, type BlogPost } from "../data/blogPosts";
import { Search } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const postsPerPage = 6;
  const loadMoreIncrement = 3;

  const categories = [
    "All",
    ...Array.from(new Set(blogPosts.flatMap((post) => post.categories))),
  ];

  useEffect(() => {
    const filteredPosts = blogPosts.filter(
      (post) =>
        (selectedCategory === "All" ||
          post.categories.includes(selectedCategory)) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
    setVisiblePosts(filteredPosts.slice(0, postsPerPage));
    setPage(1);
  }, [searchTerm, selectedCategory]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredPosts = blogPosts.filter(
        (post) =>
          (selectedCategory === "All" ||
            post.categories.includes(selectedCategory)) &&
          (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      const nextPosts = filteredPosts.slice(
        visiblePosts.length,
        visiblePosts.length + loadMoreIncrement
      );
      setVisiblePosts([...visiblePosts, ...nextPosts]);
      setPage(page + 1);
      setLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] mx-auto px-4 xl:px-[5rem] pb-16 lg:pb-24 lg:pt-16 pt-20"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#48392e] dark:text-[#e0e0e0] mb-8 sm:mb-10 xl:mb-16">
          Roots to Bloom Blog
        </h1>
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="relative w-full lg:w-2/3 xl:w-1/2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-2/3 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d79f63]" />
          </div>
          <div className="relative w-full md:w-1/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        {visiblePosts.length < blogPosts.length && (
          <div className="text-center mt-8">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button
                onClick={loadMore}
                className="bg-[#4b774a] text-white px-6 py-2 rounded-full hover:bg-[#3a6639] transition duration-300"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className=" bg-white dark:bg-[#3a3a3a] rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl"
      >
        <div className="relative">
          <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-32 lg:h-48 object-cover"
          />
        </div>
        <div className="px-3 py-6 xl:p-6">
          <h3 className="text-base lg:text-xl font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-2 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-[#4b774a] dark:text-[#6a9e69] mb-4 line-clamp-2 text-sm lg:text-base">
            {post.excerpt}
          </p>
          <p className="text-sm text-[#d79f63]">
            {new Date(post.date).toLocaleDateString()}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category}
                className="bg-[#f0e6d2] text-[#48392e] px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default Blog;

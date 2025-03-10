import type React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "../data/blogPosts";
import { ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post) {
    return <div>Blog post not found</div>;
  }

  const shareUrl = window.location.href;
  const shareText = `Check out this blog post: ${post.title}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen max-w-[800px] w-full sm:w-[80%] lg:w-full mx-auto bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20 "
    >
      <div className="container mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center text-[#4b774a] hover:text-[#3a6639] mb-8 pl-4"
        >
          <ArrowLeft className="mr-2" />
          Back to Blog
        </Link>
        <article className="rounded-lg shadow-md overflow-hidden dark:bg-opacity-50 text-[#48392e] dark:text-[#e0e0e0]">
          <div className="relative">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className=" w-[90%] sm:w-full h-[14rem] sm:h-[18rem] lg:h-[27rem] xl:h-[30rem] mx-auto object-cover rounded-t-2xl"
            />
            <div className="bg-transparent dark:bg-black/20 absolute inset-0"></div>
          </div>

          <div className="p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold  mb-4">
              {post.title}
            </h1>
            <p className="text-[#d79f63] mb-4">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="bg-[#f0e6d2] text-[#48392e] px-2 py-1 rounded-full text-xs"
                >
                  {category}
                </span>
              ))}
            </div>
            <div
              className="prose prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Share this post</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4b774a] hover:text-[#3a6639]"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(
                    shareText
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4b774a] hover:text-[#3a6639]"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(
                    post.title
                  )}&summary=${encodeURIComponent(post.excerpt)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4b774a] hover:text-[#3a6639]"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogPost;

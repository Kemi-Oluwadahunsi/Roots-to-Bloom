import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";

const Home = React.lazy(() => import("./pages/Home"));
const AboutRtB = React.lazy(() => import("./pages/AboutRtB"));
const Ingredients = React.lazy(() => import("./pages/Ingredients"));
const Products = React.lazy(() => import("./pages/Products"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ThemeProvider>
      <ProductProvider>
        <div className="flex flex-col min-h-screen bg-background dark:bg-[#1a1a1a] dark:text-[#e0e0e0]">
          <Header />
          <main className="flex-grow pt-20">
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutRtB />} />
                  <Route path="/ingredients" element={<Ingredients />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;

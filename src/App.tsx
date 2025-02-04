import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProductProvider } from "./context/ProductContext";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Products = React.lazy(() => import("./pages/Products"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));

function App() {
  return (
    <Router>
      <ProductProvider>
        <div className="flex flex-col min-h-screen bg-[#f8f7f2]">
          <Header />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
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
    </Router>
  );
}

export default App;

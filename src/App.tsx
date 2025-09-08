import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProductProvider } from "./context/ProductContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import ReviewButton from "./components/reviews/ReviewButton";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = React.lazy(() => import("./pages/Home"));
const AboutRtB = React.lazy(() => import("./pages/AboutRtB"));
const Ingredients = React.lazy(() => import("./pages/Ingredients"));
const Products = React.lazy(() => import("./pages/Products"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Login = React.lazy(() => import("./pages/Login"))
const Register = React.lazy(() => import("./pages/Register"))
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"))
const EmailVerification = React.lazy(() => import("./pages/EmailVerification"))
const UserProfile = React.lazy(() => import("./pages/UserProfile"))
const ProductManagement = React.lazy(() => import("./pages/admin/ProductManagement"))
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"))
const CloudinaryImageManagement = React.lazy(() => import("./pages/admin/CloudinaryImageManagement"))
const ImageMigration = React.lazy(() => import("./pages/admin/ImageMigration"))
const ProductCleanup = React.lazy(() => import("./pages/admin/ProductCleanup"))

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ThemeProvider>
      <AuthProvider>
      <ProductProvider>
        <div className="flex flex-col min-h-screen bg-background dark:bg-[#1a1a1a] dark:text-[#e0e0e0] relative">
          <Header />
          <main className="flex-grow pt-10 xl:pt-20">
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
                  <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/email-verification" element={<EmailVerification />} />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <UserProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <ProtectedRoute>
                            <ProductManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/images"
                        element={
                          <ProtectedRoute>
                            <CloudinaryImageManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/migration"
                        element={
                          <ProtectedRoute>
                            <ImageMigration />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/product-cleanup"
                        element={
                          <ProtectedRoute>
                            <ProductCleanup />
                          </ProtectedRoute>
                        }
                      />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          <Footer />
          <ScrollToTop />
          <ReviewButton />
        </div>
      </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

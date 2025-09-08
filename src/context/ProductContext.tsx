"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import { products as initialProducts } from "../data/products";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useProductsSubscription } from "../hooks/useProducts";
import { runMigrationIfNeeded } from "../utils/migrateProducts";
import "../utils/manualMigration"; // Import for manual migration access
import "../utils/migrateImagesToCloudinary"; // Import for image migration access

export interface SizePrice {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  sizePrices: SizePrice[];
  image: string;
  images: string[];
  shopeeLink: string;
  carousellLink: string;
  rating: number;
  calculatedRating?: number;
  reviewCount?: number;
  howToUse: string;
  keyIngredients: string;
  ingredients: string;
  status: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => void;
  getProduct: (id: string) => Product | undefined;
  updateProductRating: (
    productId: string,
    rating: number,
    reviewCount: number
  ) => void;
  fetchProductRating: (
    productId: string
  ) => Promise<{ rating: number; reviewCount: number }>;
  refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFirebase, setUseFirebase] = useState(false);

  // Use Firebase products subscription
  const {
    products: firebaseProducts,
    loading: firebaseLoading,
    error: firebaseError,
    refetch: refetchFirebaseProducts,
  } = useProductsSubscription();

  // Initialize products and run migration if needed
  useEffect(() => {
    const initializeProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if Firebase is properly configured
        if (!import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo-project") {
          console.warn("Firebase not configured, using static products");
          setProducts(initialProducts);
          setUseFirebase(false);
        } else {
          console.log("Firebase configured, running migration...");
          // Run migration if needed
          await runMigrationIfNeeded();
          setUseFirebase(true);
        }
      } catch (err) {
        console.error("Failed to initialize products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        // Fallback to static products
        setProducts(initialProducts);
        setUseFirebase(false);
      } finally {
        setLoading(false);
      }
    };

    initializeProducts();
  }, []);

  // Update products when Firebase data changes
  useEffect(() => {
    if (useFirebase) {
      setProducts(firebaseProducts);
      setLoading(firebaseLoading);
      setError(firebaseError);
    }
  }, [useFirebase, firebaseProducts, firebaseLoading, firebaseError]);

  const addProduct = (product: Product) => {
    if (useFirebase) {
      // If using Firebase, the real-time subscription will handle the update
      console.warn("addProduct called but using Firebase. Use the product service directly.");
    } else {
      setProducts((prevProducts) => [...prevProducts, product]);
    }
  };

  const refetchProducts = async () => {
    if (useFirebase) {
      await refetchFirebaseProducts();
    } else {
      setProducts(initialProducts);
    }
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const updateProductRating = useCallback((
    productId: string,
    rating: number,
    reviewCount: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, calculatedRating: rating, reviewCount: reviewCount }
          : product
      )
    );
  }, []);

  const fetchProductRating = useCallback(async (productId: string) => {
    try {
      // Check if Firebase is properly configured
      if (!import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo-project") {
        console.warn("Firebase not configured, skipping rating fetch for product:", productId);
        return { rating: 0, reviewCount: 0 };
      }

      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);

      let totalRating = 0;
      let reviewCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += data.rating;
        reviewCount++;
      });

      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      // Update the product in state
      updateProductRating(productId, averageRating, reviewCount);

      return { rating: averageRating, reviewCount };
    } catch (error) {
      console.error("Error fetching product rating:", error);
      return { rating: 0, reviewCount: 0 };
    }
  }, [updateProductRating]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        getProduct,
        updateProductRating,
        fetchProductRating,
        refetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

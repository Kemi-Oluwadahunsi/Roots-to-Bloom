// import type React from "react";
// import {
//   createContext,
//   useState,
//   useContext,
//   type ReactNode,
//   useEffect,
// } from "react";
// import { products as initialProducts } from "../data/products";

// export interface SizePrice {
//   size: string;
//   price: number;
// }

// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   subCategory: string;
//   description: string;
//   sizePrices: SizePrice[];
//   image: string;
//   images: string[];
//   howToUse: string;
//   keyIngredients: string;
//   ingredients: string;
//   shopeeLink: string;
//   carousellLink: string;
//   rating: number;
//   status: string;
// }

// interface ProductContextType {
//   products: Product[];
//   addProduct: (product: Product) => void;
//   getProduct: (id: string) => Product | undefined;
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const useProductContext = () => {
//   const context = useContext(ProductContext);
//   if (!context) {
//     throw new Error("useProductContext must be used within a ProductProvider");
//   }
//   return context;
// };

// export const ProductProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     setProducts(initialProducts);
//   }, []);

//   const addProduct = (product: Product) => {
//     setProducts((prevProducts) => [...prevProducts, product]);
//   };

//   const getProduct = (id: string) => {
//     return products.find((product) => product.id === id);
//   };

//   return (
//     <ProductContext.Provider value={{ products, addProduct, getProduct }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };


"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { products as initialProducts } from "../data/products";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

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
  howToUse?: string;
  keyIngredients?: string;
  ingredients?: string;
  status: string;
}

interface ProductContextType {
  products: Product[];
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

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const updateProductRating = (
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
  };

  const fetchProductRating = async (productId: string) => {
    try {
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
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        getProduct,
        updateProductRating,
        fetchProductRating,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

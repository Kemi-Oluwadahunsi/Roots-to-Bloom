import type React from "react";
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { products as initialProducts } from "../data/products";

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
  howToUse: string;
  keyIngredients: string;
  ingredients: string;
  shopeeLink: string;
  carousellLink: string;
  rating: number;
  status: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  getProduct: (id: string) => Product | undefined;
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

  return (
    <ProductContext.Provider value={{ products, addProduct, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

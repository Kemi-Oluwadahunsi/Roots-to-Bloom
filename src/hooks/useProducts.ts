import { useState, useEffect, useCallback } from "react";
import { 
  fetchProducts, 
  fetchProduct, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  subscribeToProducts,
  subscribeToProduct 
} from "../services/productService";
import type { Product } from "../context/ProductContext";

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductMutationsReturn {
  addProduct: (productData: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Hook for managing all products
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  return {
    products,
    loading,
    error,
    refetch: fetchProductsData,
  };
};

// Hook for real-time products subscription
export const useProductsSubscription = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch,
  };
};

// Hook for managing a single product
export const useProduct = (id: string): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const productData = await fetchProduct(id);
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return {
    product,
    loading,
    error,
    refetch: fetchProductData,
  };
};

// Hook for real-time single product subscription
export const useProductSubscription = (id: string): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    const unsubscribe = subscribeToProduct(id, (productData) => {
      setProduct(productData);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [id]);

  const refetch = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const productData = await fetchProduct(id);
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch,
  };
};

// Hook for product mutations (add, update, delete)
export const useProductMutations = (): UseProductMutationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await addProduct(productData);
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      await updateProduct(id, productData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    loading,
    error,
  };
};

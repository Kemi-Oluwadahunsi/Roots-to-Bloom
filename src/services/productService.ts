import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Product } from "../context/ProductContext";

const PRODUCTS_COLLECTION = "products";

import type { FieldValue } from "firebase/firestore";

export interface ProductDocument extends Omit<Product, 'id'> {
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

// Fetch all products from Firestore
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ProductDocument;
      products.push({
        id: doc.id,
        ...data,
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// Fetch a single product by ID
export const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data() as ProductDocument;
      return {
        id: productSnap.id,
        ...data,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

// Add a new product
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docData: ProductDocument = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(productsRef, docData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData: Partial<ProductDocument> = {
      ...productData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

// Subscribe to real-time product updates
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy("name", "asc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ProductDocument;
      products.push({
        id: doc.id,
        ...data,
      });
    });
    callback(products);
  });
};

// Subscribe to a single product updates
export const subscribeToProduct = (id: string, callback: (product: Product | null) => void) => {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  
  return onSnapshot(productRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as ProductDocument;
      callback({
        id: doc.id,
        ...data,
      });
    } else {
      callback(null);
    }
  });
};

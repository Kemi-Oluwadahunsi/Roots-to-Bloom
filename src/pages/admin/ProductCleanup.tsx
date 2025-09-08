import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Product {
  id: string;
  name: string;
  category: string;
  createdAt?: Date;
}

const ProductCleanup: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [duplicates, setDuplicates] = useState<Array<{ name: string; ids: string[] }>>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Product[];
      
      setProducts(productsData);
      findDuplicates(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const findDuplicates = (productsList: Product[]) => {
    const nameMap = new Map<string, string[]>();
    
    productsList.forEach(product => {
      const name = product.name.toLowerCase();
      if (!nameMap.has(name)) {
        nameMap.set(name, []);
      }
      nameMap.get(name)!.push(product.id);
    });

    const duplicateGroups = Array.from(nameMap.entries())
      .filter(([, ids]) => ids.length > 1)
      .map(([name, ids]) => ({ name, ids }));

    setDuplicates(duplicateGroups);
  };

  const removeDuplicates = async () => {
    if (duplicates.length === 0) {
      setMessage('No duplicates found!');
      return;
    }

    if (!confirm(`This will remove ${duplicates.reduce((sum, dup) => sum + dup.ids.length - 1, 0)} duplicate products. Continue?`)) {
      return;
    }

    setProcessing(true);
    setError('');
    setMessage('');

    try {
      const batch = writeBatch(db);
      let removedCount = 0;

      for (const duplicate of duplicates) {
        // Keep the first product (oldest), remove the rest
        const idsToRemove = duplicate.ids.slice(1);
        
        for (const id of idsToRemove) {
          const productRef = doc(db, 'products', id);
          batch.delete(productRef);
          removedCount++;
        }
      }

      await batch.commit();
      setMessage(`Successfully removed ${removedCount} duplicate products!`);
      
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error removing duplicates:', error);
      setError('Failed to remove duplicates');
    } finally {
      setProcessing(false);
    }
  };

  const clearAllProducts = async () => {
    if (!confirm('This will delete ALL products from Firestore. Are you sure?')) {
      return;
    }

    setProcessing(true);
    setError('');
    setMessage('');

    try {
      const batch = writeBatch(db);
      let deletedCount = 0;

      products.forEach(product => {
        const productRef = doc(db, 'products', product.id);
        batch.delete(productRef);
        deletedCount++;
      });

      await batch.commit();
      setMessage(`Successfully deleted ${deletedCount} products!`);
      
      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error clearing products:', error);
      setError('Failed to clear products');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Cleanup</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Duplicate Groups</h3>
              <p className="text-3xl font-bold text-yellow-600">{duplicates.length}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Duplicate Products</h3>
              <p className="text-3xl font-bold text-red-600">
                {duplicates.reduce((sum, dup) => sum + dup.ids.length - 1, 0)}
              </p>
            </div>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={removeDuplicates}
              disabled={processing || duplicates.length === 0}
              className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Removing Duplicates...' : `Remove ${duplicates.reduce((sum, dup) => sum + dup.ids.length - 1, 0)} Duplicates`}
            </button>
            <button
              onClick={clearAllProducts}
              disabled={processing}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Clearing...' : 'Clear All Products'}
            </button>
          </div>
        </div>

        {/* Duplicates List */}
        {duplicates.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Duplicate Products</h2>
            <div className="space-y-4">
              {duplicates.map((duplicate, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{duplicate.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Found {duplicate.ids.length} duplicates (keeping the first one)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {duplicate.ids.map((id, idx) => (
                      <span
                        key={id}
                        className={`px-2 py-1 rounded text-xs ${
                          idx === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {idx === 0 ? 'Keep' : 'Remove'} - {id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCleanup;

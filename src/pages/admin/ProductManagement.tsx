"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react"
import { useProducts, useProductMutations } from "../../hooks/useProducts"
import ProductForm from "../../components/admin/ProductForm"
import type { Product } from "../../context/ProductContext"

const ProductManagement: React.FC = () => {
  const { products, loading, error, refetch } = useProducts()
  const { deleteProduct, loading: mutationLoading } = useProductMutations()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id)
        await refetch()
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const categories = ["all", "hair", "skin"]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b774a] mx-auto mb-4"></div>
          <p className="text-[#48392e] dark:text-[#e0e0e0]">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#4b774a] text-white rounded-md hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8f7f2] dark:bg-[#1a1a1a] py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Product Management
              </h1>
              <p className="text-[#4b774a] dark:text-[#6a9e69]">
                Manage your product catalog ({filteredProducts.length} products)
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300 mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b774a] dark:text-[#6a9e69] w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f7f2] dark:bg-[#3a3a3a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Price Range
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product) => {
                    const lowestPrice = Math.min(...product.sizePrices.map(sp => sp.price))
                    const highestPrice = Math.max(...product.sizePrices.map(sp => sp.price))
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#3a3a3a]">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {product.subCategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#48392e] dark:text-[#e0e0e0]">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#48392e] dark:text-[#e0e0e0]">
                          ${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#48392e] dark:text-[#e0e0e0]">
                          <span className={`font-medium ${
                            (product.stock || 0) > 0 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === "Available" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {product.status}
                            </span>
                            {product.isActive !== false && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/products/${product.id}`, '_blank')}
                              className="p-2 text-[#4b774a] dark:text-[#6a9e69] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              title="View Product"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              disabled={mutationLoading}
                              className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#48392e] dark:text-[#e0e0e0] text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {(showAddForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowAddForm(false)
            setEditingProduct(null)
          }}
          onSuccess={() => {
            refetch()
            setShowAddForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </motion.div>
  )
}

export default ProductManagement

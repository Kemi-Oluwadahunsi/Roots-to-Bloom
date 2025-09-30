"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Save, Plus, Trash2 } from "lucide-react"
import { useProductMutations } from "../../hooks/useProducts"
import { useToast } from "../../hooks/useToast"
import CloudinaryImageUpload from "./CloudinaryImageUpload"
import CloudinaryImageGallery from "./CloudinaryImageGallery"
import type { Product, SizePrice } from "../../context/ProductContext"

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
  onSuccess: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const { addProduct, updateProduct, loading } = useProductMutations()
  const { showSuccess, showError } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    category: "hair",
    subCategory: "",
    description: "",
    image: "",
    images: [] as string[],
    rating: 0,
    howToUse: "",
    keyIngredients: "",
    ingredients: "",
    status: "Available",
    // E-commerce fields
    stock: 100,
    isActive: true,
    tags: [] as string[],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    sku: "",
    brand: "Roots to Bloom",
  })
  const [sizePrices, setSizePrices] = useState<SizePrice[]>([])
  const [newSize, setNewSize] = useState("")
  const [newPrice, setNewPrice] = useState("")
  // const [newImage, setNewImage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        description: product.description,
        image: product.image,
        images: product.images,
        rating: product.rating,
        howToUse: product.howToUse,
        keyIngredients: product.keyIngredients,
        ingredients: product.ingredients,
        status: product.status,
        // E-commerce fields with defaults
        stock: product.stock || 100,
        isActive: product.isActive ?? true,
        tags: product.tags || [],
        weight: product.weight || 0,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        sku: product.sku || "",
        brand: product.brand || "Roots to Bloom",
      })
      setSizePrices(product.sizePrices)
    }
  }, [product])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.subCategory.trim()) newErrors.subCategory = "Sub-category is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.image.trim()) newErrors.image = "Main image is required"
    if (sizePrices.length === 0) newErrors.sizePrices = "At least one size/price is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const productData = {
        ...formData,
        sizePrices,
      }

      if (product) {
        await updateProduct(product.id, productData)
        showSuccess("Product updated successfully!")
      } else {
        await addProduct(productData)
        showSuccess("Product added successfully!")
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
      showError("Failed to save product. Please try again.")
    }
  }

  const addSizePrice = () => {
    if (newSize.trim() && newPrice.trim()) {
      const price = parseFloat(newPrice)
      if (!isNaN(price) && price > 0) {
        setSizePrices([...sizePrices, { size: newSize.trim(), price }])
        setNewSize("")
        setNewPrice("")
      }
    }
  }

  const removeSizePrice = (index: number) => {
    setSizePrices(sizePrices.filter((_, i) => i !== index))
  }

  // Image management functions (for future use)
  // const addImage = () => {
  //   if (newImage.trim()) {
  //     setFormData({ ...formData, images: [...formData.images, newImage.trim()] })
  //     setNewImage("")
  //   }
  // }

  // const removeImage = (index: number) => {
  //   setFormData({ 
  //     ...formData, 
  //     images: formData.images.filter((_, i) => i !== index) 
  //   })
  // }

  const categories = {
    hair: ["butters", "shampoos", "conditioners", "masks", "oils"],
    skin: ["butter creams", "bar soaps", "body scrubs", "lotions", "serums"]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#48392e] dark:text-[#e0e0e0]">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  placeholder="Enter product name"
                />
                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: "" })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                >
                  <option value="hair">Hair</option>
                  <option value="skin">Skin</option>
                </select>
                {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Sub-category *
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                >
                  <option value="">Select sub-category</option>
                  {categories[formData.category as keyof typeof categories]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                {errors.subCategory && <p className="mt-1 text-red-500 text-sm">{errors.subCategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div>
              <CloudinaryImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: "" })}
                label="Main Product Image"
                required
                folder="products"
              />
              {errors.image && <p className="mt-1 text-red-500 text-sm">{errors.image}</p>}
            </div>

            <div>
              <CloudinaryImageGallery
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={5}
                label="Additional Product Images"
                folder="products"
              />
            </div>

            {/* Size Prices */}
            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Sizes & Prices *
              </label>
              <div className="space-y-2">
                {sizePrices.map((sp, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-[#48392e] dark:text-[#e0e0e0] min-w-[100px]">
                      {sp.size}
                    </span>
                    <span className="text-sm text-[#4b774a] dark:text-[#6a9e69] min-w-[80px]">
                      ${sp.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSizePrice(index)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Size (e.g., 100ml)"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  />
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  />
                  <button
                    type="button"
                    onClick={addSizePrice}
                    className="px-3 py-2 bg-[#4b774a] text-white rounded-md hover:bg-opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {errors.sizePrices && <p className="mt-1 text-red-500 text-sm">{errors.sizePrices}</p>}
            </div>

            {/* E-commerce Fields */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-[#48392e] dark:text-[#e0e0e0] mb-4">
                E-commerce Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter SKU (e.g., RTB-SHAMPOO-001)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                    placeholder="Enter weight in kg"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Length</label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="Length"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="Width"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height</label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        dimensions: { ...formData.dimensions, height: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                      placeholder="Height"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  placeholder="e.g., hair, growth, natural, organic"
                />
              </div>

              <div className="mt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#4b774a] bg-gray-100 border-gray-300 rounded focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
                    Product is active and available for sale
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                How to Use
              </label>
              <textarea
                value={formData.howToUse}
                onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                placeholder="Enter usage instructions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Key Ingredients
              </label>
              <input
                type="text"
                value={formData.keyIngredients}
                onChange={(e) => setFormData({ ...formData, keyIngredients: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                placeholder="Enter key ingredients"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                Full Ingredients List
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                placeholder="Enter full ingredients list"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-[#48392e] dark:text-[#e0e0e0] rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-white rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {product ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductForm

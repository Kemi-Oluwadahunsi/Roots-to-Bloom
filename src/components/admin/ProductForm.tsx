"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Save, Plus, Trash2 } from "lucide-react"
import { useProductMutations } from "../../hooks/useProducts"
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
  const [formData, setFormData] = useState({
    name: "",
    category: "hair",
    subCategory: "",
    description: "",
    image: "",
    images: [] as string[],
    shopeeLink: "",
    carousellLink: "",
    rating: 0,
    howToUse: "",
    keyIngredients: "",
    ingredients: "",
    status: "Available",
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
        shopeeLink: product.shopeeLink,
        carousellLink: product.carousellLink,
        rating: product.rating,
        howToUse: product.howToUse,
        keyIngredients: product.keyIngredients,
        ingredients: product.ingredients,
        status: product.status,
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
      } else {
        await addProduct(productData)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to save product:", error)
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

            {/* Additional fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Shopee Link
                </label>
                <input
                  type="url"
                  value={formData.shopeeLink}
                  onChange={(e) => setFormData({ ...formData, shopeeLink: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  placeholder="Enter Shopee link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0] mb-2">
                  Carousell Link
                </label>
                <input
                  type="url"
                  value={formData.carousellLink}
                  onChange={(e) => setFormData({ ...formData, carousellLink: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69]"
                  placeholder="Enter Carousell link"
                />
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

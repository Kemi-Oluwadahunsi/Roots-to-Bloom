"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Trash2, RefreshCw, ExternalLink, Loader2, Cloud } from "lucide-react"
import { 
  uploadImageToCloudinary, 
  uploadMultipleImagesToCloudinary,
  validateImageFile, 
  formatFileSize,
  getOptimizedImageUrl
} from "../../services/cloudinaryService"

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

const CloudinaryImageManagement: React.FC = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  const handleFileUpload = async (file: File) => {
    setError("")
    setMessage("")
    
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setUploading(true)
    setUploadingFiles(prev => [...prev, file.name])
    
    try {
      const result = await uploadImageToCloudinary(file, "products")
      setImages(prev => [result, ...prev])
      setMessage(`Image "${file.name}" uploaded successfully!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadingFiles(prev => prev.filter(name => name !== file.name))
    }
  }

  const handleMultipleFileUpload = async (files: FileList) => {
    setError("")
    setMessage("")
    
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    
    // Validate all files
    for (const file of fileArray) {
      const validation = validateImageFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        setError(`${file.name}: ${validation.error}`)
        return
      }
    }

    setUploading(true)
    setUploadingFiles(validFiles.map(f => f.name))
    
    try {
      const results = await uploadMultipleImagesToCloudinary(validFiles, "products")
      setImages(prev => [...results, ...prev])
      setMessage(`${validFiles.length} images uploaded successfully!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadingFiles([])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      if (files.length === 1) {
        handleFileUpload(files[0])
      } else {
        handleMultipleFileUpload(files)
      }
    }
  }

  const handleDeleteImage = (_publicId: string, imageName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${imageName}"? This action cannot be undone.`)) {
      return
    }

    // Note: For deletion, you'll need to implement a backend endpoint
    // since Cloudinary requires API secret for deletion
    setError("Image deletion requires backend implementation. Contact your developer.")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank')
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
              <h1 className="text-3xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-2 flex items-center">
                <Cloud className="w-8 h-8 mr-3 text-blue-500" />
                Cloudinary Image Management
              </h1>
              <p className="text-[#4b774a] dark:text-[#6a9e69]">
                Manage product images stored in Cloudinary cloud storage
              </p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => setImages([])}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-opacity-90 transition duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear List
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Images to Cloudinary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4b774a] dark:focus:ring-[#6a9e69] disabled:opacity-50"
                />
                {uploading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4b774a]"></div>
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supported formats: JPEG, PNG, WebP, GIF. Maximum size: 10MB per image. 
                Images are automatically optimized and stored in Cloudinary cloud.
              </p>
            </div>
          </div>

          {/* Uploading Files */}
          {uploadingFiles.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Uploading Files ({uploadingFiles.length})
              </h3>
              <div className="space-y-2">
                {uploadingFiles.map((fileName, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-4">
              Uploaded Images ({images.length})
            </h2>
            
            {images.length === 0 ? (
              <div className="text-center py-12">
                <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-[#48392e] dark:text-[#e0e0e0] text-lg">
                  No images uploaded yet
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload images to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(image.public_id, { width: 200, height: 200, crop: 'fill' })}
                        alt={image.public_id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-[#48392e] dark:text-[#e0e0e0] truncate">
                        {image.public_id.split('/').pop()}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Size: {formatFileSize(image.bytes)}</p>
                        <p>Format: {image.format.toUpperCase()}</p>
                        <p>Dimensions: {image.width}×{image.height}</p>
                        <p>Created: {formatDate(image.created_at)}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openImageInNewTab(image.secure_url)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.public_id, image.public_id.split('/').pop() || 'image')}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Cloudinary Cloud Storage
            </h3>
            <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <p>• Images are stored securely in Cloudinary's cloud infrastructure</p>
              <p>• Automatic optimization and responsive delivery</p>
              <p>• Global CDN for fast loading worldwide</p>
              <p>• Images are accessible from anywhere and won't be lost</p>
              <p>• Professional-grade image management and transformation</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CloudinaryImageManagement

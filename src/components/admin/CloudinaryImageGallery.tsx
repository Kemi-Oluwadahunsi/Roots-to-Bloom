"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { 
  uploadImageToCloudinary, 
  uploadMultipleImagesToCloudinary,
  validateImageFile, 
} from "../../services/cloudinaryService"

interface CloudinaryImageGalleryProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  label?: string
  folder?: string
}

const CloudinaryImageGallery: React.FC<CloudinaryImageGalleryProps> = ({
  images,
  onChange,
  maxImages = 10,
  label = "Product Images",
  folder = "products"
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  const handleFileUpload = async (file: File) => {
    setError("")
    
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)
    setUploadingFiles(prev => [...prev, file.name])
    
    try {
      const result = await uploadImageToCloudinary(file, folder)
      onChange([...images, result.secure_url])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      setUploadingFiles(prev => prev.filter(name => name !== file.name))
    }
  }

  const handleMultipleFileUpload = async (files: FileList) => {
    setError("")
    
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

    if (images.length + validFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You're trying to add ${validFiles.length} more.`)
      return
    }

    setIsUploading(true)
    setUploadingFiles(validFiles.map(f => f.name))
    
    try {
      const results = await uploadMultipleImagesToCloudinary(validFiles, folder)
      const newUrls = results.map(result => result.secure_url)
      onChange([...images, ...newUrls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
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

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
          {label} ({images.length}/{maxImages})
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-500 dark:text-blue-400">✨ Cloudinary</span>
        </div>
      </div>

      {/* Current Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                <button
                  type="button"
                  onClick={() => openImageInNewTab(image)}
                  className="p-1 bg-blue-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="View full size"
                >
                  <ExternalLink className="w-3 h-3 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Uploading Placeholders */}
        {uploadingFiles.map((fileName, index) => (
          <motion.div
            key={`uploading-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4b774a] mx-auto"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate px-2">
                {fileName}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Add Image Button */}
        {images.length + uploadingFiles.length < maxImages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-[#4b774a] dark:hover:border-[#6a9e69] transition-colors cursor-pointer"
            onClick={() => document.getElementById('cloudinary-gallery-file-input')?.click()}
          >
            {isUploading ? (
              <div className="text-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#4b774a] animate-spin mx-auto" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Plus className="w-6 h-6 text-gray-400 mx-auto" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Add Image</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        id="cloudinary-gallery-file-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Images are automatically optimized and stored in Cloudinary</p>
        <p>• Supported formats: JPEG, PNG, WebP, GIF (up to 10MB each)</p>
        <p>• Images are accessible from anywhere and won't be lost</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}

export default CloudinaryImageGallery

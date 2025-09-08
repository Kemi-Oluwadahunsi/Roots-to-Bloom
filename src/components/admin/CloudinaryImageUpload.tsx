"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Image as ImageIcon, Trash2, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { 
  uploadImageToCloudinary, 
  validateImageFile, 
  getImageDimensions,
  formatFileSize,
} from "../../services/cloudinaryService"

interface CloudinaryImageUploadProps {
  value: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  required?: boolean
  className?: string
  folder?: string
}

const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Image",
  required = false,
  className = "",
  folder = "products"
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size: string } | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError("")
    
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Get image dimensions
      const dimensions = await getImageDimensions(file)
      setImageInfo({
        width: dimensions.width,
        height: dimensions.height,
        size: formatFileSize(file.size)
      })

      // Simulate progress (Cloudinary doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploadImageToCloudinary(file, folder)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Use the secure URL from Cloudinary
      onChange(result.secure_url)
      
      // Update image info with Cloudinary data
      setImageInfo({
        width: result.width,
        height: result.height,
        size: formatFileSize(result.bytes)
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemoveImage = () => {
    if (value && onRemove) {
      onRemove()
      setImageInfo(null)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openImageInNewTab = () => {
    if (value) {
      window.open(value, '_blank')
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-[#48392e] dark:text-[#e0e0e0]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="Change image"
                >
                  <Upload className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={openImageInNewTab}
                  className="p-2 bg-blue-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="View full size"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <Check className="w-4 h-4 mr-1" />
              Image uploaded to Cloudinary
            </div>
            {imageInfo && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {imageInfo.width}×{imageInfo.height} • {imageInfo.size}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive
              ? "border-[#4b774a] bg-[#4b774a] bg-opacity-10"
              : "border-gray-300 dark:border-gray-600 hover:border-[#4b774a] dark:hover:border-[#6a9e69]"
          } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b774a] mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-[#4b774a] animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#48392e] dark:text-[#e0e0e0]">Uploading to Cloudinary...</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#4b774a] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-[#48392e] dark:text-[#e0e0e0]">
                  <span className="font-medium text-[#4b774a] dark:text-[#6a9e69]">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPEG, PNG, WebP, GIF up to 10MB
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  ✨ Powered by Cloudinary
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

export default CloudinaryImageUpload

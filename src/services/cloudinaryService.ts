export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

// Get Cloudinary configuration from environment variables
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  return {
    cloudName,
    uploadPreset,
    apiKey
  };
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File, folder?: string): Promise<CloudinaryUploadResult> => {
  try {
    const config = getCloudinaryConfig();
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // Note: Transformations are not allowed with unsigned uploads
    // Images will be optimized by Cloudinary's auto-optimization features
    formData.append('resource_type', 'image');
    
    // Add optimization parameters that are allowed with unsigned uploads
    formData.append('tags', 'product,optimized');
    formData.append('context', 'alt=Product Image');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImagesToCloudinary = async (
  files: File[], 
  folder?: string
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload images');
  }
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const config = getCloudinaryConfig();
    
    if (!config.apiKey) {
      throw new Error('API key is required for deletion');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(publicId, timestamp, config.apiKey);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          timestamp: timestamp,
          signature: signature,
          api_key: config.apiKey
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Delete failed');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

// Generate signature for authenticated requests (you'll need to implement this on your backend)
const generateSignature = async (publicId: string, timestamp: number, apiKey: string): Promise<string> => {
  // For now, we'll use a simple approach. In production, you should generate this on your backend
  // to keep your API secret secure
  const message = `public_id=${publicId}&timestamp=${timestamp}`;
  
  // This is a placeholder - you should implement proper signature generation
  // using your Cloudinary API secret on the backend
  return btoa(message + apiKey);
};

// Get optimized image URL with transformations
export const getOptimizedImageUrl = (
  publicId: string, 
  transformations?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  }
): string => {
  const config = getCloudinaryConfig();
  
  let url = `https://res.cloudinary.com/${config.cloudName}/image/upload/`;
  
  if (transformations) {
    const { width, height, quality = 'auto', format = 'auto', crop = 'scale' } = transformations;
    const transformString = [
      `w_${width}`,
      height ? `h_${height}` : '',
      `c_${crop}`,
      `q_${quality}`,
      `f_${format}`
    ].filter(Boolean).join(',');
    
    url += `${transformString}/`;
  } else {
    // Default transformations: width 1000px, no height constraint, maintain aspect ratio
    url += 'f_auto,q_auto,w_1000,c_scale/';
  }
  
  url += publicId;
  
  return url;
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB (Cloudinary's limit)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)"
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 10MB"
    };
  }
  
  return { valid: true };
};

// Get image dimensions from file
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = URL.createObjectURL(file);
  });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

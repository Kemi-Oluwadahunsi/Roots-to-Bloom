import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata 
} from "firebase/storage";
import { storage } from "../firebase/config";

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

export interface ImageMetadata {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

// Upload a single image file
export const uploadImage = async (
  file: File, 
  folder: string = "products"
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const imageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: fileName
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[], 
  folder: string = "products"
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload images");
  }
};

// Delete an image
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

// Get all images in a folder
export const getImagesInFolder = async (folder: string = "products"): Promise<ImageMetadata[]> => {
  try {
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);
    
    const imagePromises = result.items.map(async (itemRef) => {
      const metadata = await getMetadata(itemRef);
      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType || 'image/jpeg',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };
    });

    return await Promise.all(imagePromises);
  } catch (error) {
    console.error("Error getting images:", error);
    throw new Error("Failed to get images");
  }
};

// Convert existing product images to Firebase Storage
export const migrateProductImages = async (): Promise<void> => {
  try {
    console.log("Starting image migration to Firebase Storage...");
    
    // Get all product images from the static data
    const { products } = await import("../data/products");
    
    for (const product of products) {
      try {
        // Download the image from the current URL
        const response = await fetch(product.image);
        if (!response.ok) {
          console.warn(`Failed to fetch image for ${product.name}: ${response.statusText}`);
          continue;
        }
        
        const blob = await response.blob();
        
        // Create a file from the blob
        const fileName = `${product.id}_${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.webp`;
        const file = new File([blob], fileName, { type: blob.type });
        
        // Upload to Firebase Storage
        const uploadResult = await uploadImage(file, "products");
        
        console.log(`✅ Migrated image for ${product.name}: ${uploadResult.url}`);
        
        // Add a small delay to avoid overwhelming the service
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Failed to migrate image for ${product.name}:`, error);
      }
    }
    
    console.log("🎉 Image migration completed!");
  } catch (error) {
    console.error("❌ Image migration failed:", error);
    throw error;
  }
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (JPEG, PNG, or WebP)"
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 5MB"
    };
  }
  
  return { valid: true };
};

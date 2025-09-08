import { uploadImageToCloudinary, getCloudinaryConfig } from "../services/cloudinaryService";
import { fetchProducts, updateProduct } from "../services/productService";
import { products as staticProducts } from "../data/products";

interface ImageMigrationResult {
  productId: string;
  productName: string;
  mainImage: {
    oldPath: string;
    newUrl: string;
    success: boolean;
    error?: string;
  };
  additionalImages: Array<{
    oldPath: string;
    newUrl: string;
    success: boolean;
    error?: string;
  }>;
}

// Helper function to fetch image from local path
const fetchImageFromPath = async (imagePath: string): Promise<File | null> => {
  try {
    // Convert local path to actual file path
    const fullPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Try to fetch the image
    const response = await fetch(fullPath);
    if (!response.ok) {
      console.warn(`Could not fetch image: ${imagePath}`);
      return null;
    }
    
    const blob = await response.blob();
    const fileName = imagePath.split('/').pop() || 'image';
    
    // Create a File object from the blob
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.error(`Error fetching image ${imagePath}:`, error);
    return null;
  }
};

// Upload a single image to Cloudinary
const uploadImageToCloudinaryWithRetry = async (
  imagePath: string, 
  productName: string,
  retries: number = 3
): Promise<{ url: string; error?: string }> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempting to upload ${imagePath} (attempt ${attempt}/${retries})`);
      
      const imageFile = await fetchImageFromPath(imagePath);
      if (!imageFile) {
        return { url: '', error: `Could not fetch image file: ${imagePath}` };
      }
      
      const result = await uploadImageToCloudinary(imageFile, "products");
      console.log(`✅ Successfully uploaded: ${imagePath} → ${result.secure_url}`);
      
      return { url: result.secure_url };
    } catch (error) {
      console.error(`❌ Upload attempt ${attempt} failed for ${imagePath}:`, error);
      
      if (attempt === retries) {
        return { 
          url: '', 
          error: `Failed after ${retries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return { url: '', error: 'Max retries exceeded' };
};

// Migrate images for a single product
const migrateProductImages = async (product: any): Promise<ImageMigrationResult> => {
  const result: ImageMigrationResult = {
    productId: product.id,
    productName: product.name,
    mainImage: {
      oldPath: product.image,
      newUrl: '',
      success: false
    },
    additionalImages: []
  };

  console.log(`\n🔄 Migrating images for: ${product.name}`);

  // Migrate main image
  if (product.image) {
    const mainImageResult = await uploadImageToCloudinaryWithRetry(
      product.image, 
      product.name
    );
    
    result.mainImage = {
      oldPath: product.image,
      newUrl: mainImageResult.url,
      success: !!mainImageResult.url,
      error: mainImageResult.error
    };
  }

  // Migrate additional images
  if (product.images && Array.isArray(product.images)) {
    for (const imagePath of product.images) {
      const additionalImageResult = await uploadImageToCloudinaryWithRetry(
        imagePath, 
        product.name
      );
      
      result.additionalImages.push({
        oldPath: imagePath,
        newUrl: additionalImageResult.url,
        success: !!additionalImageResult.url,
        error: additionalImageResult.error
      });
    }
  }

  return result;
};

// Update product in Firebase with new Cloudinary URLs
const updateProductInFirebase = async (
  productId: string, 
  migrationResult: ImageMigrationResult
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    // Update main image if successful
    if (migrationResult.mainImage.success) {
      updateData.image = migrationResult.mainImage.newUrl;
    }
    
    // Update additional images if any were successful
    const successfulAdditionalImages = migrationResult.additionalImages
      .filter(img => img.success)
      .map(img => img.newUrl);
    
    if (successfulAdditionalImages.length > 0) {
      updateData.images = successfulAdditionalImages;
    }
    
    // Only update if we have something to update
    if (Object.keys(updateData).length > 0) {
      await updateProduct(productId, updateData);
      console.log(`✅ Updated Firebase record for: ${migrationResult.productName}`);
      return true;
    } else {
      console.log(`⚠️ No successful image uploads for: ${migrationResult.productName}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Failed to update Firebase for ${migrationResult.productName}:`, error);
    return false;
  }
};

// Main migration function
export const migrateImagesToCloudinary = async (): Promise<void> => {
  try {
    console.log("🚀 Starting image migration to Cloudinary...");
    
    // Check Cloudinary configuration
    try {
      getCloudinaryConfig();
      console.log("✅ Cloudinary configuration verified");
    } catch (error) {
      throw new Error(`Cloudinary configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get products from Firebase
    console.log("📦 Fetching products from Firebase...");
    const firebaseProducts = await fetchProducts();
    
    if (firebaseProducts.length === 0) {
      console.log("⚠️ No products found in Firebase. Please add products to Firebase first using the Product Management tool.");
      console.log("Migration requires products to exist in Firebase to avoid duplicates.");
      return;
    }

    console.log(`📦 Found ${firebaseProducts.length} products in Firebase`);

    const migrationResults: ImageMigrationResult[] = [];
    const processedProductIds = new Set<string>();
    let successCount = 0;
    let failureCount = 0;

    // Filter out products that already have Cloudinary URLs
    const productsToMigrate = firebaseProducts.filter(product => {
      const hasCloudinaryImage = product.image && product.image.includes('cloudinary.com');
      const hasCloudinaryImages = product.images && product.images.some((img: any) => 
        typeof img === 'string' && img.includes('cloudinary.com')
      );
      
      return !hasCloudinaryImage && !hasCloudinaryImages;
    });

    console.log(`📦 Found ${productsToMigrate.length} products that need migration (${firebaseProducts.length - productsToMigrate.length} already migrated)`);

    if (productsToMigrate.length === 0) {
      console.log("✅ All products are already migrated!");
      return;
    }

    // Migrate each product
    for (const product of productsToMigrate) {
      // Skip if already processed in this run
      if (processedProductIds.has(product.id)) {
        console.log(`⏭️ Skipping ${product.name} - already processed in this run`);
        continue;
      }
      
      processedProductIds.add(product.id);
      
      try {
        const result = await migrateProductImages(product);
        migrationResults.push(result);

        // Update Firebase if any images were successfully uploaded
        const hasSuccessfulUploads = result.mainImage.success || 
          result.additionalImages.some(img => img.success);
        
        if (hasSuccessfulUploads) {
          const firebaseUpdated = await updateProductInFirebase(product.id, result);
          if (firebaseUpdated) {
            successCount++;
          } else {
            failureCount++;
          }
        } else {
          failureCount++;
        }

        // Add delay between products to avoid overwhelming Cloudinary
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to migrate product ${product.name}:`, error);
        failureCount++;
      }
    }

    // Print summary
    console.log("\n🎉 Migration completed!");
    console.log(`✅ Successfully migrated: ${successCount} products`);
    console.log(`❌ Failed to migrate: ${failureCount} products`);
    
    console.log("\n📊 Detailed Results:");
    migrationResults.forEach(result => {
      console.log(`\n${result.productName}:`);
      console.log(`  Main Image: ${result.mainImage.success ? '✅' : '❌'} ${result.mainImage.oldPath}`);
      if (result.mainImage.error) {
        console.log(`    Error: ${result.mainImage.error}`);
      }
      if (result.additionalImages.length > 0) {
        result.additionalImages.forEach((img, index) => {
          console.log(`  Additional ${index + 1}: ${img.success ? '✅' : '❌'} ${img.oldPath}`);
          if (img.error) {
            console.log(`    Error: ${img.error}`);
          }
        });
      }
    });

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Function to check migration status
export const checkImageMigrationStatus = async (): Promise<void> => {
  try {
    console.log("🔍 Checking image migration status...");
    
    const products = await fetchProducts();
    let cloudinaryCount = 0;
    let localCount = 0;
    
    products.forEach(product => {
      if (product.image?.includes('cloudinary.com')) {
        cloudinaryCount++;
      } else if (product.image?.startsWith('/images/')) {
        localCount++;
      }
    });
    
    console.log(`📊 Migration Status:`);
    console.log(`  Total products: ${products.length}`);
    console.log(`  Using Cloudinary: ${cloudinaryCount}`);
    console.log(`  Using local images: ${localCount}`);
    console.log(`  Migration progress: ${((cloudinaryCount / products.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error("❌ Failed to check migration status:", error);
  }
};

// Manual trigger function for console
export const triggerImageMigration = async (): Promise<void> => {
  try {
    console.log("🚀 Manual image migration triggered...");
    await migrateImagesToCloudinary();
  } catch (error) {
    console.error("❌ Manual migration failed:", error);
  }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  (window as any).triggerImageMigration = triggerImageMigration;
  (window as any).checkImageMigrationStatus = checkImageMigrationStatus;
  (window as any).migrateImagesToCloudinary = migrateImagesToCloudinary;
}

import { products as staticProducts } from "../data/products";
import { addProduct } from "../services/productService";

// Migration script to move static products to Firebase
export const migrateProductsToFirebase = async (): Promise<void> => {
  try {
    console.log("Starting product migration to Firebase...");
    
    // Get existing products from Firebase
    const { fetchProducts } = await import("../services/productService");
    const existingProducts = await fetchProducts();
    const existingProductNames = new Set(existingProducts.map(p => p.name.toLowerCase()));
    
    console.log(`Found ${existingProducts.length} existing products in Firebase`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const product of staticProducts) {
      try {
        // Check if product already exists by name
        if (existingProductNames.has(product.name.toLowerCase())) {
          console.log(`⏭️ Skipping ${product.name} - already exists in Firebase`);
          skippedCount++;
          continue;
        }
        
        // Remove the id from the product data as Firebase will generate it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...productData } = product;
        
        // Add product to Firebase
        const newId = await addProduct(productData);
        console.log(`✅ Migrated product: ${product.name} (ID: ${newId})`);
        migratedCount++;
        
        // Add a small delay to avoid overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to migrate product: ${product.name}`, error);
      }
    }
    
    console.log(`🎉 Product migration completed! Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Function to check if products exist in Firebase
export const checkProductsInFirebase = async (): Promise<boolean> => {
  try {
    const { fetchProducts } = await import("../services/productService");
    const products = await fetchProducts();
    return products.length > 0;
  } catch (error) {
    console.error("Error checking products in Firebase:", error);
    return false;
  }
};

// Function to run migration only if needed
export const runMigrationIfNeeded = async (): Promise<void> => {
  try {
    const hasProducts = await checkProductsInFirebase();
    
    if (!hasProducts) {
      console.log("No products found in Firebase. Starting migration...");
      await migrateProductsToFirebase();
    } else {
      console.log("Products already exist in Firebase. Skipping migration.");
    }
  } catch (error) {
    console.error("Migration check failed:", error);
    throw error;
  }
};

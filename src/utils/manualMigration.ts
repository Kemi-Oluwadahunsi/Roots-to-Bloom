import { migrateProductsToFirebase } from "./migrateProducts";

// Manual migration trigger for testing
export const triggerMigration = async () => {
  try {
    console.log("🚀 Starting manual product migration...");
    await migrateProductsToFirebase();
    console.log("✅ Manual migration completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Manual migration failed:", error);
    return false;
  }
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).triggerMigration = triggerMigration;
}

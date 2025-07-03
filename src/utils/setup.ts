import ApiService from "@/services/api";

export async function initializeCEOAccount(): Promise<boolean> {
  try {
    // Try to setup CEO account (will fail if already exists)
    await ApiService.setupCEO();
    console.log("✅ CEO account created successfully");
    return true;
  } catch (error: any) {
    // Check if it's because the account already exists
    if (
      error.message.includes("already exists") ||
      error.message.includes("CEO account already exists")
    ) {
      console.log("ℹ️ CEO account already exists - this is normal");
      return true;
    }

    // Check if it's a network/API error
    if (
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch")
    ) {
      console.warn(
        "⚠️ Backend API not available - running in development mode",
      );
      console.log(
        "📝 You can manually create the CEO account later via the API",
      );
      return false;
    }

    console.error("❌ Failed to create CEO account:", error.message);
    console.log("💡 This may be normal if running without a backend server");
    return false;
  }
}

// Auto-run CEO setup when module is imported, but don't block the app
initializeCEOAccount().catch(() => {
  // Silently fail - app should still work in development mode
});

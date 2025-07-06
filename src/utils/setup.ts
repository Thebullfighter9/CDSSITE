import ApiService from "@/services/api";

export async function initializeCEOAccount(): Promise<boolean> {
  // Skip API calls if in development mode or using dev token
  const isDev =
    localStorage.getItem("cds_token") === "dev-token" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isDev) {
    return false;
  }

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

    // Silently fail in development mode
    return false;
  }
}

// Try to initialize but don't block the app if it fails
setTimeout(() => {
  initializeCEOAccount().catch(() => {
    // Silently fail - app should still work in development mode
  });
}, 1000); // Delay to avoid blocking initial render

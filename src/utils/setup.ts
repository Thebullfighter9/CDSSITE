import ApiService from "@/services/api";

export async function initializeCEOAccount(): Promise<boolean> {
  try {
    // Try to setup CEO account (will fail if already exists)
    await ApiService.setupCEO();
    console.log("CEO account created successfully");
    return true;
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("CEO account already exists");
      return true;
    }
    console.error("Failed to create CEO account:", error);
    return false;
  }
}

// Auto-run CEO setup when module is imported
initializeCEOAccount();

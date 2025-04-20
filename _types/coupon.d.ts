export interface Coupon {
    code: string;
    documentId: string;
    discount: number; // Discount amount (fixed or percentage)
    isPercentage: boolean; // True if discount is a percentage, false if fixed
    isValid: boolean; // True if coupon is valid (not expired or disabled)
    minOrderAmount?: number; // Minimum order amount to apply coupon
    startDate: string; // ISO 8601 date (e.g., "2025-04-01T00:00:00.000Z")
    expireDate: string; // ISO 8601 date (e.g., "2025-12-31T23:59:59.999Z")
    maxUsage: number; // Maximum total uses allowed (e.g., 100)
    usedCount: number; // Current number of uses
    oneTimePerUser: boolean; // True if limited to one use per user
    multiUse: boolean; // True if coupon can be used multiple times in one order
    userUsage?: { [email: string]: number }; // Tracks usage per user (optional, requires backend)
  }
/**
 * =================================================================
 * DATABASE CONSTANTS
 * =================================================================
 */
export const DB_NAME_DEV = "shopflow_dev";
export const DB_NAME_PROD = "shopflow_prod";

/**
 * =================================================================
 * USER CONSTANTS
 * =================================================================
 */
export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};
// Derived array from the enum for use in Mongoose schemas
export const AVAILABLE_USER_ROLES = Object.values(UserRolesEnum);

export const DEFAULT_USER_AVATAR = "https://via.placeholder.com/150";

/**
 * =================================================================
 * ORDER & PRODUCT CONSTANTS
 * =================================================================
 */
export const OrderStatusEnum = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
};
export const AVAILABLE_ORDER_STATUSES = Object.values(OrderStatusEnum);

export const ProductStatusEnum = {
    DRAFT: "draft",
    AVAILABLE: "available",
    OUT_OF_STOCK: "out_of_stock",
    DISCONTINUED: "discontinued",
};
export const AVAILABLE_PRODUCT_STATUSES = Object.values(ProductStatusEnum);

/**
 * =================================================================
 * TOKEN & COOKIE CONSTANTS
 * =================================================================
 */

// Base cookie options for security
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

// JWT `expiresIn` strings
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "10d";

// Cookie `maxAge` in milliseconds for browser
export const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRY_MS = 10 * 24 * 60 * 60 * 1000; // 10 days
export const FORGOT_PASSWORD_OTP_EXPIRY_MS = 20 * 60 * 1000; // 20 minutes
export const EMAIL_VERIFICATION_OTP_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * =================================================================
 * API & OTHER CONSTANTS
 * =================================================================
 */
export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

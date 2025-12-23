// Database Constants
export const DB_NAME = "ecommerce_db";

// User Constants
export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
};

export const DEFAULT_USER_AVATAR =
    "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png";

// Order Status Constants
export const OrderStatusEnum = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
};
export const AVAILABLE_ORDER_STATUSES = Object.values(OrderStatusEnum);

// Product Status Constants
export const ProductStatusEnum = {
    DRAFT: "draft",
    AVAILABLE: "available",
    OUT_OF_STOCK: "out_of_stock",
    DISCONTINUED: "discontinued",
};
export const AVAILABLE_PRODUCT_STATUSES = Object.values(ProductStatusEnum);

// Cookie Options
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // In production, secure will be true
    sameSite: "lax",
};

// Token Constants
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "10d";
export const FORGOT_PASSWORD_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

// Other Constants
export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

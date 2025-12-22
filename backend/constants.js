export const DB_CONSTANTS = {
    DB_NAME: "ecommerce_db", // Or whatever your DB name is

    // Default User Settings
    DEFAULT_USER_ROLE: "USER",
    DEFAULT_USER_AVATAR:
        "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png",

    // Token Expiries
    ACCESS_TOKEN_EXPIRY: "15m",
    REFRESH_TOKEN_EXPIRY: "10d",

    // Pagination Limits
    PAGE_LIMIT: 10,

    // File Upload Limits (if using Multer later)
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB

    // Business Logic
    TAX_RATE: 0.18,
    SHIPPING_FEE: 10,
};

export const UserRoles = {
    ADMIN: "ADMIN",
    USER: "USER",
};

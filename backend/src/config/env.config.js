import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "DEVELOPMENT",
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME_DEV: process.env.DB_NAME_DEV,
    DB_NAME_PROD: process.env.DB_NAME_PROD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CORS_ORIGIN_DEV: process.env.CORS_ORIGIN_DEV || "http://localhost:5173",
    CORS_ORIGIN_PROD:
        process.env.CORS_ORIGIN_PROD ||
        "https://shopflow-buildwithsonu.vercel.app",
};

if (!ENV.MONGO_URI) {
    throw new Error(
        "❌ MONGO_URI is required but not defined in environment variables"
    );
}

if (!ENV.ACCESS_TOKEN_SECRET && !ENV.REFRESH_TOKEN_SECRET) {
    throw new Error(
        "❌ ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET are required but not defined in environment variables"
    );
}

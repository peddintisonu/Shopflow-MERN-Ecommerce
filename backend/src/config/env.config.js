import dotenv from "dotenv";
import path from "path";

const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

dotenv.config({
    path: path.resolve(process.cwd(), envFile),
    quiet: true,
});

export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "DEVELOPMENT",
    MONGO_URI: process.env.MONGO_URI,
    DB_NAME: process.env.DB_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    BREVO_API_KEY: process.env.BREVO_API_KEY,
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

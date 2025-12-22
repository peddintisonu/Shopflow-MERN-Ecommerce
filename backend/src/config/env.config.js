import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "DEVELOPMENT",
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
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

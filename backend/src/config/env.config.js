import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "DEVELOPMENT",
    MONGO_URI: process.env.MONGO_URI,
};

if (!ENV.MONGO_URI) {
    throw new Error(
        "❌ MONGO_URI is required but not defined in environment variables"
    );
}

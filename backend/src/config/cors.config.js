import { ApiError } from "../utils/ApiError.js";
import { ENV } from "./env.config.js";

const allowedOrigins = [ENV.CORS_ORIGIN_DEV, ENV.CORS_ORIGIN_PROD];

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            // If the origin is in our whitelist (or if it's not present), allow it.
            callback(null, true);
        } else {
            // If the origin is not in the whitelist, reject it.
            callback(new ApiError(403, "Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies to be sent with requests
};

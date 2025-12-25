import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

// This will be applied to sensitive endpoints that send emails or check passwords
export const authRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 15, // Limit each IP to 15 requests per window
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 15 minutes",
    },
    handler: (req, res, next, options) => {
        // We throw our custom ApiError so it's handled by our global error handler
        throw new ApiError(options.statusCode, options.message.message);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

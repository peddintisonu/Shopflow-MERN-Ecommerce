import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";
import { RateLimit } from "../constants.js";

// A generic handler to be reused by all limiters
const rateLimitHandler = (req, res, next, options) => {
    throw new ApiError(
        options.statusCode,
        `Too many requests. ${options.message}`
    );
};

// Rate limiter for login attempts
export const loginRateLimiter = rateLimit({
    windowMs: RateLimit.LOGIN.WINDOW_MS,
    max: RateLimit.LOGIN.MAX_REQUESTS,
    message: `Please try again after ${RateLimit.LOGIN.WINDOW_MS / 60000} minutes.`,
    handler: rateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for password reset requests
export const passwordResetRateLimiter = rateLimit({
    windowMs: RateLimit.PASSWORD_RESET.WINDOW_MS,
    max: RateLimit.PASSWORD_RESET.MAX_REQUESTS,
    message: `Please try again after ${RateLimit.PASSWORD_RESET.WINDOW_MS / 60000} minutes.`,
    handler: rateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for email verification and resend requests
export const emailVerificationRateLimiter = rateLimit({
    windowMs: RateLimit.EMAIL_VERIFICATION.WINDOW_MS,
    max: RateLimit.EMAIL_VERIFICATION.MAX_REQUESTS,
    message: `Please try again after ${RateLimit.EMAIL_VERIFICATION.WINDOW_MS / 60000} minutes.`,
    handler: rateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});

// A more general rate limiter for other auth actions like registration
export const authGeneralRateLimiter = rateLimit({
    windowMs: RateLimit.AUTH.WINDOW_MS,
    max: RateLimit.AUTH.MAX_REQUESTS,
    message: `Please try again after ${RateLimit.AUTH.WINDOW_MS / 60000} minutes.`,
    handler: rateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});

import { Router } from "express";
import {
    initiatePasswordReset,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendVerificationEmail,
    resetPassword,
    verifyEmailOTP,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    authGeneralRateLimiter,
    emailVerificationRateLimiter,
    loginRateLimiter,
    passwordResetRateLimiter,
} from "../middleware/rateLimiter.middleware.js";
import {
    loginUserValidator,
    registerUserValidator,
} from "../validators/auth.validator.js";

const router = Router();

// --- Public Routes with Specific Rate Limiting ---

// Registration
router.post(
    "/register",
    authGeneralRateLimiter,
    upload.single("avatar"),
    registerUserValidator,
    registerUser
);

// Login
router.post(
    "/login",
    loginRateLimiter, // Stricter limit for login
    loginUserValidator,
    loginUser
);

// Email Verification
router.post("/verify-email", emailVerificationRateLimiter, verifyEmailOTP);

// Resend Verification
router.post(
    "/resend-verification",
    emailVerificationRateLimiter,
    resendVerificationEmail
);

// Password Reset Flow
router.post(
    "/forgot-password",
    passwordResetRateLimiter, // Strictest limit
    initiatePasswordReset
);
router.post(
    "/reset-password",
    passwordResetRateLimiter, // Strictest limit
    resetPassword
);

// --- Secured Routes ---

// Logout (Protected, so less strict limit)
router.post("/logout", authGeneralRateLimiter, verifyJWT, logoutUser);

// Refresh Token (Protected)
router.post("/refresh-token", authGeneralRateLimiter, refreshAccessToken);

export default router;

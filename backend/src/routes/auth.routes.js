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
import { wrapValidator } from "../utils/helpers.js";
import {
    loginUserValidator,
    registerUserValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post(
    "/register",
    upload.single("avatar"),
    wrapValidator(registerUserValidator),
    registerUser
);

router.post("/login", wrapValidator(loginUserValidator), loginUser);

// Email Verification
router.post("/verify-email", verifyEmailOTP);
router.post("/resend-verification", resendVerificationEmail);

// Password Reset
router.post("/forgot-password", initiatePasswordReset);
router.post("/reset-password", resetPassword);

// Only this one needs protection
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;

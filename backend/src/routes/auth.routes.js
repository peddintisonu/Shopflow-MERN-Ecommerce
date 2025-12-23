import { Router } from "express";

import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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
    asyncHandler(registerUser)
);

router.post(
    "/login",
    wrapValidator(loginUserValidator),
    asyncHandler(loginUser)
);
router.post("/logout", verifyJWT, asyncHandler(logoutUser));

router.post("/refresh-token", asyncHandler(refreshAccessToken));

export default router;

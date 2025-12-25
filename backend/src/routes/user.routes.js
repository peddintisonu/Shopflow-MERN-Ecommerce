import { Router } from "express";
import {
    changeCurrentPassword,
    deleteCurrentUser,
    getCurrentUser,
    updateUserAvatar,
    updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/me", getCurrentUser);

router.post("/change-password", changeCurrentPassword);

router.patch("/update-profile", updateUserProfile);
router.patch("/update-avatar", upload.single("avatar"), updateUserAvatar);

router.delete("/me", deleteCurrentUser);

export default router;

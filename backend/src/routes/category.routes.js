import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
} from "../controllers/category.controller.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// --- Public Routes ---
router.get("/", asyncHandler(getAllCategories));
router.get("/:categoryId", asyncHandler(getCategoryById));

// --- Protected Admin Routes ---
router.use(verifyJWT, verifyAdmin, upload.single("image"));

router.post("/", asyncHandler(createCategory));
router.put("/:categoryId", asyncHandler(updateCategory));
router.delete("/:categoryId", asyncHandler(deleteCategory));

export default router;

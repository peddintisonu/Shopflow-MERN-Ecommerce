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

const router = Router();

// --- Public Routes ---
router.get("/", getAllCategories);
router.get("/:categoryId", getCategoryById);

// --- Protected Admin Routes ---
router.use(verifyJWT, verifyAdmin, upload.single("image"));

router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);

export default router;

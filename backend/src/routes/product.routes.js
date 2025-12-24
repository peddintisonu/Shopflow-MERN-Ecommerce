import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// --- Public Routes ---
router.get("/", asyncHandler(getAllProducts));
router.get("/:productId", asyncHandler(getProductById));

// --- Protected Admin Routes ---
// Apply Auth middleware globally to admin routes
router.use(verifyJWT, verifyAdmin);

// Create (Needs files)
router.post(
    "/",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "gallery", maxCount: 4 },
    ]),
    asyncHandler(createProduct)
);

// Update (Needs files - maybe they update the image)
router.patch(
    "/:productId",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "gallery", maxCount: 4 },
    ]),
    asyncHandler(updateProduct)
);

// Delete (No files needed)
router.delete("/:productId", asyncHandler(deleteProduct));

export default router;

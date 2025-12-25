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

const router = Router();

// --- Public Routes ---
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

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
    createProduct
);

// Update (Needs files - maybe they update the image)
router.patch(
    "/:productId",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "gallery", maxCount: 4 },
    ]),
    updateProduct
);

// Delete (No files needed)
router.delete("/:productId", deleteProduct);
export default router;

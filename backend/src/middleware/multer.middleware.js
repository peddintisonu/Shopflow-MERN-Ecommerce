import crypto from "crypto";
import multer from "multer";
import path from "path";
import { MAX_FILE_SIZE_BYTES } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

// Define the allowed file types
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const randomSuffix = crypto.randomBytes(8).toString("hex");
        const extension = path.extname(file.originalname);
        const uniqueFilename = `${Date.now()}-${randomSuffix}${extension}`;
        cb(null, uniqueFilename);
    },
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        // Pass an error to be caught by the global error handler
        cb(
            new ApiError(
                400,
                "Unsupported file format. Only JPEG, PNG, WEBP and JPG are allowed."
            ),
            false
        );
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES, // 5 MB limit
    },
    fileFilter, // Add the file filter function here
});

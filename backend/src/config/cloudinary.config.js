import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ENV } from "./env.config.js";

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath) => {
    console.log("Cloudinary Util: Starting upload for path:", localFilePath);

    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // Cleanup
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Util: ERROR during upload:", error);

        // Cleanup even on failure
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

// Add this to backend/src/config/cloudinary.config.js
export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from cloudinary:", error);
    }
};

// Helper to extract ID from URL
// e.g., "https://.../v1/folder/my-image.jpg" -> "folder/my-image"
export const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const splitUrl = url.split("/");
    const lastPart = splitUrl[splitUrl.length - 1]; // "my-image.jpg"
    return lastPart.split(".")[0]; // "my-image"
};

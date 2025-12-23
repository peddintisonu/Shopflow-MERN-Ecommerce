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

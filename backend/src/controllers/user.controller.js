import {
    deleteFromCloudinary,
    getPublicIdFromUrl,
    uploadToCloudinary,
} from "../config/cloudinary.config.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendPasswordChangedNotification } from "../utils/mail.js";
import {
    isStrongPassword,
    isValidUsername,
} from "../validators/auth.validator.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully", req.user));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current and new passwords are required");
    }

    if (currentPassword === newPassword) {
        throw new ApiError(
            400,
            "New password must be different from current password"
        );
    }

    // 1. Validate Strength
    if (!isStrongPassword(newPassword)) {
        throw new ApiError(
            400,
            "Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol"
        );
    }

    const user = await User.findById(req.user._id).select("+password"); // explicit select if password is excluded by default

    // 2. Check Old Password
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid)
        throw new ApiError(401, "Current password is incorrect");

    // 3. Update
    user.password = newPassword;
    await user.save();

    try {
        await sendPasswordChangedNotification(user.email);
    } catch (error) {
        console.error("Password changed notification email failed:", error);
    }

    res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, username } = req.body;

    const user = req.user;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (username && username !== user.username) {
        // Check if username is taken
        const existingUser = await User.findOne({ username });
        if (
            existingUser &&
            existingUser._id.toString() !== user._id.toString()
        ) {
            throw new ApiError(400, "Username is already taken");
        }

        if (!isValidUsername(username)) {
            throw new ApiError(
                400,
                "Username must be at least 3 characters and contain only lowercase letters, numbers, and underscores."
            );
        }
        user.username = username;
    }
    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(req.user._id).select(
        "-password -refreshToken -__v"
    );

    res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const user = req.user;
    const oldAvatarUrl = user.avatar;

    const avatarUploadResult = await uploadToCloudinary(req.file.path);
    if (!avatarUploadResult) {
        throw new ApiError(500, "Failed to upload avatar, please try again.");
    }
    const newAvatarUrl = avatarUploadResult.url;

    user.avatar = newAvatarUrl;
    await user.save({ validateBeforeSave: false });

    if (oldAvatarUrl) {
        const publicId = getPublicIdFromUrl(oldAvatarUrl);
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    const updatedUser = await User.findById(req.user._id).select(
        "-password -refreshToken -__v"
    );

    res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
});

export const deleteCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.isActive = false;
    user.deletedAt = new Date();
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, "User deleted successfully"));
});

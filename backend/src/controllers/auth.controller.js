import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../../constants.js";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { ENV } from "../config/env.config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = async (req, res) => {
    // --- 1. Data Extraction ---
    const { username, password, email, firstName, lastName } = req.body;

    // --- 2. Business Logic ---
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, "Username or email is already in use");
    }

    let avatarUrl = null;
    if (req.file && req.file.path) {
        const avatarUploadResult = await uploadToCloudinary(req.file.path);
        if (!avatarUploadResult) {
            throw new ApiError(
                500,
                "Failed to upload avatar, please try again"
            );
        }
        avatarUrl = avatarUploadResult.url;
    }

    const newUser = await User.create({
        username: username.toLowerCase(), // Sanitize username
        email,
        password,
        firstName,
        lastName,
        avatar: avatarUrl,
    });

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken -__v"
    );

    const refreshTokenOptions = {
        ...COOKIE_OPTIONS,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    };

    const accessTokenOptions = {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
    };

    // --- 3. Response ---
    return res
        .status(201)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            new ApiResponse(201, "User registered successfully", createdUser)
        );
};

export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
    );

    const refreshTokenOptions = {
        ...COOKIE_OPTIONS,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    };

    const accessTokenOptions = {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            new ApiResponse(200, "User logged in successfully", loggedInUser)
        );
};

export const logoutUser = async (req, res) => {
    // The verifyJWT middleware has already attached req.user
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, // Use $unset to remove the field
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, "User logged out successfully"));
};

export const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Unauthorized request: No refresh token provided"
        );
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            ENV.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(
                401,
                "Refresh token is expired or has been used"
            );
        }

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const refreshTokenOptions = {
            ...COOKIE_OPTIONS,
            maxAge: 10 * 24 * 60 * 60 * 1000,
        };
        const accessTokenOptions = {
            ...COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000,
        };

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
            .cookie("accessToken", newAccessToken, accessTokenOptions)
            .json(
                new ApiResponse(200, "Access token refreshed successfully", {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                })
            );
    } catch (error) {
        // This catch block handles expired/malformed JWTs
        throw new ApiError(
            401,
            error?.message || "Invalid or expired refresh token"
        );
    }
};

import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { ENV } from "../config/env.config.js";
import { COOKIE_OPTIONS } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    sendPasswordChangedNotification,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../utils/mail.js";
import { hashRandomToken } from "../utils/security.js";
import { isStrongPassword } from "../validators/auth.validator.js";

const createTokenCookieOptions = (maxAgeMs) => ({
    ...COOKIE_OPTIONS,
    maxAge: maxAgeMs,
});

const REFRESH_TOKEN_MAX_AGE = 10 * 24 * 60 * 60 * 1000; // 10 days
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes

// Auth Controllers
export const registerUser = asyncHandler(async (req, res) => {
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

    const emailVerificationOtp = newUser.generateEmailVerificationOtp();
    await newUser.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, emailVerificationOtp);

    // --- 3. Response ---
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "User registered successfully, please verify your email before logging in"
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
        throw new ApiError(401, "Invalid Credentials");
    }

    // Check if user is active
    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account has been deactivated. Please contact support."
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credentials");
    }

    if (!user.isVerified) {
        const emailVerificationOtp = user.generateEmailVerificationOtp();
        await user.save({ validateBeforeSave: false });

        await sendVerificationEmail(user.email, emailVerificationOtp);
        throw new ApiError(
            403,
            "Please verify your email before logging in. Check your inbox."
        );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
    );

    const refreshTokenOptions = createTokenCookieOptions(REFRESH_TOKEN_MAX_AGE);
    const accessTokenOptions = createTokenCookieOptions(ACCESS_TOKEN_MAX_AGE);

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            new ApiResponse(200, "User logged in successfully", loggedInUser)
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
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
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
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

        const refreshTokenOptions = createTokenCookieOptions(
            REFRESH_TOKEN_MAX_AGE
        );
        const accessTokenOptions =
            createTokenCookieOptions(ACCESS_TOKEN_MAX_AGE);

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
        // JWT-specific errors should be 401, other errors should propagate
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }
        // Re-throw other errors (e.g., database errors) to be handled by global error handler
        throw error;
    }
});

// Email Verification Controllers
export const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        throw new ApiError(400, "Verification otp is required");
    }

    const user = await User.findOne({
        emailVerificationOtp: hashRandomToken(otp.toString().trim()),
        emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification otp");
    }

    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    await sendWelcomeEmail(user.email, user.firstName);

    res.status(200).json(
        new ApiResponse(200, "Email verified successfully", {
            userId: user._id,
        })
    );
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    if (user.isVerified) throw new ApiError(400, "User is already verified");

    // Generate new token
    const verificationOtp = user.generateEmailVerificationOtp();
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, verificationOtp);

    res.status(200).json(new ApiResponse(200, null, "Verification email sent"));
});

// Password Reset Controllers

export const initiatePasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Security: Do not reveal if user exists or not.
    // If user exists, send email. If not, do nothing but say "sent".
    if (user) {
        const unHashedToken = user.generatePasswordResetOtp();
        await user.save({ validateBeforeSave: false });

        await sendPasswordResetEmail(email, unHashedToken);
    }

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "If an account exists, a reset link has been sent"
        )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    // The token comes from the URL (params), the new password from Body
    const { otp, newPassword } = req.body;

    if (!otp) throw new ApiError(400, "OTP missing");

    // 1. Find User by Token (Proof of permission)
    const user = await User.findOne({
        forgotPasswordOtp: hashRandomToken(otp.toString().trim()),
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired reset otp");

    // 2. Validate New Password
    if (!isStrongPassword(newPassword)) {
        throw new ApiError(
            400,
            "Password must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol"
        );
    }

    // 3. Update Password & Clear Tokens
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    await sendPasswordChangedNotification(user.email);

    res.status(200).json(
        new ApiResponse(200, null, "Password reset successfully")
    );
});

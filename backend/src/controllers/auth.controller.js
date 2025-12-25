import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { ENV } from "../config/env.config.js";
import {
    ACCESS_TOKEN_EXPIRY_MS,
    COOKIE_OPTIONS,
    REFRESH_TOKEN_EXPIRY_MS,
} from "../constants.js";
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

export const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, "Username or email is already in use");
    }

    let avatarUrl = null;
    if (req.file?.path) {
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
        username: username.toLowerCase(),
        email,
        password,
        firstName,
        lastName,
        avatar: avatarUrl,
    });

    const emailVerificationOtp = newUser.generateEmailVerificationOtp();
    await newUser.save({ validateBeforeSave: false });

    try {
        await sendVerificationEmail(email, emailVerificationOtp);
    } catch (error) {
        // If email fails, don't block registration. User can use "resend" later.
        console.error(
            "Verification email failed to send for user:",
            newUser._id,
            error
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                null,
                "User registered. Please verify your email."
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select("+password"); // Explicitly request password

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Account deactivated. Contact support.");
    }

    if (!user.isVerified) {
        // Spam Prevention: Only generate a new OTP if the old one is expired
        if (
            user.emailVerificationOtp &&
            user.emailVerificationExpiry > new Date()
        ) {
            throw new ApiError(
                403,
                "Account not verified. Check your inbox for the existing OTP."
            );
        }

        const newOtp = user.generateEmailVerificationOtp();
        await user.save({ validateBeforeSave: false });

        try {
            await sendVerificationEmail(user.email, newOtp);
        } catch (error) {
            throw new ApiError(
                500,
                "Failed to send verification email. Please try again later."
            );
        }

        throw new ApiError(
            403,
            "Account not verified. A new OTP has been sent."
        );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const refreshTokenOptions = createTokenCookieOptions(
        REFRESH_TOKEN_EXPIRY_MS
    );
    const accessTokenOptions = createTokenCookieOptions(ACCESS_TOKEN_EXPIRY_MS);

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    return res
        .status(200)
        .clearCookie("accessToken", COOKIE_OPTIONS)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken)
        throw new ApiError(401, "Unauthorized: No refresh token");

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        ENV.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken(); // Token Rotation

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const refreshTokenOptions = createTokenCookieOptions(
        REFRESH_TOKEN_EXPIRY_MS
    );
    const accessTokenOptions = createTokenCookieOptions(ACCESS_TOKEN_EXPIRY_MS);

    return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
        .cookie("accessToken", newAccessToken, accessTokenOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken },
                "Token refreshed"
            )
        );
});

export const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (!otp) throw new ApiError(400, "OTP is required");

    const user = await User.findOne({
        emailVerificationOtp: hashRandomToken(otp.toString().trim()),
        emailVerificationExpiry: { $gt: new Date() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired OTP");

    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    try {
        await sendWelcomeEmail(user.email, user.firstName);
    } catch (error) {
        console.error(
            "Welcome email failed to send for user:",
            user._id,
            error
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { isVerified: true },
            "Email verified successfully"
        )
    );
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    if (user.isVerified) throw new ApiError(400, "User is already verified");

    // Spam Prevention
    if (
        user.emailVerificationOtp &&
        user.emailVerificationExpiry > new Date()
    ) {
        throw new ApiError(
            400,
            "An active OTP already exists. Please check your inbox."
        );
    }

    const newOtp = user.generateEmailVerificationOtp();

    try {
        await sendVerificationEmail(email, newOtp);
        await user.save({ validateBeforeSave: false }); // Save ONLY if email succeeds
    } catch (error) {
        throw new ApiError(
            500,
            "Failed to send verification email. Please try again later."
        );
    }
    res.status(200).json(
        new ApiResponse(200, null, "Verification email sent successfully")
    );
});

export const initiatePasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        const resetOtp = user.generatePasswordResetOtp();
        try {
            await sendPasswordResetEmail(email, resetOtp);
            await user.save({ validateBeforeSave: false });
        } catch (error) {
            throw new ApiError(500, "Failed to send password reset email.");
        }
    }

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "If an account with this email exists, a reset code has been sent."
        )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword)
        throw new ApiError(400, "OTP and new password are required");

    const user = await User.findOne({
        forgotPasswordOtp: hashRandomToken(otp.toString().trim()),
        forgotPasswordExpiry: { $gt: new Date() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired reset OTP");

    if (!isStrongPassword(newPassword)) {
        throw new ApiError(400, "Password is not strong enough.");
    }

    user.password = newPassword;
    user.forgotPasswordOtp = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    try {
        await sendPasswordChangedNotification(user.email);
    } catch (error) {
        console.error("Password changed notification email failed:", error);
    }

    res.status(200).json(
        new ApiResponse(200, null, "Password reset successfully")
    );
});

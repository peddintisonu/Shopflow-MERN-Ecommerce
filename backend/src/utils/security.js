import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env.config.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants.js";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const generateRefreshToken = (payload) => {
    try {
        const token = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
        return token;
    } catch (error) {
        console.error("Error generating Refresh Token:", error);
        throw new Error("Failed to generate refresh token");
    }
};

export const generateAccessToken = (payload) => {
    try {
        const token = jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
        return token;
    } catch (error) {
        console.error("Error generating Access Token:", error);
        throw new Error("Failed to generate access token");
    }
};

export const generateOTP = () => {
    // Generate a random integer between 100000 and 999999
    return crypto.randomInt(100000, 999999).toString();
};

export const hashRandomToken = (unHashedToken) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    return hashedToken;
};

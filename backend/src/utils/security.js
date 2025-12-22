import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { DB_CONSTANTS } from "../../constants.js";
import { ENV } from "../config/env.config.js";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const generateRefreshToken = (payload) => {
    try {
        const token = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
            expiresIn: DB_CONSTANTS.REFRESH_TOKEN_EXPIRY,
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
            expiresIn: DB_CONSTANTS.ACCESS_TOKEN_EXPIRY,
        });
        return token;
    } catch (error) {
        console.error("Error generating Access Token:", error);
        throw new Error("Failed to generate access token");
    }
};

export const generateRandomToken = () => {
    // Generates a 20-byte random hex string (e.g., for email links)
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    // We hash the token before saving to DB (Security best practice)
    // So if DB is hacked, they can't create fake reset links
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    // Return both (One to send to user, One to save to DB)
    return { unHashedToken, hashedToken };
};

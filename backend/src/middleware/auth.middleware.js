import jwt from "jsonwebtoken";

import { ENV } from "../config/env.config.js";
import { UserRolesEnum } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request: Token not found");
    }

    try {
        const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid Access Token: User does not exist"
            );
        }

        // Check if user is active
        if (!user.isActive) {
            throw new ApiError(
                403,
                "Access Denied: User account is deactivated"
            );
        }

        req.user = user;
        next();
    } catch (error) {
        // This will catch expired tokens or invalid signatures
        console.error("Error during token verification:", error.message);
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

export const verifyAdmin = (req, _, next) => {
    if (req.user?.role !== UserRolesEnum.ADMIN) {
        throw new ApiError(403, "Forbidden: Admins only");
    }
    next();
};

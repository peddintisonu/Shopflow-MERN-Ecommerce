import mongoose from "mongoose";
import { DB_CONSTANTS } from "../../constants.js";
import {
    comparePassword,
    generateAccessToken,
    generateRandomToken,
    generateRefreshToken,
    hashPassword,
} from "../utils/security.js";

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [
            /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
            "Please enter a valid phone number",
        ],
    },
    flatNumber: { type: String, required: true, trim: true },
    addressLane1: { type: String, required: true, trim: true },
    addressLane2: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 2,
        default: "IN",
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
        minLength: [4, "Invalid pincode"],
        maxLength: [10, "Invalid pincode"],
    },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [
                /^[a-z0-9_]+$/,
                "Username allows only lowercase letters, numbers, and underscores",
            ],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please enter a valid email address",
            ],
        },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, default: "", trim: true },
        password: { type: String, default: null },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        avatar: {
            type: String,
            default: DB_CONSTANTS.DEFAULT_USER_AVATAR,
        },
        googleId: { type: String, default: null },
        addresses: { type: [addressSchema], default: [] },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        isVerified: { type: Boolean, default: false },
        refreshToken: { type: String },

        // Security & Lifecycle
        forgotPasswordToken: { type: String },
        forgotPasswordExpiry: { type: Date },
        emailVerificationToken: { type: String },
        emailVerificationExpiry: { type: Date },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
    },
    { timestamps: true }
);

// --- HOOKS & METHODS ---

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (this.password === null) return next();
    this.password = await hashPassword(this.password);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    if (this.password === null) return false;
    return await comparePassword(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return generateAccessToken({
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
    });
};

userSchema.methods.generateRefreshToken = function () {
    return generateRefreshToken({ _id: this._id });
};

userSchema.methods.generateResetToken = function () {
    const { unHashedToken, hashedToken } = generateRandomToken();
    this.forgotPasswordToken = hashedToken;
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000; // 20 mins
    return unHashedToken;
};

export const User = mongoose.model("User", userSchema);

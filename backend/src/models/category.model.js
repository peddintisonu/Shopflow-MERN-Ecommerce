import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        slug: {
            type: String,
            lowercase: true,
            unique: true,
            trim: true,
            required: true,
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },

        image: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);

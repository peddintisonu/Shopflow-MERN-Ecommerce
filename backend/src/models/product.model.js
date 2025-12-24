import mongoose from "mongoose";

// 1. Options (User Choices: Size, Color)
const optionSchema = new mongoose.Schema(
    {
        key: { type: String, required: true }, // "Color"
        value: { type: String, required: true }, // "Red"
        price: {
            salePrice: { type: Number, default: 0 },
            originalPrice: { type: Number, default: 0 },
        },
        stock: { type: Number, default: 0 },
    },
    { _id: false }
);

// 2. Specifications (Static Facts: RAM, Material, Author)
const specSchema = new mongoose.Schema(
    {
        key: { type: String, required: true }, // "Processor"
        value: { type: String, required: true }, // "Intel i7"
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: { type: String, required: true, trim: true, unique: true },
        description: { type: String, required: true },

        brand: { type: String, required: true, index: true },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        slug: { type: String, required: true, unique: true, lowercase: true },

        price: {
            salePrice: { type: Number, required: true },
            originalPrice: { type: Number, required: true },
        },

        dimensions: {
            length: { type: Number, default: 0 }, // cm
            width: { type: Number, default: 0 }, // cm
            height: { type: Number, default: 0 }, // cm
            weight: { type: Number, default: 0 }, // kg (Crucial for shipping)
        },

        maxOrderQuantity: { type: Number, default: 10 },

        tags: [{ type: String, trim: true }],

        stock: {
            type: Number,
            required: true,
            min: [0, "Stock cannot be negative"],
        },

        options: {
            type: [optionSchema],
            default: [],
        },

        specifications: {
            type: [specSchema],
            default: [],
        },

        images: {
            thumbnail: { type: String, required: true },
            gallery: [{ type: String }],
        },

        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },

        isReturnable: { type: Boolean, default: true },

        status: {
            type: String,
            enum: ["draft", "available", "out_of_stock", "discontinued"],
            default: "available",
        },
    },
    { timestamps: true }
);

// Index for Search: Searches Name, Desc, Brand, and Specs
productSchema.index({
    name: "text",
    slug: "text",
    description: "text",
    brand: "text",
    "specifications.value": "text",
});

export const Product = mongoose.model("Product", productSchema);

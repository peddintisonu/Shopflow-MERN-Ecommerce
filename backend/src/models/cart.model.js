import mongoose from "mongoose";

const itemOptionSchema = new mongoose.Schema(
    {
        key: { type: String, required: true }, // e.g., "Color", "RAM"
        value: { type: String, required: true }, // e.g., "Red", "16GB"
    },
    { _id: false }
);

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },

    options: {
        type: [itemOptionSchema],
        default: [],
    },
});

const cartSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: {
            type: [cartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);

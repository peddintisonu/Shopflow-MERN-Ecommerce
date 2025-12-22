import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },

        isVerifiedPurchase: { type: Boolean, default: false },
    },
    { timestamps: true }
);

reviewSchema.index({ author: 1, product: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);

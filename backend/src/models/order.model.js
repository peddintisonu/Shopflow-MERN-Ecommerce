import mongoose from "mongoose";

// Note: Intentionally duplicated from cart.model.js to decouple the Order schema
// from the Cart schema. The Order represents a historical snapshot and should not be
// affected by future changes to the Cart's structure.
const itemOptionSchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
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
    price: {
        type: Number,
        required: true,
    },

    isReturnable: {
        type: Boolean,
        default: true,
    },

    status: {
        type: String,
        enum: [
            "NORMAL", // Standard purchase
            "RETURN_REQUESTED", // User clicked "Return"
            "RETURN_APPROVED", // Admin said OK
            "RETURN_REJECTED", // Admin said No
            "RETURNED", // Item received back
            "REPLACEMENT_REQUESTED",
            "REPLACED", // New item sent
        ],
        default: "NORMAL",
    },
    reason: { type: String, default: null },
});

const shippingAddressSchema = new mongoose.Schema({
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
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: {
            type: [orderItemSchema],
            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },
                message: "Order must contain at least one item",
            },
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        paymentInfo: {
            paymentId: {
                type: String,
                trim: true,
            },

            status: {
                type: String,
                enum: ["PAID", "PENDING", "FAILED"],
                default: "PENDING",
            },

            method: {
                type: String,
                enum: [
                    "CREDIT_CARD",
                    "DEBIT_CARD",
                    "NET_BANKING",
                    "UPI",
                    "COD",
                ],
                default: "COD",
            },
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PENDING",
        },

        amounts: {
            itemPrice: {
                type: Number,
                required: true,
            },
            taxPrice: {
                type: Number,
                required: true,
            },
            shippingPrice: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
        },

        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentInfo.status": 1 });

export const Order = mongoose.model("Order", orderSchema);

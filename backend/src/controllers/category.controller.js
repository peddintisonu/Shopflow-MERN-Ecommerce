import mongoose from "mongoose";
import slugify from "slugify";

import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ADMIN CONTROLLERS
export const createCategory = asyncHandler(async (req, res) => {
    const { name, parent } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }
    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
        throw new ApiError(409, "Category with this name already exists");
    }

    if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
            throw new ApiError(404, "Parent category not found");
        }
    }

    let categoryImageURL = null;

    if (req.file && req.file.path) {
        const categoryImageUploadResult = await uploadToCloudinary(
            req.file.path
        );
        if (!categoryImageUploadResult) {
            throw new ApiError(
                500,
                "Failed to upload category image to Cloudinary"
            );
        }
        categoryImageURL = categoryImageUploadResult.url;
    }

    const category = await Category.create({
        name,
        slug,
        parent: parent || null,
        image: categoryImageURL || null,
        owner: req.user._id,
    });

    res.status(201).json(
        new ApiResponse(201, "Category created successfully", category)
    );
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, parent } = req.body;

    // 1. Find the category first
    const categoryToUpdate = await Category.findById(categoryId);
    if (!categoryToUpdate) {
        throw new ApiError(404, "Category not found");
    }

    // 2. Handle Name Updates & Duplicate Check
    if (name) {
        const slug = slugify(name, { lower: true, strict: true });

        // Check if ANOTHER category has this slug (excluding this one)
        const existingCategory = await Category.findOne({ slug });

        if (
            existingCategory &&
            existingCategory._id.toString() !== categoryId
        ) {
            throw new ApiError(409, "Category with this name already exists");
        }

        // Update fields
        categoryToUpdate.name = name;
        categoryToUpdate.slug = slug;
    } else {
        // If name is not provided, we do not update it
        throw new ApiError(400, "Category name is required for update");
    }

    // 3. Handle Parent Update
    if (parent) {
        // Prevent setting parent to itself
        if (parent === categoryId) {
            throw new ApiError(400, "Category cannot be its own parent");
        }

        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
            throw new ApiError(404, "Parent category not found");
        }
        categoryToUpdate.parent = parent;
    }

    // 4. Handle Image Update (Only if file provided)
    if (req.file && req.file.path) {
        const uploadResult = await uploadToCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "Failed to upload image");
        }
        categoryToUpdate.image = uploadResult.url;
    }

    // 5. Save and Return
    // .save() ensures validation hooks run and returns the updated doc
    const updatedCategory = await categoryToUpdate.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Category updated successfully",
                updatedCategory
            )
        );
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // --- SAFETY STEP 1: Handle Sub-categories ---
    // Find all categories where 'parent' is this category
    // Set their parent to null (making them top-level categories)
    await Category.updateMany(
        { parent: category._id },
        { $set: { parent: null } }
    );

    // --- SAFETY STEP 2: Handle Products ---
    // Find all products in this category
    // Set their category to null (Uncategorized)
    await Product.updateMany(
        { category: category._id },
        { $set: { category: null } }
    );

    // --- STEP 3: Delete the Category ---
    await Category.findByIdAndDelete(categoryId);

    return res
        .status(200)
        .json(new ApiResponse(200, "Category deleted successfully", {}));
});

// PUBLIC CONTROLLERS
export const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!mongoose.isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid Category ID");
    }

    const category = await Category.findById(categoryId).populate(
        "parent",
        "name slug"
    );

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Category fetched successfully", category)
    );
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
        .populate("parent", "name slug")
        .lean();
    res.status(200).json(
        new ApiResponse(200, "Categories fetched successfully", categories)
    );
});

import slugify from "slugify";

import { uploadToCloudinary } from "../config/cloudinary.config.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ADMIN CONTROLLERS
export const createProduct = async (req, res) => {
    let {
        name,
        description,
        brand,
        originalPrice,
        salePrice,
        stock,
        category,
        specifications,
        options,
        tags,
    } = req.body;

    if (
        !name ||
        !description ||
        !brand ||
        !originalPrice ||
        !stock ||
        !category
    ) {
        throw new ApiError(400, "Missing required fields");
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
        throw new ApiError(400, "Product with this name already exists");
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ApiError(404, "Invalid category ID");
    }

    if (
        !req.files ||
        !req.files.thumbnail ||
        req.files.thumbnail.length === 0 ||
        !req.files.gallery ||
        req.files.gallery.length === 0
    ) {
        throw new ApiError(
            400,
            "Thumbnail image is required, and at least one gallery image is required"
        );
    }

    // Upload Thumbnail
    const thumbnailResult = await uploadToCloudinary(
        req.files.thumbnail[0].path
    );
    if (!thumbnailResult) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }
    const thumbnailUrl = thumbnailResult.url;

    // Upload Gallery (if exists)
    let galleryUrls = [];
    if (req.files.gallery && req.files.gallery.length > 0) {
        const galleryPromises = req.files.gallery.map((file) =>
            uploadToCloudinary(file.path)
        );
        const galleryResults = await Promise.all(galleryPromises);

        // Filter out any failed uploads (nulls) and get URLs
        galleryUrls = galleryResults
            .filter((res) => res !== null)
            .map((res) => res.url);
    }

    try {
        if (specifications) {
            specifications = JSON.parse(specifications);
        } else {
            specifications = [];
        }

        if (options) {
            options = JSON.parse(options);
        } else {
            options = [];
        }

        if (tags) {
            tags = JSON.parse(tags);
        } else {
            tags = [];
        }
    } catch (error) {
        throw new ApiError(
            400,
            "Invalid JSON format in specifications, options, or tags"
        );
    }

    if (salePrice && parseFloat(salePrice) > parseFloat(originalPrice)) {
        throw new ApiError(
            400,
            "Sale price cannot be greater than original price"
        );
    }

    const owner = req.user._id;

    const newProduct = await Product.create({
        owner,
        name,
        description,
        images: {
            thumbnail: thumbnailUrl,
            gallery: galleryUrls,
        },
        brand,
        price: {
            originalPrice: parseFloat(originalPrice),
            salePrice: salePrice
                ? parseFloat(salePrice)
                : parseFloat(originalPrice),
        },
        stock: parseInt(stock),
        category,
        specifications,
        options,
        tags,
        slug,
    });

    res.status(201).json(
        new ApiResponse(201, "Product created successfully", newProduct)
    );
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;

    // 1. Find the product first
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // 2. Extract Data
    // We get potentially updated fields from req.body
    const {
        name,
        description,
        brand,
        originalPrice,
        salePrice,
        stock,
        category,
        specifications,
        options,
        tags,
        status, // Admin might want to set it to "draft" or "out_of_stock"
    } = req.body;

    // 3. Handle Text Updates (Only update if provided)
    if (description) product.description = description;
    if (brand) product.brand = brand;
    if (stock) product.stock = parseInt(stock);
    if (category) {
        // Validate category existence if it's being changed
        const categoryExists = await Category.findById(category);
        if (!categoryExists) throw new ApiError(400, "Invalid Category ID");
        product.category = category;
    }
    if (status) product.status = status;

    // 4. Handle Price Updates
    // We need careful logic here to update the nested object
    if (originalPrice || salePrice) {
        if (originalPrice)
            product.price.originalPrice = parseFloat(originalPrice);

        // Logic: Update salePrice if provided, OR if originalPrice changed,
        // ensure salePrice isn't higher than original (optional logic, but good practice)
        if (salePrice) {
            product.price.salePrice = parseFloat(salePrice);
        }

        // Ensure salePrice doesn't exceed originalPrice
        if (product.price.salePrice > product.price.originalPrice) {
            throw new ApiError(
                400,
                "Sale price cannot be greater than original price"
            );
        }
    }

    // 5. Handle Name & Slug (Complex)
    if (name && name !== product.name) {
        product.name = name;
        const newSlug = slugify(name, { lower: true, strict: true });

        // Check duplicate slug only if it changed
        const existingSlug = await Product.findOne({ slug: newSlug });
        if (existingSlug && existingSlug._id.toString() !== productId) {
            throw new ApiError(409, "Product with this name already exists");
        }
        product.slug = newSlug;
    }

    // 6. Handle JSON Fields
    // If provided, we REPLACE the old array with the new one
    if (specifications) {
        try {
            product.specifications = JSON.parse(specifications);
        } catch (e) {
            throw new ApiError(400, "Invalid specifications JSON");
        }
    }
    if (options) {
        try {
            product.options = JSON.parse(options);
        } catch (e) {
            throw new ApiError(400, "Invalid options JSON");
        }
    }
    if (tags) {
        try {
            product.tags = JSON.parse(tags);
        } catch (e) {
            throw new ApiError(400, "Invalid tags JSON");
        }
    }

    // 7. Handle Image Updates
    // Thumbnail: Replace
    if (req.files?.thumbnail) {
        const thumbnailResult = await uploadToCloudinary(
            req.files.thumbnail[0].path
        );
        if (thumbnailResult?.url) {
            product.images.thumbnail = thumbnailResult.url;
        }
    }

    // Gallery: Append (Add to existing)
    if (req.files?.gallery) {
        const galleryPromises = req.files.gallery.map((file) =>
            uploadToCloudinary(file.path)
        );
        const galleryResults = await Promise.all(galleryPromises);
        const newUrls = galleryResults
            .filter((res) => res !== null)
            .map((res) => res.url);

        // Push new URLs into the existing gallery array
        product.images.gallery.push(...newUrls);
    }

    // 8. Save
    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Product updated successfully", product));
};

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Product deleted successfully", deletedProduct)
    );
};

// PUBLIC CONTROLLERS
export const getAllProducts = async (req, res) => {
    // 1. Extract Query Params
    const { page = 1, limit = 10, query, category } = req.query;

    // 2. Build the Search/Filter Object
    const filter = {};

    // Search by Name (Case insensitive)
    if (query) {
        filter.name = { $regex: query, $options: "i" };
    }

    // Filter by Category
    if (category) {
        filter.category = category;
    }

    // 3. Calculate Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 4. Run Queries in Parallel (Performance)
    // We need total count for the frontend pagination UI (Page 1 of X)
    const productsPromise = Product.find(filter)
        .populate("category", "name")
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limitNumber);

    const countPromise = Product.countDocuments(filter);

    const [products, totalProducts] = await Promise.all([
        productsPromise,
        countPromise,
    ]);

    // 5. Build Response with Pagination Info
    const responseData = {
        products,
        pagination: {
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitNumber),
            currentPage: pageNumber,
            limit: limitNumber,
        },
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Products retrieved successfully",
                responseData
            )
        );
};

export const getProductById = async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId)
        .populate("category", "name slug") // Only get category name/slug
        .populate("owner", "username email"); // SECURITY: Don't leak admin password/details

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Product retrieved successfully", product)
    );
};

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { corsOptions } from "./config/cors.config.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// --- Standard Middleware ---
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public")); // To serve static files from the public folder

// --- Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Health check endpoint (Should be with other routes)
app.get("/api/v1/health", (_, res) => {
    res.status(200).json(
        new ApiResponse(200, { status: "OK" }, "Health check passed")
    );
});

// --- Global Error Handler ---
// This MUST be the last middleware
app.use(errorHandler);

export { app };

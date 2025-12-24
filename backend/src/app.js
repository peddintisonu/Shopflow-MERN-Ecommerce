import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { corsOptions } from "./config/cors.config.js";
import { ENV } from "./config/env.config.js";
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

app.get("/", (req, res) => {
    // You can use a simple HTML string or a more complex template.
    // This is a clean, modern-looking HTML response.
    const welcomeHTML = `
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #E0E0E0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="text-align: center; border: 1px solid #333; padding: 40px; border-radius: 12px; background-color: #1E1E1E; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
                <h1 style="color: #BB86FC; font-size: 36px; margin-bottom: 10px;">
                    🛍️ Shopflow API
                </h1>
                <p style="font-size: 18px; color: #B0B0B0;">
                    This is the backend service for the Shopflow e-commerce application.
                </p>
                <p style="margin-top: 30px; font-size: 16px;">
                    To access the full application, please visit the frontend:
                </p>
                <a href="${ENV.FRONTEND_URL}" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background-color: #03DAC6; color: #121212; text-decoration: none; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#018786'" onmouseout="this.style.backgroundColor='#03DAC6'">
                    Go to Shopflow
                </a>
            </div>
        </body>
    `;
    res.status(200).send(welcomeHTML);
});

// --- Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Health check endpoint (Should be with other routes)
app.get("/api/v1/health", (_, res) => {
    res.status(200).json(new ApiResponse(200, "Health check passed"));
});

// --- Global Error Handler ---
// This MUST be the last middleware
app.use(errorHandler);

export { app };

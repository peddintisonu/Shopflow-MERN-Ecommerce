import express from "express";

import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/v1/health", (_, res) => {
    res.status(200).json(new ApiResponse(200, "API is healthy"));
});

export { app };

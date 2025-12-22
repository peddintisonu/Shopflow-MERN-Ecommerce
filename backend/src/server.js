import { app } from "./app.js";
import { connectDB } from "./config/db.config.js";
import { ENV } from "./config/env.config.js";

const PORT = ENV.PORT;
const MONGO_URI = ENV.MONGO_URI;

connectDB(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1); // Optional: Exit the process if DB connection fails
    });

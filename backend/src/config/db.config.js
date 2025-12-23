import mongoose from "mongoose";
import { ENV } from "./env.config.js";

export const connectDB = async () => {
    try {
        const dbName =
            ENV.NODE_ENV?.toLowerCase() === "production"
                ? ENV.DB_NAME_PROD
                : ENV.DB_NAME_DEV;

        const connectionUri = `${ENV.MONGO_URI}/${dbName}`;

        const connectionInstance = await mongoose.connect(connectionUri);
        console.log(
            "✅ MONGODB CONNECTED SUCCESSFULLY: ",
            connectionInstance.connection.host,
            connectionInstance.connection.name
        );
    } catch (error) {
        console.log("💥 MONGODB CONNECTION FAILED: ", error.message);
        throw error;
    }
};

import mongoose from "mongoose";

export const connectDB = async (MONGO_URI) => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(
            "✅ MONGODB CONNECTED SUCCESSFULLY: ",
            conn.connection.host
        );
    } catch (error) {
        console.log("💥 MONGODB CONNECTION FAILED: ", error.message);
        throw error;
    }
};

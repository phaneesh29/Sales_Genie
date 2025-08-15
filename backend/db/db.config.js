import mongoose from "mongoose";
import { DB_NAME,MONGO_URI } from "../constants.js";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(" Caught DB Error", error)
        process.exit(1)
    }
}
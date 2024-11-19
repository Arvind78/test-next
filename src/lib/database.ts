import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://contact:GUIlEykJZaCB6QeR@cluster0.r79vl.mongodb.net/defa?retryWrites=true&w=majority");
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export const disconnectDb = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully.");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
};
import mongoose, { Schema, model, Document } from "mongoose";

// Define the Register document interface
interface RegisterDocument extends Document {
    address: string;
    email?: string;
    task?: mongoose.Types.ObjectId;
    totalDeposits: number;
    refferCount: number;
    referredBy?: mongoose.Types.ObjectId;
    otp?: mongoose.Types.ObjectId;
    twitter?: string;
    telegram?: string;
    longestStreak: number;
    points: number;
    referralCode?: string;
    lastLogin: Date;
    isBlocked: {
        type:boolean,
        default: false,
        },
    networks: { name: string; contribution: any[] }[];
    ipAddress: string
}

// Define the schema for the Register model
const registerSchema = new Schema<RegisterDocument>(
    {
        address: {
            type: String,
            unique: true,
            required: true,
        },
        email: String,
        task: {
            type: Schema.Types.ObjectId,
            ref: "TaskCompletion",
        },
        totalDeposits: {
            type: Number,
            default: 0,
        },
        refferCount: {
            type: Number,
            default: 0,
        },
        referredBy: {
            type: mongoose.Types.ObjectId,
            ref: "Register",
        },
        otp: {
            type: Schema.Types.ObjectId,
            ref: "Otp",
        },
        twitter: String,
        telegram: String,
        longestStreak: {
            type: Number,
            default: 0,
        },
        points: {
            type: Number,
            default: 0,
        },
        referralCode: String,
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        ipAddress: {
            type: String,
        },
        networks: [
            {
                name: { type: String, default: "" },
                contribution: { type: Array, default: [] },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create the Register model
const Register = mongoose.models["Register"] || model<RegisterDocument>("Register", registerSchema);
export default Register;

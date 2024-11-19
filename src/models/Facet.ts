import mongoose, { Schema, model, Document } from "mongoose";

interface faucetInterface extends Document {
    address: string;
    ipAddress: string
}

const faucetSchema = new Schema<faucetInterface>({
    address: {
        type: String,
        unique: true
    },
    ipAddress: {
        type: String,
    }
}, { timestamps: true })

const Faucet = mongoose.models["Faucet"] || model<faucetInterface>("Faucet", faucetSchema);
export default Faucet;
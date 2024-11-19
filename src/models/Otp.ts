import mongoose, { Schema, Document } from 'mongoose';

interface OtpDocument extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}

const otpSchema = new Schema<OtpDocument>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});


const Otp = mongoose.models["admin-otp"] || mongoose.model<OtpDocument>('admin-otp', otpSchema);
export default Otp
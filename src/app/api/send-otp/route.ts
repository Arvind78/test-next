import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/database";
import { sendOtp } from "@/utils/sendOTP";
import Otp from "@/models/Otp";

/**
 * @swagger
 * /api/send-otp:
 *   post:
 *     summary: Sends an OTP and saves it in the database with an expiration time.
 *     description: Takes an email, generates an OTP, saves it in the database, and sends it to the specified email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to send the OTP to.
 *                 example: "vikasyadav62502@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Bad Request - Missing email.
 *       500:
 *         description: Internal Server Error.
 */
export async function POST(req: NextRequest) {
    await connectDb()
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        await Otp.create({ email, otp, expiresAt });

        await sendOtp(email, otp);
        return NextResponse.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

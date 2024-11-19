import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/get-statics:
 *   get:
 *     summary: Retrieves total points and total registered users.
 *     description: Calculates and returns the total points accumulated by all users and the total number of registered users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved total points and total users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalPoints:
 *                   type: integer
 *                   description: Total points accumulated by all users.
 *                   example: 350
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of registered users.
 *                   example: 15
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Error message indicating failure.
 *                   example: "Internal Server error"
 */


export async function GET() {
    await connectDb();

    try {
        // Calculate total points using aggregation
        const totalPointsResult = await Register.aggregate([
            { $group: { _id: null, totalPoints: { $sum: "$points" } } }
        ]);
        const totalPoints = totalPointsResult[0]?.totalPoints || 0;

        // Count the total number of users
        const totalUsers = await Register.countDocuments();
          
        return NextResponse.json({
            success: true,
            data: {
                totalPoints,
                totalUsers,
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal Server error" });
    }
}

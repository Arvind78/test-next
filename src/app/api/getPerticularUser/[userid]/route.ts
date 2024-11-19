import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/users/{userid}:
 *   get:
 *     summary: Retrieve user details by ID.
 *     description: Fetches the details of a user based on their unique user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: User object containing user details.
 *                   properties:
 *                     _id:
 *                       type: string
 *                     address:
 *                       type: string
 *                     email:
 *                       type: string
 *                     points:
 *                       type: integer
 *                   example:
 *                     _id: "userId"
 *                     address: "123 Main St"
 *                     email: "example@mail.com"
 *                     points: 50
 *       404:
 *         description: Not Found - User not found.
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
 *                   example: "User not found"
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


export async function GET(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    const paramsData = await params;

    await connectDb();

    try {
        const userId = paramsData.userid;

        // Find the user by ID
        const user = await Register.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server error" });
    }
}

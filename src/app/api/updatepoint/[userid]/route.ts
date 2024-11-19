import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/updatepoint/{userid}:
 *   post:
 *     summary: Increment or decrement user points.
 *     description: Updates the points of a user based on the specified operation (increment or decrement).
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         description: The ID of the user whose points are to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of operation, either "increment" or "decrement".
 *                 example: "increment"
 *               amount:
 *                 type: integer
 *                 description: The amount to increment or decrement the points.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Points updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     points:
 *                       type: integer
 *                       description: Updated points of the user.
 *                   example:
 *                     _id: "userId"
 *                     points: 45
 *       400:
 *         description: Bad Request - Invalid operation type or missing amount.
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
 *                   example: "Invalid operation type"
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


export async function POST(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    const paramsData = await params;
    const bodydata = await req.json();

    await connectDb();

    try {
        const userId = paramsData.userid;

        // Find the user by ID
        const user = await Register.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        // Determine the type of operation (increment or decrement)
        if (bodydata.type === "inc") {
            user.points += bodydata.amount;
        } else if (bodydata.type === "dec") {
            user.points -= bodydata.amount;
        } else {
            return NextResponse.json({ success: false, message: "Invalid operation type" });
        }

        // Save the updated user
        await user.save();

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server error" });
    }
}

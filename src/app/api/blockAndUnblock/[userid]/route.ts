import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/blockAndUnblock/{userid}:
 *   post:
 *     summary: Update user status or delete user by ID.
 *     description: Allows blocking, unblocking, or deleting a user based on the specified operation type.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         description: The ID of the user to update or delete.
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
 *                 description: The type of operation to perform. Can be "block", "unblock", or "delete".
 *                 enum: ["block", "unblock", "delete"]
 *               example: "block"
 *     responses:
 *       200:
 *         description: User status updated or user deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Message indicating the result of the operation.
 *                   example: "User Deleted Successfully"
 *                 data:
 *                   type: object
 *                   description: Updated user object after operation.
 *                   properties:
 *                     _id:
 *                       type: string
 *                     isBlocked:
 *                       type: boolean
 *                   example:
 *                     _id: "userId"
 *                     isBlocked: true
 *       400:
 *         description: Bad Request - Invalid operation type or user blocking required before deletion.
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


export async function PUT(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    const paramsData = await params;
    const bodydata = await req.json();
    

    await connectDb();

    try {
        const userId = paramsData.userid;

   
        const user = await Register.findByIdAndUpdate(userId,{$set:{
            isBlocked: bodydata.type === "block" ? true : false,
        }},{new:true});


        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({ success: true, data: user ,message: "User  update  sucessfully !" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal Server error" });
    }
}

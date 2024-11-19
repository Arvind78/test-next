import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextRequest, NextResponse } from "next/server";
/**
 * @swagger
 * /api/get-all-user:
 *   get:
 *     summary: Retrieves a list of users with search, pagination, sorting, and filtering.
 *     description: Fetches users based on search term, pagination, multi-field sorting, and block status.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: pageNo
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users to fetch per page.
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *           default: points
 *         description: The field to sort by (e.g., points, email).
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: The sort direction (ASC for ascending, DESC for descending).
 *       - in: query
 *         name: searchBar
 *         schema:
 *           type: string
 *         description: The search term to filter users by address or email.
 *       - in: query
 *         name: isBlocked
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filter users by block status (true for blocked users, false for unblocked).
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "0x123..."
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       isBlocked:
 *                         type: boolean
 *                         example: false
 *                 total:
 *                   type: integer
 *                   description: Total number of users found.
 *                 pageNo:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal Server Error.
 */



export async function GET(request: NextRequest) {
    await connectDb();

    try {
        const { searchParams } = new URL(request.url);

        // Pagination parameters
        const pageNo = parseInt(searchParams.get("pageNo")!) || 1;
        const limit = parseInt(searchParams.get("limit")!) || 10;

        // Sorting parameters
        const sortField = searchParams.get("sortField") || "points"; // Default sorting by createdAt
        const typeSort = searchParams.get("sortType") || "ASC";
        const isAscOrDesc = typeSort === "ASC" ? 1 : -1;

        // Block filter
        const isBlocked = searchParams.get("isBlocked") || false;
        

        // Search parameter (searching in multiple fields)
        const searchBar = searchParams.get("searchBar") || "";

        // Calculate the skip value for pagination 
        const skip = (pageNo - 1) * limit;

        // Build the search query (using regex for partial match on address or email)
        const searchQuery: any = {
            isBlocked, 
            ...(searchBar && {
                $or: [
                    { address: { $regex: searchBar, $options: "i" } }, // Case-insensitive search
                    { email: { $regex: searchBar, $options: "i" } },
                ],
            }),
        };

        // Fetch the users with search, pagination, and sorting
        const allUsers = await Register.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ [sortField]: isAscOrDesc });

        // Get total user count (with search applied)
        const totalUsers = await Register.countDocuments(searchQuery);

        return NextResponse.json({
            success: true,
            data: allUsers,
            total: totalUsers,
            pageNo,
            limit,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

/**
 * @swagger
 * /api/home:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */

import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({
        success: true, message: "Home route connected"
    })
}
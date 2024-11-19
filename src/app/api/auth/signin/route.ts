import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ nextauth: string[] }> }
) {
    const resolvedParams = await params;
    console.log(resolvedParams, "params");
    return NextResponse.json({
        message: "Handler",
    });
}

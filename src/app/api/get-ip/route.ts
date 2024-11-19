import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract the client's IP address from the x-forwarded-for header
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : null;

    // Remove IPv6 mapping if present
    const ipv4 = clientIp?.replace(/^::ffff:/, '') || null;

    if (!ipv4) {
      return NextResponse.json({ success: false, message: 'IP address could not be determined.' }, { status: 400 });
    }

    console.log(`Client IP: ${ipv4}`); // Log the detected IP address
    return NextResponse.json({ success: true, data: ipv4 }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving client IP:', error);
    return NextResponse.json({ success: false, message: 'Unable to retrieve IP address.' }, { status: 500 });
  }
}

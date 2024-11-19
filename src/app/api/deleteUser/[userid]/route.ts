import { connectDb } from "@/lib/database";
import Register from "@/models/Register";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userid: string }> })  {
    const { userid } = await params;

    if (!userid) {
      return NextResponse.json({ success: false, message: "Invalid user ID" });
    }
    await connectDb()
  try {

     await Register.findOneAndDelete({_id:userid,isBlocked:true});
     return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error:any) {
     return NextResponse.json({ success: false, message: error?.message });
  }
}
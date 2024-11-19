import { NEXT_AUTH_CONFIG } from "@/utils/auth";
import { getServerSession } from "next-auth";

export async function getUser() {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log(session, "session")
    return session;
}
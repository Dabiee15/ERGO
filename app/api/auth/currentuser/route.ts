import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { authAdmin } from "@/lib/dbadmin";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = jwt.verify(session.value, process.env.JWT_SECRET!) as {
      uid: string;
      email: string;
    };

    const userDoc = await authAdmin.firestore.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();

    return NextResponse.json({ 
      user: {
        uid: decoded.uid,
        email: decoded.email,
        companyName: userData?.companyName,
        emailVerified: userData?.emailVerified,
      }
    });
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return NextResponse.json({ user: null });
  }
}
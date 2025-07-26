import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" });
    
    response.cookies.set({
      name: "session",
      value: "",
      maxAge: -1, 
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
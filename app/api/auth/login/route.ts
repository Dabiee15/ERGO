import { auth } from "@/lib/dbclient";
import { signInWithEmailAndPassword } from "firebase/auth";
import jwt from "jsonwebtoken";
import { rateLimiter } from "@/lib/rate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await rateLimiter.consume(ip);

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email not verified. Please check your inbox." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email,
        // Add any additional user data you want to include in the JWT
      },
      process.env.JWT_SECRET!,
      { expiresIn: "72h" }
    );

    const response = NextResponse.json({ 
      user: {
        uid: user.uid,
        email: user.email,
        company: user.companyName
      } 
    });

    response.cookies.set({
      name: "session",
      value: token,
      maxAge: 60 * 60 * 72, // 72 hours
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("🚨 Login API Error:", err);
    
    if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate";
import { auth } from "@/lib/dbclient";
import { authAdmin } from "@/lib/dbadmin";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await rateLimiter.consume(ip);

    const { email, password, companyName } = await req.json();

    if (!email || !password || !companyName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // await authAdmin.firestore.collection("users").doc(user.uid).set({
    //   email,
    //   companyName,
    //   emailVerified: false,
    //   createdAt: new Date().toISOString(),
    // });
    await authAdmin.firestore.collection("users").doc(user.uid).set({
      email,
      companyName,
      emailVerified: false,
      accountId,
      createdAt: new Date().toISOString(),
      onboarding: {
        connectAccount: true | false,
        importFile: true | false,
        completed: true | false
      },

});


    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      handleCodeInApp: true,
    });

    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email,
        companyName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "72h" }
    );

    const response = NextResponse.json({
      message: "User created. Verification email sent.",
      verificationLinkSent: true,
    });

    // Set cookie (optional for signup)
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
    if (err instanceof Error && err.message === "RateLimiter ResError") {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    if (err.code === "auth/email-already-in-use") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message || "Signup failed" }, { status: 500 });
  }
}
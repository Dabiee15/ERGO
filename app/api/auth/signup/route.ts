import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate";
import { auth } from "@/lib/dbclient";
import { authAdmin, dbAdmin } from "@/lib/dbadmin";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      await rateLimiter.consume(ip);
    } catch (rateLimitError) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." }, 
        { status: 429 }
      );
    }

    // Validate input
    const { email, password, companyName } = await req.json();
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Email, password, and company name are required" },
        { status: 400 }
      );
    }

    // Create user
    let user;
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      user = userCred.user;
    } catch (authError: any) {
      if (authError.code === "auth/email-already-in-use") {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Save user data to Firestore
    try {
      await dbAdmin.collection("users").doc(user.uid).set({
        email,
        companyName,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError);
      // Continue even if Firestore fails, but log it
    }

    // Send verification email
    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        handleCodeInApp: true,
      };
      
      await sendEmailVerification(user, actionCodeSettings);
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error("Email verification error:", emailError);
      return NextResponse.json(
        { 
          error: "User created but verification email failed to send",
          verificationLinkSent: false,
          userId: user.uid 
        },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email,
        companyName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "72h" }
    );

    // Set response
    const response = NextResponse.json({
      message: "User created successfully. Verification email sent.",
      verificationLinkSent: true,
      userId: user.uid,
    });

    // Set session cookie
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
    console.error("Unexpected error in signup:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup" },
      { status: 500 }
    );
  }
}
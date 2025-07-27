// import { NextRequest, NextResponse } from "next/server";
// import { updateOnboardingStage } from "@/lib/onboarding";
// import { authAdmin } from "@/lib/dbadmin";
// import jwt from "jsonwebtoken";

// export async function POST(req: NextRequest) {
//   const { code } = await req.json();

//   try {
//     const monoRes = await fetch("https://api.withmono.com/v2/accounts/auth", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "mono-sec-key": process.env.MONO_SECRET_KEY!,
//       },
//       body: JSON.stringify({ code }),
//     });

//     const data = await monoRes.json();

//     if (!monoRes.ok) {
//       return NextResponse.json({ error: data.message || "Mono error" }, { status: monoRes.status });
//     }

//     const accountId = data.id;

//     // Get the user's JWT from the cookies
//     const session = req.cookies.get("session")?.value;

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(session, process.env.JWT_SECRET!) as { uid: string };

//     // Save accountId in Firestore
//     const userRef = authAdmin.firestore.collection("users").doc(decoded.uid);
//     await userRef.update({
//       accountId,
//     });

//     // Update onboarding progress
//     await updateOnboardingStage(decoded.uid, {
//       connectAccount: true,
//     });

//     return NextResponse.json({ accountId });
//   } catch (err: any) {
//     console.error("Exchange error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { updateOnboardingStage } from "@/lib/onboarding";
import { authAdmin, dbAdmin } from "@/lib/dbadmin";
import jwt from "jsonwebtoken";
// Correct cookie access for App Router

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const session = (await import("next/headers")).cookies().get("session")?.value;


  try {
    const monoRes = await fetch("https://api.withmono.com/v2/accounts/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env.MONO_SECRET_KEY!,
      },
      body: JSON.stringify({ code }),
    });

    const data = await monoRes.json();

    if (!monoRes.ok) {
      return NextResponse.json({ error: data.message || "Mono error" }, { status: monoRes.status });
    }

    const accountId = data.id;

    //Correct way to access cookies in App Router
    // const session = cookies().get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(session, process.env.JWT_SECRET!) as { uid: string };

    // Save accountId in Firestore
    const userRef = dbAdmin.collection("users").doc(decoded.uid);
    await userRef.update({
      accountId,
    });

    // Update onboarding progress
    await updateOnboardingStage(decoded.uid, {
      connectAccount: true,
    });

    return NextResponse.json({ accountId });
  } catch (err: any) {
    console.error("Exchange error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// app/api/mono/exchange/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    const monoRes = await fetch("https://api.withmono.com/v2/accounts/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env.MONO_SECRET_KEY!, // Add this in your .env
      },
      body: JSON.stringify({ code }),
    });

    const data = await monoRes.json();

    if (!monoRes.ok) {
      return NextResponse.json({ error: data.message || "Mono error" }, { status: monoRes.status });
    }

    const accountId = data.id;

    // TODO: Save accountId to your DB linked with user info

    return NextResponse.json({ accountId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

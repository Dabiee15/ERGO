// app/api/upload/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { data } = await req.json();

  // Save to your DB here
  console.log("Received data", data.length);

  return NextResponse.json({ success: true });
}

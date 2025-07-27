import { NextRequest, NextResponse } from "next/server";
import { dbclient } from "@/lib/dbclient";
import { authAdmin } from "@/lib/dbadmin";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {  
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { data } = await req.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format - Expected array" },
        { status: 400 }
      );
    }

    const agentsCollectionRef = collection(dbclient, "companies", uid, "agents");
    const batchSize = 500;
    let successfulUploads = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchPromises = batch.map((record) => 
        addDoc(agentsCollectionRef, record)
      );
      await Promise.all(batchPromises);
      successfulUploads += batch.length;
    }

    return NextResponse.json({
      success: true,
      count: successfulUploads
    });

  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Server error",
        code: error.code || "internal_error"
      },
      { status: 500 }
    );
  }
}
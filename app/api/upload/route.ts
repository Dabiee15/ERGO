// import { NextRequest, NextResponse } from "next/server";
// import { dbclient } from "@/lib/dbclient";
// import { authAdmin } from "@/lib/dbadmin";
// import { collection, addDoc } from "firebase/firestore";

// export async function POST(req: NextRequest) {  
//   const authHeader = req.headers.get("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const idToken = authHeader.split("Bearer ")[1];

//   try {
//     const decodedToken = await authAdmin.verifyIdToken(idToken);
//     const uid = decodedToken.uid;

//     const { data } = await req.json();
//     if (!Array.isArray(data)) {
//       return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
//     }

//     const agentsCollectionRef = collection(dbclient, "companies", uid, "agents");

//     const maxUpload = 1000;
//     const sliced = data.slice(0, maxUpload);
//     const promises = sliced.map((agent) => addDoc(agentsCollectionRef, agent));
//     await Promise.all(promises);

//     return NextResponse.json({ success: true, count: sliced.length });
//   } catch (error: any) {
//     console.error("Error verifying session or uploading data:", error);
//     return NextResponse.json({ error: "Unauthorized or failed to upload" }, { status: 401 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { dbclient } from "@/lib/dbclient";
import { authAdmin } from "@/lib/dbadmin";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {  
  // Get the idToken from cookies instead of Authorization header
  const idToken = req.cookies.get("session")?.value;
  
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized - No token found" }, { status: 401 });
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const { data } = await req.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    const agentsCollectionRef = collection(dbclient, "companies", uid, "agents");
    const maxUpload = 1000;
    const sliced = data.slice(0, maxUpload);
    
    const promises = sliced.map((agent) => addDoc(agentsCollectionRef, agent));
    await Promise.all(promises);

    return NextResponse.json({ success: true, count: sliced.length });
  } catch (error: any) {
    console.error("Error verifying session or uploading data:", error);
    return NextResponse.json({ error: "Unauthorized or failed to upload" }, { status: 401 });
  }
}
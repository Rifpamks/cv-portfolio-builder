import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const body = await request.json();
    const { action, collection, docId, data } = body;

    // Security: Only allow operations on the user's own document (and their public profile)
    if (docId !== uid) {
      return NextResponse.json({ error: "Forbidden: Cannot modify other user documents" }, { status: 403 });
    }
    
    // Security: Only allow specific safe collections
    if (collection !== "users" && collection !== "publicProfiles") {
      return NextResponse.json({ error: "Forbidden: Invalid collection" }, { status: 403 });
    }

    const docRef = adminDb.collection(collection).doc(docId);

    if (action === "get") {
      const snap = await docRef.get();
      if (!snap.exists) {
        return NextResponse.json({ exists: false, data: null });
      }
      return NextResponse.json({ exists: true, data: snap.data() });
    }

    if (action === "update" || action === "set") {
      if (action === "update") {
        await docRef.update(data);
      } else {
        await docRef.set(data, { merge: true });
      }

      // Sync specific fields to publicProfiles for public access
      if (collection === "users") {
        const syncData: any = {};
        if (data.profile) syncData.profile = data.profile;
        if (data.portfolio) syncData.portfolio = data.portfolio;
        if (data.blog) syncData.blog = data.blog;
        if (data.experience) syncData.experience = data.experience;
        if (data.education) syncData.education = data.education;
        if (data.skills) syncData.skills = data.skills;

        if (Object.keys(syncData).length > 0) {
          await adminDb.collection("publicProfiles").doc(docId).set(syncData, { merge: true });
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

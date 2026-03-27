import { adminDb } from "@/lib/firebaseAdmin";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // Revalidate the data every 60 seconds (ISR)

export default async function Home() {
  let profileData = null;

  try {
    // Fetch the single admin public profile bypassing security rules
    if (adminDb) {
      const snap = await adminDb.collection("publicProfiles").limit(1).get();
      if (!snap.empty) {
        // Convert to plain object to pass as prop
        profileData = JSON.parse(JSON.stringify(snap.docs[0].data()));
      }
    }
  } catch (error) {
    console.error("Failed to fetch profile remotely via Admin SDK:", error);
  }

  return <HomeClient profileData={profileData} />;
}

import { adminDb } from "@/lib/firebaseAdmin";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // Revalidate the data every 60 seconds (ISR)

export default async function Home() {
  let profileData = null;
  let portfolioData: any[] = [];

  try {
    // Fetch the single admin public profile bypassing security rules
    if (adminDb) {
      const snap = await adminDb.collection("publicProfiles").limit(1).get();
      if (!snap.empty) {
        // Convert to plain object to pass as prop
        const data = snap.docs[0].data();
        profileData = JSON.parse(JSON.stringify(data));
        
        if (data.portfolio && Array.isArray(data.portfolio)) {
           portfolioData = JSON.parse(JSON.stringify(data.portfolio));
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch profile remotely via Admin SDK");
  }

  // Fallback demo projects if none found
  if (portfolioData.length === 0) {
    portfolioData = [
      { id: "1", title: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration and admin dashboard.", imageURL: "", projectURL: "#", tags: ["React", "Node.js", "Stripe"] },
      { id: "2", title: "AI Chat Application", description: "Real-time chat app powered by GPT with conversation history.", imageURL: "", projectURL: "#", tags: ["Next.js", "AI", "WebSocket"] },
      { id: "3", title: "Dashboard Analytics", description: "Data visualization dashboard with real-time updates.", imageURL: "", projectURL: "#", tags: ["Vue", "D3.js", "Firebase"] }
    ];
  }

  return <HomeClient profileData={profileData} portfolioData={portfolioData} />;
}

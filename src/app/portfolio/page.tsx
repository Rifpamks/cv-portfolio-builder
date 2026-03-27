import { adminDb } from "@/lib/firebaseAdmin";
import { motion } from "framer-motion";

export const revalidate = 60; // ISR 60 seconds

export default async function PortfolioPage() {
  let items: any[] = [];

  try {
    if (adminDb) {
      const snap = await adminDb.collection("publicProfiles").limit(1).get();
      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data.portfolio) {
          items = data.portfolio.map((item: any) => ({
            ...item,
            ownerName: data.displayName || "Rifaldi",
          }));
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch portfolio securely:", error);
  }

  // Sample data fallback if empty
  if (items.length === 0) {
    items = [
      { id: "1", title: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration and admin dashboard.", imageURL: "", projectURL: "#", tags: ["React", "Node.js", "Stripe"], ownerName: "Rifaldi" },
      { id: "2", title: "AI Chat Application", description: "Real-time chat app powered by GPT with conversation history.", imageURL: "", projectURL: "#", tags: ["Next.js", "AI", "WebSocket"], ownerName: "Rifaldi" },
    ];
  }

  return (
    <div className="min-h-screen py-24 px-4 bg-[#0F1015] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4 text-white">Portfolio Showcase</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Projects and creations by Rifaldi Adi Pamungkas.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-accent/50 transition-colors">
              <div className="h-48 bg-gradient-to-br from-[#161d49] to-[#0a0f2e] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-5xl">{["🚀", "🤖", "📋", "🎨", "💪", "📊"][i % 6]}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-accent/10 rounded text-accent-light text-xs border border-accent/20">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

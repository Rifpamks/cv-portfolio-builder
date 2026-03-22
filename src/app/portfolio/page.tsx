"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  projectURL: string;
  tags: string[];
  ownerName: string;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const snap = await getDocs(collection(db, "publicProfiles"));
        const allItems: PortfolioItem[] = [];
        snap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.portfolio) {
            data.portfolio.forEach((item: PortfolioItem) => {
              allItems.push({ ...item, ownerName: data.displayName || "Anonymous" });
            });
          }
        });
        setItems(allItems);
      } catch {
        // Use sample data if no public profiles exist
        setItems([
          { id: "1", title: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration and admin dashboard.", imageURL: "", projectURL: "#", tags: ["React", "Node.js", "Stripe"], ownerName: "Sample" },
          { id: "2", title: "AI Chat Application", description: "Real-time chat app powered by GPT with conversation history.", imageURL: "", projectURL: "#", tags: ["Next.js", "AI", "WebSocket"], ownerName: "Sample" },
          { id: "3", title: "Task Management System", description: "Kanban board with drag-and-drop and team collaboration.", imageURL: "", projectURL: "#", tags: ["React", "Firebase", "DnD"], ownerName: "Sample" },
          { id: "4", title: "Portfolio Website", description: "Professional portfolio with blog and contact form.", imageURL: "", projectURL: "#", tags: ["Next.js", "Tailwind", "MDX"], ownerName: "Sample" },
          { id: "5", title: "Mobile Fitness App", description: "Fitness tracking with workout plans and progress charts.", imageURL: "", projectURL: "#", tags: ["React Native", "Firebase", "Charts"], ownerName: "Sample" },
          { id: "6", title: "Social Media Dashboard", description: "Analytics dashboard for social media management.", imageURL: "", projectURL: "#", tags: ["Vue.js", "D3.js", "API"], ownerName: "Sample" },
        ]);
      }
      setLoading(false);
    };
    fetchPortfolios();
  }, []);

  const allTags = ["All", ...Array.from(new Set(items.flatMap((i) => i.tags)))];
  const filtered = filter === "All" ? items : items.filter((i) => i.tags.includes(filter));

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="section-title mb-4">Portfolio Showcase</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Explore amazing projects built by our community.</p>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === tag
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="glass-card-hover overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-48 bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-5xl">{["🚀", "🤖", "📋", "🎨", "💪", "📊"][i % 6]}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-accent/10 rounded text-accent-light text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

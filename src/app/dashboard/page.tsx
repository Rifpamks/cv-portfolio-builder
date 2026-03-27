"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db } from "@/lib/firebase";
import { analyzeCompleteness } from "@/lib/aiRecommender";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeCompleteness> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const userDoc = await adminGetDoc("users", user.uid);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setAnalysis(analyzeCompleteness(data as Parameters<typeof analyzeCompleteness>[0]));
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sections = [
    { key: "profile", label: "Profile", href: "/dashboard/profile", icon: "👤" },
    { key: "education", label: "Education", href: "/dashboard/education", icon: "🎓" },
    { key: "skills", label: "Skills", href: "/dashboard/skills", icon: "🛠️" },
    { key: "experience", label: "Experience", href: "/dashboard/experience", icon: "💼" },
    { key: "portfolio", label: "Portfolio", href: "/dashboard/portfolio", icon: "🎨" },
    { key: "blog", label: "Blog", href: "/dashboard/blog", icon: "📝" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome, <span className="gradient-text">{user?.displayName?.split(" ")[0] || "User"}</span>
        </h1>
        <p className="text-gray-400 mt-1">Manage your CV sections and track your profile completeness.</p>
      </motion.div>

      {/* AI Score Card */}
      {analysis && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🤖</span> AI CV Analysis
            </h2>
            <div className="text-right">
              <span className="text-3xl font-bold gradient-text">{analysis.score}%</span>
              <p className="text-gray-500 text-xs">Completeness</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-navy-900 rounded-full h-3 mb-6">
            <motion.div
              className="bg-gradient-to-r from-accent to-gold rounded-full h-3"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            {analysis.recommendations.slice(0, 4).map((rec, i) => (
              <p key={i} className="text-sm text-gray-400">{rec}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link href={section.href} className="glass-card-hover p-6 block group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{section.icon}</span>
                {analysis?.sections[section.key] && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    analysis.sections[section.key].filled
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {analysis.sections[section.key].score}%
                  </span>
                )}
              </div>
              <h3 className="text-white font-semibold group-hover:text-accent-light transition-colors">
                {section.label}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {analysis?.sections[section.key]?.tip || "Edit this section"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Link href="/dashboard/export" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CV as PDF
        </Link>
      </motion.div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-8">About CVBuilder</h1>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              CVBuilder was created to democratize professional CV and portfolio creation. 
              We believe everyone deserves a stunning, professional presence that showcases their 
              unique skills and experience — without needing design expertise or expensive tools.
            </p>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Multi-Section CV", desc: "Complete data management for education, skills, experience, portfolio, and blog posts." },
                { title: "Secure & Private", desc: "Google authentication with PIN protection. Your data is stored securely in Firebase." },
                { title: "AI-Powered Tips", desc: "Smart recommendations to help you build a more complete and effective CV." },
                { title: "PDF Export", desc: "Generate beautifully formatted PDF documents from your CV data instantly." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-light font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Firebase Auth", "Firestore", "Firebase Storage"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent-light text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

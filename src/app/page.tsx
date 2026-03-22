"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb w-96 h-96 bg-accent top-20 -left-20" />
      <div className="orb w-80 h-80 bg-gold top-60 right-10" style={{ animationDelay: "3s" }} />
      <div className="orb w-64 h-64 bg-accent-dark bottom-20 left-1/3" style={{ animationDelay: "5s" }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent-light text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Dynamic CV & Portfolio Builder
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Build Your
            <br />
            <span className="gradient-text">Professional CV</span>
            <br />
            in Minutes
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Create stunning, multi-section CVs and portfolios with real-time sync,
            AI-powered recommendations, and one-click PDF export.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/login" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Everything you need to build a standout professional profile.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔐", title: "Secure Authentication", desc: "Google sign-in with extra PIN protection for your dashboard." },
              { icon: "📄", title: "Complete CV Sections", desc: "Profile, Education, Skills, Experience, Portfolio, and Blog — all in one place." },
              { icon: "📥", title: "PDF Export", desc: "Download your CV as a beautifully formatted PDF anytime." },
              { icon: "🤖", title: "AI Recommendations", desc: "Get smart suggestions to improve your CV completeness score." },
              { icon: "🔄", title: "Real-time Sync", desc: "All changes saved instantly to the cloud via Firebase." },
              { icon: "🎨", title: "Modern Design", desc: "Dark navy theme with smooth animations and responsive layouts." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card-hover p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-gold/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Build Your CV?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join now and create a professional CV that stands out from the crowd.
              </p>
              <Link href="/login" className="btn-primary text-lg px-8 py-4 inline-block">
                Start Building Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

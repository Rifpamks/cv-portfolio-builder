"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Project" }
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#hero");

  // Keep track of scroll position manually instead of Nextjs usePathname for single page
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      let current = "";
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element crosses the middle of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      });
      if (current) setActiveHash(`#${current}`);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1015]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-xl text-white group-hover:text-accent-light transition-colors">
              <span className="text-accent">Rifaldi</span>Creative
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    activeHash === link.href || (pathname === '/' && activeHash === '' && link.href === '#hero')
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {(activeHash === link.href || (pathname === '/' && activeHash === '' && link.href === '#hero')) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                  {link.label}
                </a>
              ))}
            </div>

            <a href="mailto:contact@rifaldicreative.com" className="hidden lg:flex px-6 py-2 border border-accent/30 hover:border-accent text-accent-light hover:text-white rounded-lg text-sm font-medium transition-colors items-center justify-center">
              Contact Me
            </a>

            {/* Auth Dashboard (Visible only to owner) */}
            {user && !isDashboard && (
              <Link href="/dashboard" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors font-medium">
                Dashboard
              </Link>
            )}
            {user && (
              <button onClick={signOut} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Logout
              </button>
            )}
            {!user && pathname === "/" && (
               <Link href="/login" className="px-3 py-2 text-xs text-gray-700/40 hover:text-gray-500 transition-colors">
                 admin
               </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Link href="/dashboard" className="text-xs font-semibold bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg text-accent-light">CMS</Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0F1015]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeHash === link.href
                      ? "text-white bg-accent/20 border border-accent/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="mailto:contact@rifaldicreative.com"
                onClick={() => setMobileOpen(false)}
                className="block mt-4 px-4 py-3 bg-accent text-white text-center rounded-lg text-sm font-medium"
              >
                Contact Me
              </a>
              {!user && pathname === "/" && (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block mt-2 px-4 py-2 text-xs text-gray-700/40 hover:text-gray-500 text-center transition-colors">
                  admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

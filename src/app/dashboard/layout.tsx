"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db } from "@/lib/firebase";
import Link from "next/link";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/education", label: "Education", icon: "🎓" },
  { href: "/dashboard/skills", label: "Skills", icon: "🛠️" },
  { href: "/dashboard/experience", label: "Experience", icon: "💼" },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: "🎨" },
  { href: "/dashboard/blog", label: "Blog", icon: "📝" },
  { href: "/dashboard/export", label: "Export PDF", icon: "📥" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pinVerified, setPinVerified] = useState(false);
  const [pinSet, setPinSet] = useState<boolean | null>(null);
  const [checkingPin, setCheckingPin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      const checkPin = async () => {
        try {
          const userDoc = await adminGetDoc("users", user.uid);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setPinSet(data.pinSet || false);
            if (!data.pinSet && pathname !== "/dashboard/pin") {
              router.push("/dashboard/pin");
            }
          }
        } catch (error) {
          console.warn("Gracefully handled fetching pin error: ", error);
        } finally {
          setCheckingPin(false);
        }
      };
      checkPin();
    }
  }, [user, loading, router, pathname]);

  // Check session storage for PIN verification
  useEffect(() => {
    const verified = sessionStorage.getItem("pinVerified");
    if (verified === "true") setPinVerified(true);
  }, []);

  if (loading || checkingPin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Show PIN page without sidebar
  if (pathname === "/dashboard/pin") return <>{children}</>;

  // If PIN is set but not verified in this session, redirect to PIN entry
  if (pinSet && !pinVerified && pathname !== "/dashboard/pin") {
    if (typeof window !== "undefined") {
      const verified = sessionStorage.getItem("pinVerified");
      if (verified !== "true") {
        router.push("/dashboard/pin");
        return null;
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/25"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-navy-950/90 backdrop-blur-xl border-r border-white/5 z-40 transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-3 py-4 mb-4">
            {user.photoURL && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-accent/30" />
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.displayName}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-accent/20 text-white border border-accent/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}

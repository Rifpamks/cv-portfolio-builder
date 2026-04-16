import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Rifaldi-Portfolio-Builder",
  description: "Professional CV and portfolio with ease. Powered by Next.js, CSS, vercel & Firebase.",
  keywords: "CV builder, portfolio, resume, professional profile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

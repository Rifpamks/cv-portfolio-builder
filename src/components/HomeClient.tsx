"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomeClient({ profileData }: { profileData: any }) {
  const fullName = profileData?.profile?.fullName || "Rifaldi Adi Pamungkas";
  const title = profileData?.profile?.title || "IT Enthusiast";
  const summary = profileData?.profile?.summary || `I'm a person who has a keen interest in technology and development. I focus on creating attractive and highly functional systems to develop professional products. Currently, I'm enhancing my skills to build dynamic applications and innovative digital solutions.`;
  // If the user has uploaded a photo to Firebase, use it. Otherwise placeholder.
  const photoURL = profileData?.profile?.photoURL || "/profile.jpg";

  return (
    <div className="min-h-screen bg-[#0F1015] text-white pt-24 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-medium text-gray-300 mb-2">Hello Buds</h2>
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-4">
              I am <span className="text-accent">{fullName}</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">{title}</p>
          </div>

          <div className="w-16 h-0.5 bg-gray-600 mt-2 mb-4"></div>

          <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-lg">
            {summary}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-all group shadow-lg shadow-accent/20">
              <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CV
            </button>
            <Link href="/about" className="px-8 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-all">
              More
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 mt-16 pt-8">
            <span className="text-sm font-semibold text-gray-300">Find Me On</span>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'whatsapp', 'linkedin'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:border-accent transition-all hover:-translate-y-1">
                  {/* Simplistic Icons based on type */}
                  {social === 'facebook' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>}
                  {social === 'instagram' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                  {social === 'whatsapp' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.005-5.074 4.138-9.206 9.214-9.206 2.459.002 4.773.961 6.513 2.7 1.738 1.739 2.693 4.053 2.691 6.514-.004 5.076-4.14 9.208-9.215 9.206z"/></svg>}
                  {social === 'linkedin' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Content / Image Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[600px] flex items-center justify-center lg:justify-end"
        >
          {/* Mockup's distinct purple blob background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-gradient-to-br from-accent to-[#2E1A6E] rounded-[40px] md:rounded-[80px] rounded-br-none -z-10 rotate-6 skew-y-3 opacity-80" />
          
          {photoURL !== "/profile.jpg" ? (
            <div className="relative w-[360px] h-[480px] rounded-[40px] overflow-hidden shadow-2xl z-10">
              <Image 
                src={photoURL} 
                alt={fullName} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
             <div className="relative w-[360px] h-[480px] bg-gray-800 rounded-[40px] overflow-hidden shadow-2xl z-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
               <span className="text-4xl mb-4">📸</span>
               <p className="text-gray-400 text-sm text-center px-6">Upload your profile photo in the CMS Dashboard to replace this placeholder.</p>
             </div>
          )}

          {/* Floating UI Elements matching mockup */}
          <div className="absolute top-10 right-10 text-accent/50 text-4xl font-light scale-150 animate-pulse">+</div>
          <div className="absolute bottom-32 -right-8 w-12 h-12 border border-accent/40 rounded-full animate-bounce" />
          <div className="absolute top-1/4 -left-4 w-4 h-4 bg-accent/60 rounded-full blur-[2px]" />
        </motion.div>
      </div>
    </div>
  );
}

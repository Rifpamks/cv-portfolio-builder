"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomeClient({ profileData, portfolioData }: { profileData: any, portfolioData: any[] }) {
  const fullName = profileData?.profile?.fullName || "Rifaldi Adi Pamungkas";
  const title = profileData?.profile?.title || "IT Enthusiast";
  const summary = profileData?.profile?.summary || `I'm a person who has a keen interest in technology and development. I focus on creating attractive and highly functional systems to develop professional products. Currently, I'm enhancing my skills to build dynamic applications and innovative digital solutions.`;
  const photoURL = profileData?.profile?.photoURL || "/profile.jpg";

  // Dynamic values
  const whatsapp = profileData?.profile?.whatsapp || null;
  const instagram = profileData?.profile?.instagram || null;
  const linkedin = profileData?.profile?.linkedin || null;

  // About Data
  const defaultTechStack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Firebase Auth", "Firestore", "Firebase Storage"];
  const techStack = profileData?.skills && profileData.skills.length > 0
    ? profileData.skills.map((s: any) => s.name || s)
    : defaultTechStack;

  const experiences = profileData?.experience || [];
  const educations = profileData?.education || [];

  return (
    <div className="min-h-screen bg-[#0F1015] text-white pt-24 relative selection:bg-accent/30 selection:text-white pb-24">
      {/* Global Background Shapes */}
      <div className="fixed top-1/4 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2" />

      {/* --- HERO SECTION --- */}
      <section id="hero" className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[calc(100vh-6rem)] relative pt-10 lg:pt-0 pb-20 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-6 order-2 lg:order-1 text-center lg:text-left z-10"
        >
          <div>
            <h2 className="text-lg md:text-2xl font-medium text-gray-300 mb-2">Hello Buds</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-4 tracking-tight">
              I am <span className="text-accent">{fullName}</span>
            </h1>
            <p className="text-accent-light font-medium tracking-wide text-base md:text-lg">{title}</p>
          </div>

          <div className="w-16 h-0.5 bg-gray-600 mt-2 mb-4 mx-auto lg:mx-0"></div>

          <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-lg mx-auto lg:mx-0">
            {summary}
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <a href="#portfolio" className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-all group shadow-lg shadow-accent/20 text-sm md:text-base">
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              View Projects
            </a>
            <a href="#about" className="px-8 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-all text-sm md:text-base">
              More
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mt-12 lg:mt-16 pt-8 border-t border-white/5 lg:border-none w-full lg:w-auto">
            <span className="text-sm font-semibold text-gray-300">Find Me On</span>
            <div className="flex gap-4">
              {['instagram', 'whatsapp', 'linkedin'].map((social) => {
                let link = "#";
                if (social === 'whatsapp' && whatsapp) link = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
                if (social === 'instagram' && instagram) link = instagram;
                if (social === 'linkedin' && linkedin) link = linkedin;

                return (
                  <a key={social} href={link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:border-accent transition-all hover:-translate-y-1">
                    {social === 'instagram' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
                    {social === 'whatsapp' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.005-5.074 4.138-9.206 9.214-9.206 2.459.002 4.773.961 6.513 2.7 1.738 1.739 2.693 4.053 2.691 6.514-.004 5.076-4.14 9.208-9.215 9.206z" /></svg>}
                    {social === 'linkedin' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full flex items-center justify-center lg:justify-end order-1 lg:order-2 mt-8 lg:mt-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[340px] md:w-[320px] md:h-[400px] lg:w-[400px] lg:h-[500px] bg-gradient-to-br from-accent to-[#2E1A6E] rounded-[30px] lg:rounded-[40px] md:rounded-[80px] lg:rounded-br-none -z-10 rotate-6 skew-y-3 opacity-80" />

          {photoURL !== "/profile.jpg" ? (
            <div className="relative w-[260px] h-[320px] md:w-[300px] md:h-[380px] lg:w-[360px] lg:h-[480px] rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-xl ring-1 ring-white/10 z-10 group">
              <Image
                src={photoURL}
                alt={fullName}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
            </div>
          ) : (
            <div className="relative w-[260px] h-[320px] md:w-[300px] md:h-[380px] lg:w-[360px] lg:h-[480px] bg-gray-800/80 backdrop-blur-sm rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-xl ring-1 ring-white/10 z-10 flex flex-col items-center justify-center border border-dashed border-gray-600">
              <span className="text-6xl mb-4 text-gray-700">📸</span>
            </div>
          )}

          <div className="absolute top-4 lg:top-10 right-4 lg:right-10 text-accent/50 text-4xl font-light scale-150 animate-pulse">+</div>
          <div className="absolute -bottom-4 lg:bottom-16 -right-4 lg:-right-8 w-10 h-10 lg:w-12 lg:h-12 border border-accent/40 rounded-full animate-bounce" />
          <div className="absolute top-1/4 -left-2 lg:-left-4 w-3 h-3 lg:w-4 lg:h-4 bg-accent/60 rounded-full blur-[2px]" />
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 border-t border-white/5 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">About <span className="text-accent">Me</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            A brief overview of my professional journey, highlighting my experience in system support engineer, cloud support infrastructure, and maintaining server high-availability environments. Passionate about building reliable systems and delivering seamless user experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-accent/40 transition-colors">
            <h3 className="text-2xl font-bold text-white relative z-10">My Overview</h3>
            <p className="text-gray-400 leading-relaxed relative z-10 whitespace-pre-wrap">
              {profileData?.profile?.overview || summary}
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Core Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent-light text-sm shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {experiences.length > 0 && (
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full md:col-span-1 hover:border-accent/40 transition-colors group">
              <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp: any, i: number) => (
                  <div key={i} className="border-l-2 border-accent/30 pl-4 py-1 group-hover:border-accent transition-colors">
                    <h4 className="text-white font-medium text-lg">{exp.company}</h4>
                    <p className="text-accent-light text-sm">{exp.position}</p>
                    <p className="text-gray-500 text-xs mt-1 mb-2">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {educations.length > 0 && (
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full md:col-span-1 hover:border-gold/40 transition-colors group">
              <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
              <div className="space-y-6">
                {educations.map((edu: any, i: number) => (
                  <div key={i} className="border-l-2 border-gold/30 pl-4 py-1 group-hover:border-gold transition-colors">
                    <h4 className="text-white font-medium text-lg">{edu.institution}</h4>
                    <p className="text-gold-light text-sm">{edu.degree} in {edu.field}</p>
                    <p className="text-gray-500 text-xs mt-1 mb-2">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </p>
                    {edu.description && (
                      <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- PORTFOLIO SECTION --- */}
      <section id="portfolio" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">My <span className="text-accent">Projects</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">A selection of my recent works and creations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData && portfolioData.length > 0 ? (
            portfolioData.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-accent/50 transition-colors relative"
              >
                <div className="h-56 bg-gradient-to-br from-[#161d49] to-[#0a0f2e] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{["🚀", "🤖", "📋", "🎨", "💪", "📊"][i % 6]}</span>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-accent/10 rounded text-accent-light text-xs font-medium border border-accent/20">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No projects added yet. Check back soon!
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db } from "@/lib/firebase";

interface CvData {
  profile?: { fullName: string; title: string; email: string; phone: string; location: string; summary: string; };
  education?: Array<{ institution: string; degree: string; field: string; startDate: string; endDate: string; gpa: string; }>;
  skills?: Array<{ name: string; level: number; category: string; }>;
  experience?: Array<{ company: string; position: string; startDate: string; endDate: string; current: boolean; description: string; }>;
  portfolio?: Array<{ title: string; description: string; projectURL: string; tags: string[]; }>;
}

export default function ExportPage() {
  const { user } = useAuth();
  const [data, setData] = useState<CvData>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await adminGetDoc("users", user.uid);
      if (snap.exists()) setData(snap.data() as CvData);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleDownload = async () => {
    if (!cvRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -(pdfHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${data.profile?.fullName || "CV"}_Resume.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    }
    setGenerating(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Export CV</h1>
        <button onClick={handleDownload} disabled={generating} className="btn-primary flex items-center gap-2">
          {generating ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Download PDF</>
          )}
        </button>
      </motion.div>

      {/* CV Preview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="glass-card p-2 overflow-auto">
          <div ref={cvRef} className="bg-white text-gray-900 p-8 md:p-12 max-w-[210mm] mx-auto" style={{ minHeight: "297mm", fontFamily: "Inter, sans-serif" }}>
            {/* Header */}
            <div className="border-b-2 border-indigo-600 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{data.profile?.fullName || "Your Name"}</h1>
              <p className="text-lg text-indigo-600 font-medium mt-1">{data.profile?.title || "Professional Title"}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {data.profile?.email && <span>📧 {data.profile.email}</span>}
                {data.profile?.phone && <span>📱 {data.profile.phone}</span>}
                {data.profile?.location && <span>📍 {data.profile.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {data.profile?.summary && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wider border-b border-gray-200 pb-1">Professional Summary</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{data.profile.summary}</p>
              </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">Work Experience</h2>
                {data.experience.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <span className="text-xs text-gray-500">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    <p className="text-indigo-600 text-sm">{exp.company}</p>
                    {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">Education</h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                      <span className="text-xs text-gray-500">{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <p className="text-sm text-gray-600">{edu.degree} in {edu.field} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio */}
            {data.portfolio && data.portfolio.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-200 pb-1">Projects</h2>
                {data.portfolio.map((proj, i) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                    <p className="text-gray-600 text-sm">{proj.description}</p>
                    {proj.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">{proj.tags.map((t) => <span key={t} className="text-xs text-indigo-600">#{t}</span>)}</div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: "", title: "", email: "", phone: "", location: "", summary: "", photoURL: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await adminGetDoc("users", user.uid);
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          fullName: d.profile?.fullName || d.displayName || "",
          title: d.profile?.title || "",
          email: d.profile?.email || d.email || "",
          phone: d.profile?.phone || "",
          location: d.profile?.location || "",
          summary: d.profile?.summary || "",
          photoURL: d.profile?.photoURL || d.photoURL || "",
        });
      }
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await adminUpdateDoc("users", user.uid, { profile: form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-white mb-6">Personal Info</h1>
      </motion.div>
      <motion.div className="glass-card p-6 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {[
          { key: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
          { key: "title", label: "Professional Title", type: "text", placeholder: "Full-Stack Developer" },
          { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
          { key: "phone", label: "Phone", type: "tel", placeholder: "+62 812-3456-7890" },
          { key: "location", label: "Location", type: "text", placeholder: "Jakarta, Indonesia" },
          { key: "photoURL", label: "Photo URL", type: "url", placeholder: "https://..." },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <input
              type={type}
              value={(form as unknown as Record<string, string>)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="input-field"
              placeholder={placeholder}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Professional Summary</label>
          <textarea
            rows={4}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="input-field resize-none"
            placeholder="Brief overview of your professional background..."
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {saved && <span className="text-green-400 text-sm animate-fade-in">✓ Saved successfully!</span>}
        </div>
      </motion.div>
    </div>
  );
}

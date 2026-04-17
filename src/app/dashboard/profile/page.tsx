"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    fullName: "", title: "", email: "", phone: "", location: "", summary: "", overview: "", photoURL: "",
    whatsapp: "", instagram: "", linkedin: ""
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
          overview: d.profile?.overview || "",
          photoURL: d.profile?.photoURL || d.photoURL || "",
          whatsapp: d.profile?.whatsapp || "",
          instagram: d.profile?.instagram || "",
          linkedin: d.profile?.linkedin || "",
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/images/profile_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const updatedForm = { ...form, photoURL: url };
      setForm(updatedForm);
      
      // Auto-save the new photo URL to the database
      setSaving(true);
      await adminUpdateDoc("users", user.uid, { profile: updatedForm });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setSaving(false);
    } catch (err) {
      console.error("Photo upload failed", err);
      alert("Failed to upload photo.");
      setSaving(false);
    }
    setUploadingImage(false);
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
          { key: "whatsapp", label: "WhatsApp (e.g. 62812...)", type: "text", placeholder: "628..." },
          { key: "instagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
          { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/..." },
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Profile Photo (Upload from Device)</label>
          <div className="flex items-center gap-4">
            {form.photoURL && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photoURL} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-white/20" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingImage}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-accent/20 file:text-accent-light hover:file:bg-accent/30"
            />
            {uploadingImage && <span className="text-xs text-gray-400 animate-pulse">Uploading...</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Home Hero Description</label>
          <textarea
            rows={3}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="input-field resize-none"
            placeholder="Description below your name on the home page..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">My Overview (About Me Page)</label>
          <textarea
            rows={5}
            value={form.overview}
            onChange={(e) => setForm({ ...form, overview: e.target.value })}
            className="input-field resize-none"
            placeholder="Detailed overview for the About Me section..."
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

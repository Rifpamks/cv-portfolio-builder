"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Education {
  id: string; institution: string; degree: string; field: string; startDate: string; endDate: string; gpa: string;
}

export default function EducationPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Education | null>(null);
  const [saving, setSaving] = useState(false);

  const empty: Education = { id: "", institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().education) setItems(snap.data().education);
    };
    fetch();
  }, [user]);

  const save = async (list: Education[]) => {
    if (!user) return;
    setSaving(true);
    await updateDoc(doc(db, "users", user.uid), { education: list });
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated: Education[];
    if (editing.id) {
      updated = items.map((i) => (i.id === editing.id ? editing : i));
    } else {
      updated = [...items, { ...editing, id: Date.now().toString() }];
    }
    setItems(updated);
    await save(updated);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    await save(updated);
  };

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Education</h1>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm px-4 py-2">+ Add</button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {editing && (
          <motion.div className="glass-card p-6 mb-6 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {[
              { key: "institution", label: "Institution", placeholder: "University of Indonesia" },
              { key: "degree", label: "Degree", placeholder: "Bachelor's" },
              { key: "field", label: "Field of Study", placeholder: "Computer Science" },
              { key: "gpa", label: "GPA", placeholder: "3.8/4.0" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input type="text" value={(editing as unknown as Record<string, string>)[key]} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="input-field" placeholder={placeholder} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                <input type="month" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                <input type="month" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.id} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-semibold">{item.institution}</h3>
                <p className="text-accent-light text-sm">{item.degree} — {item.field}</p>
                <p className="text-gray-500 text-xs mt-1">{item.startDate} → {item.endDate} {item.gpa && `• GPA: ${item.gpa}`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(item)} className="text-gray-400 hover:text-white transition-colors text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-gray-500 text-center py-8">No education entries yet. Click &quot;Add&quot; to get started.</p>
        )}
      </div>
    </div>
  );
}

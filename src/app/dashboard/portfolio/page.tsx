"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PortfolioItem {
  id: string; title: string; description: string; imageURL: string; projectURL: string; tags: string[];
}

export default function PortfolioDashPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const empty: PortfolioItem = { id: "", title: "", description: "", imageURL: "", projectURL: "", tags: [] };

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().portfolio) setItems(snap.data().portfolio);
    };
    fetch();
  }, [user]);

  const save = async (list: PortfolioItem[]) => {
    if (!user) return;
    setSaving(true);
    await updateDoc(doc(db, "users", user.uid), { portfolio: list });
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated: PortfolioItem[];
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

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Portfolio</h1>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm px-4 py-2">+ Add</button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {editing && (
          <motion.div className="glass-card p-6 mb-6 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {[
              { key: "title", label: "Project Title", placeholder: "My Awesome Project" },
              { key: "projectURL", label: "Project URL", placeholder: "https://..." },
              { key: "imageURL", label: "Image URL", placeholder: "https://..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input type="text" value={(editing as unknown as Record<string, string>)[key]} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="input-field" placeholder={placeholder} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field resize-none" placeholder="Describe your project..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {editing.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-accent/20 text-accent-light rounded text-xs flex items-center gap-1">
                    {tag}
                    <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, idx) => idx !== i) })} className="hover:text-red-400">✕</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="input-field flex-1" placeholder="Add tag..." />
                <button onClick={addTag} className="btn-secondary text-sm px-3 py-2">Add</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                {item.projectURL && <a href={item.projectURL} target="_blank" rel="noopener noreferrer" className="text-accent-light text-xs hover:underline mt-1 block">{item.projectURL}</a>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag) => (<span key={tag} className="px-2 py-0.5 bg-accent/10 rounded text-accent-light text-xs">{tag}</span>))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditing(item)} className="text-gray-400 hover:text-white text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-gray-500 text-center py-8">No portfolio items yet. Click &quot;Add&quot; to showcase your work.</p>
        )}
      </div>
    </div>
  );
}

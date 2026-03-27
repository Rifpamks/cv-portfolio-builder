"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";
import { db } from "@/lib/firebase";

interface Skill { id: string; name: string; level: number; category: string; }

const categories = ["Frontend", "Backend", "Database", "DevOps", "Design", "Mobile", "Other"];

export default function SkillsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await adminGetDoc("users", user.uid);
      if (snap.exists() && snap.data().skills) setItems(snap.data().skills);
    };
    fetch();
  }, [user]);

  const save = async (list: Skill[]) => {
    if (!user) return;
    setSaving(true);
    await adminUpdateDoc("users", user.uid, { skills: list });
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated: Skill[];
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

  const grouped = categories.reduce((acc, cat) => {
    const skills = items.filter((s) => s.category === cat);
    if (skills.length > 0) acc[cat] = skills;
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Skills</h1>
        <button onClick={() => setEditing({ id: "", name: "", level: 3, category: "Frontend" })} className="btn-primary text-sm px-4 py-2">+ Add</button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {editing && (
          <motion.div className="glass-card p-6 mb-6 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Skill Name</label>
              <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field" placeholder="React.js" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input-field">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Proficiency ({editing.level}/5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setEditing({ ...editing, level: n })}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${n <= editing.level ? "bg-accent text-white" : "bg-navy-900 text-gray-500 hover:bg-navy-800"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, skills]) => (
            <div key={cat}>
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((s) => (
                  <motion.div key={s.id} className="glass-card p-4 flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div>
                      <p className="text-white font-medium">{s.name}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div key={n} className={`w-4 h-1.5 rounded-full ${n <= s.level ? "bg-accent" : "bg-navy-800"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(s)} className="text-gray-400 hover:text-white text-xs">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !editing && <p className="text-gray-500 text-center py-8">No skills yet. Click &quot;Add&quot; to add your first skill.</p>
      )}
    </div>
  );
}

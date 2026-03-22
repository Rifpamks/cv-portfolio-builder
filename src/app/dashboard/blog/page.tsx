"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string; title: string; content: string; excerpt: string; publishedAt: string; tags: string[];
}

export default function BlogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const empty: BlogPost = { id: "", title: "", content: "", excerpt: "", publishedAt: new Date().toISOString().split("T")[0], tags: [] };

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().blog) setItems(snap.data().blog);
    };
    fetch();
  }, [user]);

  const save = async (list: BlogPost[]) => {
    if (!user) return;
    setSaving(true);
    await updateDoc(doc(db, "users", user.uid), { blog: list });
    setSaving(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated: BlogPost[];
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
        <h1 className="text-2xl font-display font-bold text-white">Blog Posts</h1>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm px-4 py-2">+ New Post</button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {editing && (
          <motion.div className="glass-card p-6 mb-6 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input-field" placeholder="How I Learned React in 30 Days" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
              <input type="text" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="input-field" placeholder="Brief summary..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
              <textarea rows={8} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="input-field resize-none font-mono text-sm" placeholder="Write your blog post content here..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Publish Date</label>
              <input type="date" value={editing.publishedAt} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm px-4 py-2">{saving ? "Saving..." : "Publish"}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.id} className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.excerpt || item.content.substring(0, 120)}</p>
                <p className="text-gray-500 text-xs mt-2">{item.publishedAt}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setEditing(item)} className="text-gray-400 hover:text-white text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && !editing && (
          <p className="text-gray-500 text-center py-8">No blog posts yet. Click &quot;New Post&quot; to write your first article.</p>
        )}
      </div>
    </div>
  );
}

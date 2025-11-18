"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Palette, Eye, Save, Loader2 } from "lucide-react";

export default function MenuSettings() {
  const [theme, setTheme] = useState("minimalist");
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setViews(data.views || 0);
        setTheme(data.theme || "minimalist");
      }
    });
    return () => unsub();
  }, []);

  const handleSaveTheme = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "general"), { theme }, { merge: true });
      alert("Tema berhasil disimpan!");
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan tema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-1 gap-6'>
      {/* Analytics */}
      <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm'>
        <h3 className='text-lg font-bold mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100'>
          <Eye className='w-5 h-5 text-blue-500' /> Analytics
        </h3>
        <div className='flex items-end gap-2'>
          <span className='text-4xl font-bold text-zinc-900 dark:text-zinc-100'>
            {views}
          </span>
          <span className='text-zinc-500 mb-1 text-sm'>
            x Dilihat Pelanggan
          </span>
        </div>
      </div>

      {/* Theme Selector */}
      <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm'>
        <h3 className='text-lg font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100'>
          <Palette className='w-5 h-5 text-purple-500' /> Tampilan Menu
        </h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div
              onClick={() => setTheme("minimalist")}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                theme === "minimalist"
                  ? "border-black bg-zinc-50"
                  : "border-zinc-100 hover:border-zinc-200"
              }`}
            >
              <div className='h-8 bg-zinc-200 rounded mb-2'></div>
              <p className='text-center font-medium text-xs text-zinc-600'>
                Minimalist
              </p>
            </div>
            <div
              onClick={() => setTheme("colorful")}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                theme === "colorful"
                  ? "border-orange-500 bg-orange-50"
                  : "border-zinc-100 hover:border-zinc-200"
              }`}
            >
              <div className='h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded mb-2'></div>
              <p className='text-center font-medium text-xs text-zinc-600'>
                Colorful
              </p>
            </div>
          </div>
          <Button
            onClick={handleSaveTheme}
            disabled={loading}
            className='w-full bg-black text-white'
          >
            {loading ? (
              <Loader2 className='animate-spin mr-2' />
            ) : (
              <Save className='mr-2 w-4 h-4' />
            )}
            Simpan Tampilan
          </Button>
        </div>
      </div>
    </div>
  );
}

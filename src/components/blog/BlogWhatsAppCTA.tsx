"use client";

import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";

interface Props {
  blogTitle: string;
  blogSlug: string;
}

export function BlogWhatsAppCTA({ blogTitle, blogSlug }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919999999999";
    const message = `Hi, I read your blog "${blogTitle}". Please suggest best areas in Indore under my budget.`;
    const url = `https://wa.me/${number.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`;

    try {
      const key = "indore_blog_wa_clicks";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ blog: blogSlug, title: blogTitle, time: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing.slice(-20)));
    } catch {}

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-fade-up">
      <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 text-white shadow-lg shadow-emerald-900/20 backdrop-blur-sm">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <MessageSquare size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">Get Property Suggestions on WhatsApp</p>
          <p className="text-xs text-white/80 truncate">Expert recommendations for your budget</p>
        </div>

        <button
          onClick={handleClick}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 active:scale-95"
        >
          Enquire Now
        </button>
      </div>
    </div>
  );
}

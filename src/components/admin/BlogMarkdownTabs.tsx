"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdownTabs({
  name = "content",
  initialContent = "",
  value,
  onValueChange
}: {
  name?: string;
  initialContent?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [internal, setInternal] = useState(initialContent);
  const controlled = value !== undefined;
  const content = controlled ? value : internal;
  const setContent = (v: string) => {
    if (controlled) onValueChange?.(v);
    else setInternal(v);
  };

  return (
    <div className="col-span-full space-y-2">
      <div className="flex gap-2 text-sm">
        <button type="button" className={`rounded-full px-3 py-1 ${tab === "edit" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border"}`} onClick={() => setTab("edit")}>
          Markdown
        </button>
        <button type="button" className={`rounded-full px-3 py-1 ${tab === "preview" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border"}`} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>
      {tab === "edit" ? (
        <textarea
          name={controlled ? undefined : name}
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="focus-ring w-full rounded-xl border px-3 py-2 font-mono text-sm dark:bg-slate-950"
          placeholder="Write markdown…"
        />
      ) : (
        <div className="prose prose-sm max-w-none rounded-xl border bg-white/80 p-4 dark:prose-invert dark:bg-slate-950/80">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Nothing to preview*"}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

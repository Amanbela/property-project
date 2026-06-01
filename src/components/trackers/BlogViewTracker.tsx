"use client";

import { useEffect } from "react";
import { trackBlogView } from "@/lib/analytics";

export function BlogViewTracker({ blogSlug }: { blogSlug: string }) {
  useEffect(() => {
    trackBlogView(blogSlug);
  }, [blogSlug]);
  return null;
}

"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md space-y-4 rounded-3xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Secure access to the CMS dashboard.</p>
        <input
          className="focus-ring w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="focus-ring w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/70"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-white dark:text-slate-900"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

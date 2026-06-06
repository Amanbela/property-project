"use client";

export default function EditBlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Blog edit page error:", error);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load blog editor
        </h2>
        <p className="text-sm text-slate-500">
          {error.message || "A server-side exception occurred."}
        </p>
        <p className="text-xs text-slate-400">
          Digest: {error.digest ?? "N/A"}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

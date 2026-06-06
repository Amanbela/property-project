"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Eye, Code } from "lucide-react";

type JsonImportState = "idle" | "validating" | "valid" | "invalid" | "saving" | "saved" | "error";

interface FieldPreviewProps {
  label: string;
  value: unknown;
  indent?: boolean;
}

function FieldPreview({ label, value, indent }: FieldPreviewProps) {
  const display = (v: unknown): string => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (typeof v === "string" && !v) return "—";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  return (
    <div className={`${indent ? "ml-4" : ""} flex items-start gap-2 py-1.5`}>
      <span className="text-xs font-medium text-slate-500 w-40 shrink-0 truncate">{label}</span>
      <span className="text-xs text-slate-800">{display(value)}</span>
    </div>
  );
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function renderPreview(data: Record<string, unknown>, depth = 0): React.ReactNode[] {
  const skipFields = new Set(["_id", "createdAt", "updatedAt", "gallery", "images", "featuredImage", "logo", "profileImage"]);
  const entries: React.ReactNode[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (skipFields.has(key)) continue;
    if (isObject(value) && depth === 0) {
      entries.push(
        <div key={key} className="border-t border-slate-100 pt-2 mt-1">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{key}</span>
          {renderPreview(value, depth + 1)}
        </div>
      );
    } else if (Array.isArray(value) && value.length > 0 && isObject(value[0])) {
      entries.push(
        <div key={key} className="border-t border-slate-100 pt-2 mt-1">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{key} ({value.length})</span>
          {value.slice(0, 3).map((item, i) => (
            <div key={i} className="ml-4 mt-1 p-2 bg-slate-50 rounded-lg text-xs text-slate-600">
              {JSON.stringify(item).substring(0, 120)}
            </div>
          ))}
          {value.length > 3 && <p className="ml-4 text-xs text-slate-400 mt-1">… and {value.length - 3} more</p>}
        </div>
      );
    } else {
      entries.push(<FieldPreview key={key} label={key} value={value} />);
    }
  }

  return entries;
}

interface JsonImportTabProps {
  schema: { safeParse: (data: unknown) => { success: boolean; error?: { flatten: () => { fieldErrors: Record<string, string[]> }; message?: string }; data?: unknown } };
  action: (data: Record<string, unknown>) => Promise<{ ok: boolean; error?: string | Record<string, string[]> }>;
  label: string;
  exampleJson?: string;
  onSuccess?: () => void;
}

export function JsonImportTab({ schema, action, label, exampleJson, onSuccess }: JsonImportTabProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [state, setState] = useState<JsonImportState>("idle");
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleValidate = useCallback(() => {
    setParseError(null);
    setValidationErrors(null);
    setParsedData(null);

    if (!jsonInput.trim()) {
      setParseError("Please paste JSON data first");
      setState("invalid");
      return;
    }

    setState("validating");

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setParseError("Invalid JSON format. Please check your syntax.");
      setState("invalid");
      return;
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      setParseError("JSON must contain a single object, not an array. Wrap your data in { }.");
      setState("invalid");
      return;
    }

    const result = schema.safeParse(parsed);

    if (result.success) {
      setParsedData(result.data as Record<string, unknown>);
      setState("valid");
      toast.success(`${label} JSON is valid`);
    } else {
      const flat = result.error?.flatten();
      setValidationErrors(flat?.fieldErrors ?? null);
      setParseError(result.error?.message ?? "Validation failed");
      setState("invalid");
    }
  }, [jsonInput, schema, label]);

  const handleSave = useCallback(async () => {
    if (!parsedData) return;
    setState("saving");

    try {
      const res = await action(parsedData);
      if (res.ok) {
        setState("saved");
        toast.success(`${label} created successfully`);
        onSuccess?.();
      } else {
        const errMsg = typeof res.error === "string" ? res.error : JSON.stringify(res.error);
        toast.error(errMsg || `Failed to create ${label.toLowerCase()}`);
        setState("valid");
      }
    } catch (err) {
      toast.error(`An unexpected error occurred: ${String(err)}`);
      setState("valid");
    }
  }, [parsedData, action, label, onSuccess]);

  const isSaving = state === "saving";

  const handleReset = useCallback(() => {
    setJsonInput("");
    setParsedData(null);
    setValidationErrors(null);
    setParseError(null);
    setState("idle");
  }, []);

  const hasRequiredFields = (errors: Record<string, string[]> | null): boolean => {
    if (!errors) return false;
    return Object.values(errors).some((msgs) =>
      msgs.some((m) => m.toLowerCase().includes("required"))
    );
  };

  return (
    <div className="space-y-4">
      {/* JSON Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Code size={16} />
            Paste {label} JSON
          </label>
          {exampleJson && state === "idle" && (
            <button
              type="button"
              onClick={() => setJsonInput(exampleJson)}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Load example
            </button>
          )}
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (state === "valid" || state === "invalid") {
              setState("idle");
              setParsedData(null);
              setValidationErrors(null);
              setParseError(null);
            }
          }}
          rows={12}
          placeholder={`Paste your ${label} JSON here...`}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {(state === "idle" || state === "invalid") && (
          <button
            type="button"
            onClick={handleValidate}
            disabled={!jsonInput.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            <Eye size={16} />
            Validate
          </button>
        )} {state === "validating" && (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white opacity-50"
          >
            <Loader2 size={16} className="animate-spin" />
            Validating…
          </button>
        )}

        {state === "valid" && (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </>
        )}

        {state === "saved" && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Import another
          </button>
        )}
      </div>

      {/* Status Messages */}
      {state === "saved" && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">{label} created successfully</p>
            <p className="text-xs text-green-600 mt-1">The record has been saved to the database.</p>
          </div>
        </div>
      )}

      {parseError && state === "invalid" && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Validation Failed</p>
            <p className="text-xs text-red-600 mt-1">{parseError}</p>
          </div>
        </div>
      )}

      {/* Field-level validation errors */}
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-amber-800">
              {hasRequiredFields(validationErrors) ? "Missing required fields" : "Field validation errors"}
            </p>
          </div>
          <ul className="space-y-1 ml-6">
            {Object.entries(validationErrors).map(([field, msgs]) =>
              msgs.map((msg, i) => (
                <li key={`${field}-${i}`} className="text-xs text-amber-700 list-disc">
                  <span className="font-mono font-medium">{field}</span>: {msg}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Preview */}
      {parsedData && state === "valid" && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-slate-700">Preview — {label} Data</span>
            </div>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {renderPreview(parsedData)}
          </div>
        </div>
      )}
    </div>
  );
}

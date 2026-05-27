"use client";

import { useActionState, useRef, useState } from "react";
import { uploadDocumentAction } from "@/lib/worker/verification-actions";
import type { DocumentActionState } from "@/lib/worker/verification-actions";
import type { DocumentType, VerificationDocument } from "@/lib/worker/types";

/* ── Types ──────────────────────────────────────────────────────────── */

interface LocalFile {
  name: string;
  dataUrl: string;
  size: number;
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/* ── File drop zone section ─────────────────────────────────────────── */

function FileSection({
  label,
  hint,
  accept,
  multiple,
  files,
  onChange,
  fieldName,
  maxFiles,
}: {
  label: string;
  hint: string;
  accept: string;
  multiple: boolean;
  files: LocalFile[];
  onChange: (files: LocalFile[]) => void;
  fieldName: string;
  maxFiles: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const remaining = maxFiles - files.length;
    const toRead = selected.slice(0, remaining);

    setIsReading(true);
    try {
      const results = await Promise.all(
        toRead.map(async (f) => ({
          name: f.name,
          dataUrl: await readAsDataURL(f),
          size: f.size,
        }))
      );
      onChange([...files, ...results]);
    } finally {
      setIsReading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeFile(i: number) {
    onChange(files.filter((_, idx) => idx !== i));
  }

  const canAdd = files.length < maxFiles;

  return (
    <div className="space-y-2.5">
      <div>
        <p className="text-xs font-semibold text-stone-700">{label}</p>
        <p className="text-xs text-stone-400 mt-0.5">{hint}</p>
      </div>

      {/* Hidden JSON field for form submission */}
      <input
        type="hidden"
        name={fieldName}
        value={JSON.stringify(files.map((f) => f.dataUrl))}
      />

      {/* Uploaded file list */}
      {files.length > 0 && (
        <ul className="space-y-1.5" role="list" aria-label={`${label} files`}>
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.83a2 2 0 0 0-.59-1.42l-2.82-2.82A2 2 0 0 0 9.17 0H4zm5 1.5V4a1 1 0 0 0 1 1h2.5L9 1.5z" />
              </svg>
              <span className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-stone-700 truncate block">{f.name}</span>
                <span className="text-[10px] text-stone-400">{formatSize(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${f.name}`}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1z"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add button */}
      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isReading}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600
            px-4 py-2.5 rounded-xl transition-all duration-150
            disabled:opacity-60 hover:enabled:bg-stone-100"
          style={{ border: "1px dashed rgba(0,0,0,0.2)" }}
        >
          {isReading ? (
            <><Spinner />Reading…</>
          ) : (
            <>
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                <path d="M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6A.5.5 0 0 1 8 1z"/>
              </svg>
              {files.length === 0 ? `Add ${label.toLowerCase()}` : "Add another"}
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleChange}
      />
    </div>
  );
}

/* ── Success state ──────────────────────────────────────────────────── */

function SuccessState({ count }: { count: number }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3.5"
      style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
      role="status"
      aria-live="polite"
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "rgba(16,185,129,0.15)" }}>
        <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
          <path d="M2 6l2.5 2.5L10 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-emerald-800">
          {count} document{count !== 1 ? "s" : ""} uploaded
        </p>
        <p className="text-xs text-emerald-700 mt-0.5">
          These will be reviewed alongside your NIN and background check.
        </p>
      </div>
    </div>
  );
}

/* ── Root component ─────────────────────────────────────────────────── */

export default function VerificationDocuments({
  existingDocuments = [],
}: {
  existingDocuments?: VerificationDocument[];
}) {
  const [tradeTestFiles, setTradeTestFiles] = useState<LocalFile[]>([]);
  const [workPhotoFiles, setWorkPhotoFiles] = useState<LocalFile[]>([]);
  const [otherFiles, setOtherFiles] = useState<LocalFile[]>([]);

  const [state, formAction, isPending] = useActionState<DocumentActionState | null, FormData>(
    uploadDocumentAction,
    null
  );

  const totalFiles = tradeTestFiles.length + workPhotoFiles.length + otherFiles.length;
  const existingCount = existingDocuments.length;

  if (state?.success) {
    return <SuccessState count={totalFiles} />;
  }

  return (
    <div className="space-y-5">
      {/* Already uploaded */}
      {existingCount > 0 && (
        <div
          className="flex items-center gap-2 text-xs rounded-xl px-4 py-3"
          style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.83a2 2 0 0 0-.59-1.42l-2.82-2.82A2 2 0 0 0 9.17 0H4zm5 1.5V4a1 1 0 0 0 1 1h2.5L9 1.5z" />
          </svg>
          <span className="text-blue-800 font-medium">
            {existingCount} document{existingCount !== 1 ? "s" : ""} already uploaded — you can add more below.
          </span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div
          className="space-y-5 rounded-2xl p-5"
          style={{ background: "#fafaf9", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <FileSection
            label="Trade Test Certificate"
            hint="Upload your trade test results or professional certification (PDF or image)"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            multiple={false}
            maxFiles={1}
            files={tradeTestFiles}
            onChange={setTradeTestFiles}
            fieldName="tradeTestDocs"
          />

          <div className="h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

          <FileSection
            label="Work Photos"
            hint="Photos of you completing jobs help build trust with clients (up to 6)"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            maxFiles={6}
            files={workPhotoFiles}
            onChange={setWorkPhotoFiles}
            fieldName="workPhotoDocs"
          />

          <div className="h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

          <FileSection
            label="Other Supporting Documents"
            hint="Any additional credentials, references, or documentation (up to 3)"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            multiple
            maxFiles={3}
            files={otherFiles}
            onChange={setOtherFiles}
            fieldName="otherDocs"
          />
        </div>

        {state?.error && (
          <div
            className="text-sm text-red-700 rounded-xl px-4 py-3"
            role="alert"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || totalFiles === 0}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl
            transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            boxShadow: "0 2px 8px rgba(180,83,9,0.25)",
          }}
        >
          {isPending && <Spinner />}
          {isPending ? "Uploading…" : `Upload ${totalFiles > 0 ? `${totalFiles} document${totalFiles !== 1 ? "s" : ""}` : "documents"}`}
        </button>
      </form>
    </div>
  );
}

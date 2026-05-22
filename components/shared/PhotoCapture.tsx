"use client";

import { useRef, useState } from "react";

interface Props {
  maxPhotos?: number;
}

export default function PhotoCapture({ maxPhotos = 4 }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = maxPhotos - previews.length;
    const toProcess = Array.from(files).slice(0, remaining);

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviews((prev) => {
          if (prev.length >= maxPhotos) return prev;
          return [...prev, result];
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function removePhoto(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const canAdd = previews.length < maxPhotos;

  return (
    <div>
      {/* Hidden serialised value consumed by the form action */}
      <input type="hidden" name="photoUrls" value={JSON.stringify(previews)} />

      {/* File input — hidden, triggered by the button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        aria-hidden="true"
      />

      <div className="space-y-3">
        {/* Thumbnail grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl border border-stone-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-stone-900/70 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true">
                    <path d="M12.5 3.5 8 8 3.5 3.5 3 4l4.5 4.5L3 13l.5.5L8 9l4.5 4.5.5-.5-4.5-4.5L13 4l-.5-.5z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-150 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="text-sm font-medium">
              {previews.length === 0
                ? "Add photos (optional)"
                : `Add more — ${maxPhotos - previews.length} remaining`}
            </span>
            <span className="text-xs">
              Take a photo or upload from your gallery
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

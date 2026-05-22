"use client";

import { useState } from "react";

interface Props {
  defaultLocation?: string;
  fieldError?: string;
}

export default function LocationCapture({ defaultLocation = "", fieldError }: Props) {
  const [location, setLocation] = useState(defaultLocation);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "ok" | "denied">("idle");

  function handleDetect() {
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setGeoState("ok");
        if (!location) {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  }

  const hasError = !!fieldError;

  return (
    <div className="space-y-2">
      {/* Hidden coordinate inputs */}
      {lat != null && <input type="hidden" name="lat" value={lat} />}
      {lng != null && <input type="hidden" name="lng" value={lng} />}

      <div className="relative">
        <input
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Surulere, Lagos"
          autoComplete="address-level2"
          required
          className={`w-full pl-4 pr-28 py-3 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors duration-150 ${
            hasError
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30"
              : "border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
          }`}
        />

        <button
          type="button"
          onClick={handleDetect}
          disabled={geoState === "loading"}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Use my current location"
        >
          {geoState === "loading" ? (
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          )}
          Use location
        </button>
      </div>

      {geoState === "ok" && (
        <p className="flex items-center gap-1.5 text-xs text-green-700">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Location detected
        </p>
      )}

      {geoState === "denied" && (
        <p className="text-xs text-stone-500">
          Location access denied — type your address above instead.
        </p>
      )}

      {hasError && (
        <p className="text-xs text-red-600">{fieldError}</p>
      )}
    </div>
  );
}

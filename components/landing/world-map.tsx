"use client";

import { useState } from "react";
import { MAP_PINS, type MapPin } from "./landing";

export function WorldMap() {
  const [hover, setHover] = useState<MapPin | null>(null);

  return (
    <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-emerald-50/40">
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="#0e7a4b" opacity="0.18" />
          </pattern>
        </defs>
        <rect width="100" height="50" fill="url(#dots)" />
      </svg>

      {MAP_PINS.map((p) => (
        <button
          key={p.name}
          type="button"
          onMouseEnter={() => setHover(p)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(p)}
          onBlur={() => setHover(null)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={`${p.name} — ${p.city}`}
        >
          <span className="relative block">
            <span
              className={`animate-ring absolute inset-0 rounded-full ${
                p.rising ? "bg-amber-400" : "bg-emerald-500"
              }`}
            />
            <span
              className={`relative block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                p.rising ? "bg-amber-500" : "bg-emerald-600"
              }`}
            />
          </span>
        </button>
      ))}

      {hover && (
        <div
          className="pointer-events-none absolute z-10 w-52 -translate-x-1/2 -translate-y-[130%] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${hover.x}%`, top: `${hover.y}%` }}
        >
          <div className="font-medium text-neutral-900">{hover.name}</div>
          <div className="text-neutral-500">{hover.city}</div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-emerald-700">fit {hover.fit}</span>
            {hover.rising && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                Rising star
              </span>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[11px] text-neutral-600 backdrop-blur">
        Hover pins to explore
      </div>
    </div>
  );
}

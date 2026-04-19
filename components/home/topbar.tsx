"use client";

import { useRef, useState } from "react";
import { EXAMPLE_QUERIES } from "@/components/landing/landing";
import { SearchIcon, ChevronDownIcon } from "./icons";

export function Topbar({
  query,
  setQuery,
  onSearch,
  risingStarsOnly,
  onToggleRisingStars,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  risingStarsOnly: boolean;
  onToggleRisingStars: () => void;
}) {
  const [showDemos, setShowDemos] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          placeholder="Search investigators — name, site, or focus"
          className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDemos((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
        >
          Demo queries
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </button>
        {showDemos && (
          <div className="absolute right-0 top-full z-20 mt-1 w-80 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  setShowDemos(false);
                  inputRef.current?.focus();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-xs text-neutral-700 transition hover:bg-emerald-50 hover:text-emerald-900"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-700 transition hover:border-neutral-300">
        <input
          type="checkbox"
          checked={risingStarsOnly}
          onChange={onToggleRisingStars}
          className="h-3.5 w-3.5 accent-emerald-600"
        />
        Rising stars only
      </label>

      <button
        type="button"
        onClick={onSearch}
        className="flex h-9 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800"
      >
        <SearchIcon className="h-4 w-4" />
        Search
      </button>
    </div>
  );
}

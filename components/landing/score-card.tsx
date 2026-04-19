"use client";

import { useEffect, useRef, useState } from "react";
import { SCORE_FACTORS } from "./landing";

const OVERALL = 92;

export function ScoreCard() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShow(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - (show ? OVERALL : 0) / 100);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Rising star · no 483 flags
          </div>
          <div className="mt-1 text-lg font-semibold text-neutral-900">
            Dr. Chuka Okonkwo
          </div>
          <div className="text-sm text-neutral-500">
            Lagos University Teaching Hospital · DLBCL, CAR-T
          </div>
        </div>
        <div className="relative h-24 w-24 flex-none">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" stroke="#e5e7e6" strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#0e7a4b"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-semibold text-emerald-700">
              {show ? OVERALL : 0}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-neutral-500">
              fit
            </span>
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {SCORE_FACTORS.map((f, i) => (
          <li key={f.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-neutral-600">{f.label}</span>
              <span className="font-mono text-neutral-900">{f.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{
                  width: show ? `${f.value}%` : 0,
                  transition: `width 0.9s ${i * 60}ms ease-out`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

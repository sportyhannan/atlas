"use client";

import { useEffect, useState } from "react";
import { PIPELINE_STEPS } from "./landing";

export function PipelineDiagram() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % PIPELINE_STEPS.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PIPELINE_STEPS.map((step, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <li
            key={step.label}
            className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
              isActive
                ? "border-emerald-600 bg-emerald-50"
                : isPast
                  ? "border-emerald-200 bg-white"
                  : "border-neutral-200 bg-white"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full font-mono text-[11px] ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : isPast
                    ? "bg-emerald-200 text-emerald-800"
                    : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-neutral-900">{step.label}</div>
              <div className="text-xs text-neutral-500">{step.sub}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

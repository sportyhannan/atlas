"use client";

import { useEffect, useState } from "react";
import type { Investigator } from "@/types/investigator";

export const SCORE_DIMS = [
  { key: "score_trajectory", label: "Trajectory" },
  { key: "score_comparison", label: "Peer comparison" },
  { key: "score_institutional", label: "Institutional track" },
  { key: "score_capacity", label: "Capacity" },
] as const satisfies readonly {
  key: keyof Pick<
    Investigator,
    "score_trajectory" | "score_comparison" | "score_institutional" | "score_capacity"
  >;
  label: string;
}[];

export function ScoreBreakdown({
  inv,
  animate = true,
}: {
  inv: Investigator;
  animate?: boolean;
}) {
  const [show, setShow] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <ul className="space-y-3">
      {SCORE_DIMS.map((d, i) => {
        const value = inv[d.key] ?? 0;
        return (
          <li key={d.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-neutral-600">{d.label}</span>
              <span className="font-mono text-neutral-900">{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{
                  width: show ? `${value}%` : 0,
                  transition: `width 0.9s ${i * 60}ms ease-out`,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { useEffect, useState } from "react";

type Size = "sm" | "md" | "lg";

const SIZES: Record<
  Size,
  { box: string; stroke: number; radius: number; text: string; label: string }
> = {
  sm: { box: "h-10 w-10", stroke: 3, radius: 18, text: "text-xs", label: "" },
  md: { box: "h-16 w-16", stroke: 4, radius: 22, text: "text-base", label: "text-[9px]" },
  lg: { box: "h-24 w-24", stroke: 6, radius: 44, text: "text-2xl", label: "text-[10px]" },
};

function color(score: number) {
  if (score >= 85) return "#0e7a4b";
  if (score >= 70) return "#b45309";
  return "#9ca3af";
}

export function FitIndicator({
  score,
  size = "md",
  showLabel = false,
  animate = true,
}: {
  score: number;
  size?: Size;
  showLabel?: boolean;
  animate?: boolean;
}) {
  const cfg = SIZES[size];
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score, animate]);

  const shown = animate ? animated : score;

  const viewBox = size === "lg" ? 100 : 50;
  const center = viewBox / 2;
  const radius = size === "lg" ? 44 : cfg.radius;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - shown / 100);

  return (
    <div className={`relative flex-none ${cfg.box}`}>
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="h-full w-full -rotate-90">
        <circle cx={center} cy={center} r={radius} stroke="#e5e7e6" strokeWidth={cfg.stroke} fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color(score)}
          strokeWidth={cfg.stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: animate ? "stroke-dashoffset 1s ease-out" : "none" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-semibold ${cfg.text}`} style={{ color: color(score) }}>
          {Math.round(shown)}
        </span>
        {showLabel && cfg.label && (
          <span className={`uppercase tracking-wide text-neutral-500 ${cfg.label}`}>
            fit
          </span>
        )}
      </div>
    </div>
  );
}

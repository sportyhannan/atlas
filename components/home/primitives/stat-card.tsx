import type { ReactNode } from "react";

const TONES = {
  neutral: "text-neutral-900",
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  red: "text-red-700",
} as const;

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`mt-1 font-mono text-xl font-semibold ${TONES[tone]}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}

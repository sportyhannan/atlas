"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "./fade-in";

const CRO_FEE_PER_PROTOCOL = 30_000;
const ANALYST_HOURLY = 100;
const ANALYST_WEEKS = 6;
const ANALYST_HOURS_PER_WEEK = 40;
const ATLAS_PER_PROTOCOL = 15_000;

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${Math.round(n / 1_000)}K`
      : `$${n}`;

export function ROICalculator() {
  const [protocols, setProtocols] = useState(12);

  const { croFees, analystCost, atlasCost, netSaving, roi, weeksSaved } = useMemo(() => {
    const croFees = CRO_FEE_PER_PROTOCOL * protocols;
    const analystCost =
      ANALYST_HOURLY * ANALYST_HOURS_PER_WEEK * ANALYST_WEEKS * protocols;
    const atlasCost = ATLAS_PER_PROTOCOL * protocols;
    const netSaving = croFees + analystCost - atlasCost;
    const roi = (netSaving / atlasCost) * 100;
    const weeksSaved = ANALYST_WEEKS * protocols;
    return { croFees, analystCost, atlasCost, netSaving, roi, weeksSaved };
  }, [protocols]);

  return (
    <section id="roi" className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              ROI
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              The math is uncomfortable.
            </h2>
            <p className="mt-3 text-neutral-600">
              Drag the slider. At typical sponsor volumes, Atlas pays for itself within
              the first protocol.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={80} className="mt-10">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm text-neutral-500">Protocols per year</div>
                <div className="font-mono text-4xl font-semibold text-neutral-900">
                  {protocols}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-500">ROI</div>
                <div className="font-mono text-4xl font-semibold text-emerald-700">
                  {Math.round(roi).toLocaleString()}%
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={protocols}
              onChange={(e) => setProtocols(Number(e.target.value))}
              className="mt-5 w-full accent-emerald-700"
              aria-label="Protocols per year"
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-neutral-500">
              <span>1</span>
              <span>50</span>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-4">
              <Stat label="CRO fees avoided" value={fmt(croFees)} />
              <Stat label="Analyst time freed" value={`${weeksSaved} wks`} />
              <Stat label="Atlas cost" value={fmt(atlasCost)} muted />
              <Stat label="Net savings" value={fmt(netSaving)} accent />
            </dl>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd
        className={`mt-1 font-mono text-xl font-semibold ${
          accent ? "text-emerald-700" : muted ? "text-neutral-500" : "text-neutral-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

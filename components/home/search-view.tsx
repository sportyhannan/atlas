"use client";

import type { Investigator } from "@/types/investigator";
import type { HomeData } from "./types";
import { FitIndicator } from "./primitives/fit-indicator";
import { StatusBadge } from "./primitives/status-badge";
import { isRisingStar } from "./helpers";

export function SearchView({
  investigators,
  data,
  selectedId,
  onSelect,
  query,
}: {
  investigators: Investigator[];
  data: HomeData;
  selectedId: string | null;
  onSelect: (inv: Investigator) => void;
  query: string;
}) {
  const risingCount = investigators.filter(isRisingStar).length;

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
          {query ? "Results" : "All investigators"}
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
          {investigators.length}{" "}
          {investigators.length === 1 ? "investigator" : "investigators"}
          {risingCount > 0 && (
            <span className="ml-2 text-base font-normal text-neutral-500">
              · {risingCount} rising
            </span>
          )}
        </h2>
      </div>

      {investigators.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
          <div className="text-sm text-neutral-600">No investigators match your query.</div>
          <div className="mt-1 text-xs text-neutral-500">
            Try loosening the filters or clearing rising-stars-only.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="w-12 px-4 py-2.5 text-left font-medium">Fit</th>
                <th className="px-4 py-2.5 text-left font-medium">Investigator</th>
                <th className="px-4 py-2.5 text-left font-medium">Focus</th>
                <th className="px-4 py-2.5 text-right font-medium">Enroll</th>
                <th className="px-4 py-2.5 text-right font-medium">Vel/yr</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {investigators.map((inv) => (
                <Row
                  key={inv.id}
                  inv={inv}
                  data={data}
                  selected={inv.id === selectedId}
                  onSelect={() => onSelect(inv)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({
  inv,
  data,
  selected,
  onSelect,
}: {
  inv: Investigator;
  data: HomeData;
  selected: boolean;
  onSelect: () => void;
}) {
  const has483 = data.fda483.some((l) => l.resolved_investigator_ids?.includes(inv.id));
  const rising = isRisingStar(inv);

  return (
    <tr
      onClick={onSelect}
      className={`cursor-pointer border-t border-neutral-100 transition hover:bg-neutral-50 ${
        selected ? "bg-emerald-50/50" : ""
      }`}
    >
      <td className="px-4 py-3">
        <FitIndicator score={inv.fit_score} size="sm" animate={false} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-900">{inv.name}</span>
          {rising && (
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800">
              Rising
            </span>
          )}
          {has483 && (
            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-800">
              483
            </span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-neutral-500">
          {inv.site_name}
          {inv.site_location ? ` · ${inv.site_location}` : ""}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {(inv.focus ?? []).slice(0, 3).map((f) => (
            <span
              key={f}
              className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700"
            >
              {f}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm text-neutral-900">
        {inv.enrollments}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm text-neutral-900">
        {inv.velocity_per_year}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={inv.status} />
      </td>
    </tr>
  );
}

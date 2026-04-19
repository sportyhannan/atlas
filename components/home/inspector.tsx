"use client";

import type { Investigator } from "@/types/investigator";
import type { HomeData } from "./types";
import { FitIndicator } from "./primitives/fit-indicator";
import { ScoreBreakdown } from "./primitives/score-breakdown";
import { StatusBadge } from "./primitives/status-badge";
import { StatCard } from "./primitives/stat-card";
import {
  CloseIcon,
  ExternalLinkIcon,
  AlertIcon,
  DocIcon,
  FlagIcon,
} from "./icons";
import {
  trialsFor,
  pubsFor,
  lettersFor,
  bmisFor,
  paymentsTotalFor,
  npiFor,
  openalexFor,
  identityFor,
  latestRatingFor,
  isRisingStar,
  formatCurrency,
} from "./helpers";

export function Inspector({
  inv,
  data,
  onClose,
}: {
  inv: Investigator | null;
  data: HomeData;
  onClose: () => void;
}) {
  if (!inv) {
    return (
      <aside className="hidden h-full border-l border-neutral-200 bg-white lg:block" />
    );
  }

  const { cts, studies, ictrp } = trialsFor(inv, data);
  const pubs = pubsFor(inv, data);
  const letters = lettersFor(inv, data);
  const bmis = bmisFor(inv, data);
  const paymentsTotal = paymentsTotalFor(inv, data);
  const npi = npiFor(inv, data);
  const openalex = openalexFor(inv, data);
  const identity = identityFor(inv, data);
  const rating = latestRatingFor(inv, data);
  const rising = isRisingStar(inv);

  const studyByNct = new Map(studies.map((s) => [s.nct_id, s] as const));

  return (
    <aside className="flex h-full flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
              Investigator
            </div>
            {rising && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800">
                Rising star
              </span>
            )}
          </div>
          <h2 className="mt-1 truncate text-lg font-semibold text-neutral-900">
            {inv.name}
          </h2>
          <div className="truncate text-xs text-neutral-500">
            {inv.site_name}
            {inv.site_location ? ` · ${inv.site_location}` : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-none rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-start gap-4 border-b border-neutral-100 px-5 py-5">
          <FitIndicator score={inv.fit_score} size="lg" showLabel />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={inv.status} />
              {letters.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800">
                  <AlertIcon className="h-3 w-3" />
                  483 letter
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {(inv.focus ?? []).map((f) => (
                <span
                  key={f}
                  className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Section label="Fit breakdown">
          <ScoreBreakdown inv={inv} />
        </Section>

        <Section label="Throughput">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Enrollments" value={inv.enrollments} />
            <StatCard
              label="Velocity / yr"
              value={inv.velocity_per_year}
              tone="emerald"
            />
            <StatCard
              label="Industry $"
              value={paymentsTotal > 0 ? formatCurrency(paymentsTotal) : "—"}
              sub={paymentsTotal > 0 ? "CMS Open Payments" : undefined}
            />
          </div>
        </Section>

        {rating && (
          <Section label="Agent rating">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-2xl font-semibold text-emerald-700">
                  {rating.rating}
                </div>
                {rating.model && (
                  <div className="font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    {rating.model}
                  </div>
                )}
              </div>
              {rating.reason && (
                <p className="mt-2 text-xs leading-relaxed text-neutral-700">
                  {rating.reason}
                </p>
              )}
            </div>
          </Section>
        )}

        {(cts.length > 0 || ictrp.length > 0) && (
          <Section
            label={`Trials · ${cts.length + ictrp.length}`}
            icon={<FlagIcon className="h-3.5 w-3.5" />}
          >
            <ul className="space-y-2">
              {cts.map((row) => {
                const s = row.nct_id ? studyByNct.get(row.nct_id) : undefined;
                return (
                  <TrialItem
                    key={`ct-${row.nct_id}-${row.role}`}
                    title={s?.brief_title ?? row.nct_id ?? "Study"}
                    subtitle={[s?.phase, s?.overall_status, s?.sponsor]
                      .filter(Boolean)
                      .join(" · ")}
                    id={row.nct_id}
                    role={row.role}
                    registry="CT.gov"
                  />
                );
              })}
              {ictrp.map((row) => (
                <TrialItem
                  key={`ictrp-${row.ictrp_id}`}
                  title={row.public_title ?? row.ictrp_id ?? "Trial"}
                  subtitle={[row.phase, row.overall_status, row.primary_sponsor]
                    .filter(Boolean)
                    .join(" · ")}
                  id={row.ictrp_id}
                  role={row.source_registry}
                  registry="ICTRP"
                  countries={row.countries}
                />
              ))}
            </ul>
          </Section>
        )}

        {pubs.length > 0 && (
          <Section
            label={`Publications · ${pubs.length}`}
            icon={<DocIcon className="h-3.5 w-3.5" />}
          >
            <ul className="space-y-2">
              {pubs.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-neutral-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-neutral-900">
                        {p.title ?? "Untitled"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">
                        {[p.journal, p.pub_year].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    {p.citation_count != null && (
                      <span className="flex-none font-mono text-[11px] text-emerald-700">
                        {p.citation_count} cit
                      </span>
                    )}
                  </div>
                  {p.pubmed_id && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${p.pubmed_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-emerald-700"
                    >
                      PMID {p.pubmed_id}
                      <ExternalLinkIcon className="h-2.5 w-2.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(letters.length > 0 || bmis.length > 0) && (
          <Section label="Regulatory">
            {letters.length > 0 && (
              <div className="mb-2 rounded-xl border border-red-200 bg-red-50/70 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-800">
                  <AlertIcon className="h-3.5 w-3.5" />
                  FDA 483 warning letters · {letters.length}
                </div>
                <ul className="mt-1.5 space-y-1">
                  {letters.map((l) => (
                    <li key={l.id} className="text-[11px] text-red-900/80">
                      <span className="font-mono">{l.letter_date ?? "—"}</span>
                      {l.issuing_office ? ` · ${l.issuing_office}` : ""}
                      {l.observations && l.observations.length > 0 && (
                        <div className="mt-0.5 text-[10px] text-red-900/70">
                          {l.observations.join(" · ")}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {bmis.length > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-white p-3">
                <div className="text-[11px] font-medium text-neutral-700">
                  FDA BMIS 1572 filings · {bmis.length}
                </div>
                <ul className="mt-1 space-y-0.5 text-[11px] text-neutral-600">
                  {bmis.map((b) => (
                    <li key={b.id}>
                      <span className="font-mono text-neutral-700">
                        {b.ind_number ?? b.bmis_id}
                      </span>
                      {b.sponsor ? ` · ${b.sponsor}` : ""}
                      {b.study_drug ? ` · ${b.study_drug}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {(openalex || npi) && (
          <Section label="Identity">
            <div className="grid grid-cols-2 gap-3">
              {openalex && (
                <div className="rounded-xl border border-neutral-200 bg-white p-3">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    OpenAlex
                  </div>
                  <div className="mt-1 font-mono text-sm text-neutral-900">
                    h-index {openalex.h_index ?? "—"}
                  </div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    {openalex.works_count ?? 0} works · {openalex.cited_by_count ?? 0} citations
                  </div>
                </div>
              )}
              {npi && (
                <div className="rounded-xl border border-neutral-200 bg-white p-3">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">NPI</div>
                  <div className="mt-1 font-mono text-sm text-neutral-900">{npi.npi ?? "—"}</div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    {npi.taxonomy_desc ?? "—"}
                  </div>
                </div>
              )}
            </div>
            {identity.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {identity.map((m) => (
                  <li
                    key={m.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px] text-neutral-700"
                    title={m.match_method ?? undefined}
                  >
                    <span className="font-mono text-neutral-500">{m.source_table}</span>
                    <span className="font-mono text-emerald-700">
                      {((m.confidence ?? 0) * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}
      </div>
    </aside>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-100 px-5 py-4 last:border-b-0">
      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
        {icon}
        {label}
      </div>
      {children}
    </section>
  );
}

function TrialItem({
  title,
  subtitle,
  id,
  role,
  registry,
  countries,
}: {
  title: string;
  subtitle: string;
  id: string | null;
  role: string | null;
  registry: string;
  countries?: string[] | null;
}) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-neutral-900">{title}</div>
          {subtitle && (
            <div className="mt-0.5 text-[11px] text-neutral-500">{subtitle}</div>
          )}
        </div>
        <span className="flex-none rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[9px] text-neutral-600">
          {registry}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-500">
        {id && <span className="font-mono">{id}</span>}
        {role && <span>· {role}</span>}
        {countries && countries.length > 0 && (
          <span>· {countries.join(", ")}</span>
        )}
      </div>
    </li>
  );
}

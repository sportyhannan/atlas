import type { Investigator } from "@/types/investigator";
import type { HomeData } from "./types";

export const RISING_STAR_THRESHOLD = 80;

export function isRisingStar(inv: Investigator): boolean {
  return (inv.score_trajectory ?? 0) >= RISING_STAR_THRESHOLD;
}

export function trialsFor(inv: Investigator, data: HomeData) {
  const cts = data.ctInvestigators.filter(
    (row) => row.resolved_investigator_id === inv.id,
  );
  const nctIds = new Set(cts.map((r) => r.nct_id).filter((v): v is string => !!v));
  const studies = data.ctStudies.filter(
    (s) => s.nct_id && nctIds.has(s.nct_id),
  );
  const ictrp = data.ictrpTrials.filter(
    (t) => t.resolved_investigator_id === inv.id,
  );
  return { cts, studies, ictrp };
}

export function pubsFor(inv: Investigator, data: HomeData) {
  return data.pubmed
    .filter((p) => p.resolved_author_ids?.includes(inv.id))
    .sort((a, b) => (b.pub_year ?? 0) - (a.pub_year ?? 0));
}

export function lettersFor(inv: Investigator, data: HomeData) {
  return data.fda483.filter((l) => l.resolved_investigator_ids?.includes(inv.id));
}

export function bmisFor(inv: Investigator, data: HomeData) {
  return data.fdaBmis.filter((b) => b.resolved_investigator_id === inv.id);
}

export function paymentsFor(inv: Investigator, data: HomeData) {
  return data.payments.filter((p) => p.resolved_investigator_id === inv.id);
}

export function paymentsTotalFor(inv: Investigator, data: HomeData) {
  return paymentsFor(inv, data).reduce(
    (sum, p) => sum + Number(p.total_amount ?? 0),
    0,
  );
}

export function npiFor(inv: Investigator, data: HomeData) {
  return data.npi.find((n) => n.resolved_investigator_id === inv.id) ?? null;
}

export function openalexFor(inv: Investigator, data: HomeData) {
  return data.openalex.find((o) => o.resolved_investigator_id === inv.id) ?? null;
}

export function identityFor(inv: Investigator, data: HomeData) {
  return data.identity
    .filter((m) => m.investigator_id === inv.id)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
}

export function latestRatingFor(inv: Investigator, data: HomeData) {
  const mine = data.ratings.filter((r) => r.investigator_id === inv.id);
  if (!mine.length) return null;
  return mine.reduce((latest, r) =>
    new Date(r.created_at) > new Date(latest.created_at) ? r : latest,
  );
}

export function formatCurrency(n: number) {
  if (n === 0) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

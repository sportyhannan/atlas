import type { Status } from "@/types/investigator";

const STYLES: Record<Status, string> = {
  responsive: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  overbooked: "bg-neutral-200 text-neutral-700",
};

const LABELS: Record<Status, string> = {
  responsive: "Responsive",
  pending: "Pending",
  overbooked: "Overbooked",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}

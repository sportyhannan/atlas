import { Counter } from "./counter";
import { FadeIn } from "./fade-in";

const STATS = [
  { value: 50, suffix: "%+", label: "of trials miss enrollment targets", tone: "danger" },
  { value: 6, suffix: "–12 wks", label: "average feasibility cycle today", tone: "warn" },
  { value: 480, suffix: "K+", label: "registered trials to sift through", tone: "info" },
] as const;

const TONES: Record<(typeof STATS)[number]["tone"], string> = {
  danger: "text-red-700",
  warn: "text-amber-700",
  info: "text-emerald-700",
};

export function ProblemStats() {
  return (
    <section id="problem" className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              The problem
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Site selection is the quiet reason trials slip.
            </h2>
            <p className="mt-3 text-neutral-600">
              Feasibility teams manually cross-reference registries, publications, and
              CRO intel. By the time a shortlist lands, the window has closed.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6">
                <div className={`font-mono text-4xl font-semibold ${TONES[s.tone]}`}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-sm text-neutral-600">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

import { FadeIn } from "./fade-in";
import { ScoreCard } from "./score-card";

export function Scoring() {
  return (
    <section id="scoring" className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Scoring
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Eight factors, no black box.
            </h2>
            <p className="mt-3 text-neutral-600">
              Every candidate score decomposes into explainable, evidence-backed
              dimensions. Click any factor in the product to see the underlying
              citations, CT.gov IDs, and publication lineage.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <dt className="text-xs text-neutral-500">Factors</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-neutral-900">
                  8
                </dd>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <dt className="text-xs text-neutral-500">Registries</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-neutral-900">
                  6
                </dd>
              </div>
            </dl>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <ScoreCard />
        </FadeIn>
      </div>
    </section>
  );
}

import { DATA_SOURCES } from "./landing";
import { FadeIn } from "./fade-in";

export function DataSources() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Grounded in public data
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Six registries. Citable. Reproducible.
            </h2>
            <p className="mt-3 text-neutral-600">
              No proprietary scraping, no opaque scoring — just the same public
              sources regulators and investigators already trust.
            </p>
          </div>
        </FadeIn>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATA_SOURCES.map((s, i) => (
            <FadeIn key={s.name} delay={i * 50}>
              <div className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm">
                <div className="font-mono text-sm font-medium text-neutral-900">
                  {s.name}
                </div>
                <div className="mt-1 text-sm text-neutral-500">{s.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

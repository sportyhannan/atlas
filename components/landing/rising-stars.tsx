import { RISING_STARS } from "./landing";
import { FadeIn } from "./fade-in";

export function RisingStars() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Rising stars
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Find the investigators nobody&apos;s called yet.
            </h2>
            <p className="mt-3 text-neutral-600">
              Velocity deltas and capacity signals surface high-performing PIs before
              they hit every CRO&apos;s shortlist — often in under-enrolled regions.
            </p>
          </div>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {RISING_STARS.map((r, i) => (
            <FadeIn key={r.name} delay={i * 80}>
              <div className="h-full rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {r.name}
                    </div>
                    <div className="text-xs text-neutral-500">{r.site}</div>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                    Rising
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                      Focus
                    </div>
                    <div className="font-mono text-sm text-neutral-800">{r.focus}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-semibold text-emerald-700">
                      {r.fit}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-emerald-700">
                      velocity {r.delta}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

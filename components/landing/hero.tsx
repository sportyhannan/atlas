import { FadeIn } from "./fade-in";
import { WorldMap } from "./world-map";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <FadeIn delay={80}>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
            Clinical trial site selection is broken.{" "}
            <span className="text-emerald-700">We fixed it.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={140}>
          <p className="mt-5 max-w-2xl text-base text-neutral-600 sm:text-lg">
            Atlas compresses six weeks of investigator feasibility work into seconds
            ranking trial sites worldwide by eight evidence backed factors across six
            public registries.
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="mt-7">
            <a
              href="#solution"
              className="inline-flex rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800"
            >
              How it works
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={260} className="mt-14">
          <WorldMap />
        </FadeIn>
      </div>
    </section>
  );
}

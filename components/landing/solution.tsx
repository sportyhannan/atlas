import { EXAMPLE_QUERIES } from "./landing";
import { FadeIn } from "./fade-in";
import { PipelineDiagram } from "./pipeline-diagram";
import { Typewriter } from "./typewriter";

export function Solution() {
  return (
    <section id="solution" className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              The solution
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Six weeks becomes seconds.
            </h2>
            <p className="mt-3 text-neutral-600">
              Describe the trial in plain English. A planner agent extracts filters,
              a search agent fans out across twelve public registries, and a rating
              agent scores the shortlist against eight factors — returning an
              evidence-cited dossier in seconds.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={80} className="mt-8">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-mono text-sm text-neutral-800">
            <span className="text-emerald-700">{">"}</span>
            <Typewriter texts={EXAMPLE_QUERIES} />
          </div>
        </FadeIn>

        <FadeIn delay={140} className="mt-6">
          <PipelineDiagram />
        </FadeIn>
      </div>
    </section>
  );
}

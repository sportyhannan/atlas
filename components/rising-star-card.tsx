"use client";

import type { RisingStar } from "@/types/rising-star";

interface RisingStarCardProps {
  star: RisingStar;
}

export function RisingStarCard({ star }: RisingStarCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 50) return "text-blue-700 bg-blue-50 border-blue-200";
    if (score >= 30) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-blue-500";
    if (score >= 30) return "bg-amber-500";
    return "bg-gray-400";
  };

  return (
    <div className="group rounded-xl border border-sky-200 bg-white/90 p-6 shadow-sm transition-all hover:shadow-lg hover:border-sky-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-semibold text-sky-900">
              {star.name}
            </h3>
            {star.needsReview && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                Needs Review
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-sky-600">
            <span className="font-medium">{star.institution}</span>
            {star.state && (
              <>
                <span className="text-sky-300">•</span>
                <span>{star.state}</span>
              </>
            )}
            <span className="text-sky-300">•</span>
            <span className="text-xs">FY {star.fiscalYear}</span>
            <span className="text-sky-300">•</span>
            <span className="text-xs font-mono text-sky-500">{star.grantId}</span>
          </div>

          {star.researchTopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {star.researchTopics.map((topic, i) => (
                <span
                  key={i}
                  className="rounded-md bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border-2 ${getScoreColor(star.compositeScore)}`}>
          <div className="text-center">
            <div className="text-2xl font-bold">{star.compositeScore}</div>
            <div className="text-xs uppercase tracking-wide">Score</div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-600">
            <span>Research Output</span>
            <span className="font-semibold">{star.breakdown.researchOutput}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-100">
            <div
              className={`h-full ${getScoreBarColor(star.breakdown.researchOutput)}`}
              style={{ width: `${star.breakdown.researchOutput}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-600">
            <span>Clinical Exposure</span>
            <span className="font-semibold">{star.breakdown.clinicalExposure}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-100">
            <div
              className={`h-full ${getScoreBarColor(star.breakdown.clinicalExposure)}`}
              style={{ width: `${star.breakdown.clinicalExposure}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-600">
            <span>Institutional</span>
            <span className="font-semibold">{star.breakdown.institutionalReadiness}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sky-100">
            <div
              className={`h-full ${getScoreBarColor(star.breakdown.institutionalReadiness)}`}
              style={{ width: `${star.breakdown.institutionalReadiness}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-sky-100 pt-4 sm:grid-cols-5">
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-900">
            {star.signals.totalPublications ?? "—"}
          </div>
          <div className="text-xs text-sky-600">Publications</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-900">
            {star.signals.pubsLast3Years ?? "—"}
          </div>
          <div className="text-xs text-sky-600">Recent Pubs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-900">
            {star.signals.activeTrialsAtSite ?? "—"}
          </div>
          <div className="text-xs text-sky-600">Active Trials</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-900">
            {star.signals.phase2PlusTrials ?? "—"}
          </div>
          <div className="text-xs text-sky-600">Phase 2+ Trials</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-sky-900">
            {Math.round(star.dataCompleteness * 100)}%
          </div>
          <div className="text-xs text-sky-600">Data Complete</div>
        </div>
      </div>

      {star.orcidUrl && (
        <div className="mt-4 border-t border-sky-100 pt-3">
          <a
            href={star.orcidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 hover:underline"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 256 256" fill="currentColor">
              <path d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z" fill="#A6CE39"/>
              <path d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM71.3 54.8c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4z" fill="#fff"/>
            </svg>
            View ORCID Profile
          </a>
        </div>
      )}
    </div>
  );
}

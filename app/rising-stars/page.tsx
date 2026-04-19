"use client";

import { useEffect, useState } from "react";
import { RisingStarCard } from "@/components/rising-star-card";
import type { RisingStar } from "@/types/rising-star";
import { fetchRisingStars } from "@/actions/rising-stars";

export default function RisingStarsPage() {
  const [stars, setStars] = useState<RisingStar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "needs-review" | "high-score">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name" | "institution">("score");

  useEffect(() => {
    async function loadStars() {
      const data = await fetchRisingStars();
      setStars(data);
      setLoading(false);
    }
    loadStars();
  }, []);

  const filteredStars = stars
    .filter((star) => {
      if (filter === "needs-review" && !star.needsReview) return false;
      if (filter === "high-score" && star.compositeScore < 70) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          star.name.toLowerCase().includes(query) ||
          star.institution.toLowerCase().includes(query) ||
          star.researchTopics.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.compositeScore - a.compositeScore;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "institution") return a.institution.localeCompare(b.institution);
      return 0;
    });

  const stats = {
    total: stars.length,
    highScore: stars.filter((s) => s.compositeScore >= 70).length,
    needsReview: stars.filter((s) => s.needsReview).length,
    averageScore: stars.length > 0
      ? Math.round(stars.reduce((sum, s) => sum + s.compositeScore, 0) / stars.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600 mx-auto"></div>
          <p className="mt-4 text-sky-600">Loading rising stars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-sky-900">
            Rising Star Investigators
          </h1>
          <p className="mt-3 text-lg text-sky-600">
            MD/PhD candidates identified through F30 grants and multi-source enrichment
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-sky-200 bg-white/70 p-4 text-center">
            <div className="text-3xl font-bold text-sky-900">{stats.total}</div>
            <div className="text-sm text-sky-600">Total Candidates</div>
          </div>
          <div className="rounded-lg border border-green-200 bg-white/70 p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{stats.highScore}</div>
            <div className="text-sm text-sky-600">High Score (70+)</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/70 p-4 text-center">
            <div className="text-3xl font-bold text-amber-700">{stats.needsReview}</div>
            <div className="text-sm text-sky-600">Needs Review</div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white/70 p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{stats.averageScore}</div>
            <div className="text-sm text-sky-600">Average Score</div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-sky-200 bg-white/70 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-sky-600 text-white"
                    : "bg-white text-sky-600 hover:bg-sky-50 border border-sky-200"
                }`}
              >
                All ({stars.length})
              </button>
              <button
                onClick={() => setFilter("high-score")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === "high-score"
                    ? "bg-sky-600 text-white"
                    : "bg-white text-sky-600 hover:bg-sky-50 border border-sky-200"
                }`}
              >
                High Score ({stats.highScore})
              </button>
              <button
                onClick={() => setFilter("needs-review")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === "needs-review"
                    ? "bg-sky-600 text-white"
                    : "bg-white text-sky-600 hover:bg-sky-50 border border-sky-200"
                }`}
              >
                Needs Review ({stats.needsReview})
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search by name, institution, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-sky-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-sky-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="score">Sort by Score</option>
                <option value="name">Sort by Name</option>
                <option value="institution">Sort by Institution</option>
              </select>
            </div>
          </div>
        </div>

        {filteredStars.length === 0 ? (
          <div className="rounded-xl border border-sky-200 bg-white/70 p-12 text-center">
            <p className="text-lg text-sky-600">No candidates found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStars.map((star, index) => (
              <RisingStarCard key={`${star.grantId}-${index}`} star={star} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-sky-600">
          Showing {filteredStars.length} of {stars.length} candidates
        </div>
      </div>
    </div>
  );
}

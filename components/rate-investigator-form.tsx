"use client";

import { useState } from "react";
import { rateInvestigator } from "@/actions/rate_investigators";

export default function RateInvestigatorForm() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<{
    rating: number;
    reason: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      setResult(await rateInvestigator(id.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "rating failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 w-full max-w-xl space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Investigator id (uuid)"
          className="flex-1 rounded-lg border border-sky-300 bg-white px-3 py-2 text-sky-900 placeholder:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={pending || !id.trim()}
          className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Rating…" : "Rate"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-lg border border-sky-200 bg-white p-4 text-left text-sky-900">
          <div className="text-lg font-semibold">
            potential {result.rating}
          </div>
          <p className="mt-1 text-sm text-sky-700">{result.reason}</p>
        </div>
      )}
    </form>
  );
}

import Image from "next/image";
import { fetchInvestigators } from "@/actions/investigators";
import RateInvestigatorForm from "@/components/rate-investigator-form";

export default async function Home() {
  const investigators = await fetchInvestigators();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="text-center">
        <Image
          src="/hackprinceton.png"
          alt="HackPrinceton"
          width={300}
          height={300}
          priority
          className="mx-auto"
        />
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-sky-900">
          hackprinceton
        </h1>
        <p className="mt-4 text-lg text-sky-600">
          {investigators.length} investigator
          {investigators.length === 1 ? "" : "s"} loaded
        </p>
        <RateInvestigatorForm />
        <ul className="mx-auto mt-8 max-w-2xl space-y-3 text-left">
          {investigators.map((inv) => (
            <li
              key={inv.id}
              className="rounded-lg border border-sky-200 bg-white/70 p-4 text-sky-900"
            >
              <div className="flex items-baseline justify-between gap-4">
                <strong>{inv.name}</strong>
                <span className="text-sm text-sky-600">fit {inv.fit_score}</span>
              </div>
              <div className="text-sm text-sky-700">
                {inv.site_name}
                {inv.site_location ? ` · ${inv.site_location}` : ""}
              </div>
              <div className="mt-1 text-xs text-sky-600">
                focus: {inv.focus.join(", ") || "—"} · enrollments{" "}
                {inv.enrollments} · velocity/yr {inv.velocity_per_year} ·{" "}
                {inv.status}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

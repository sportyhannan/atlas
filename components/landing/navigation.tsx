const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "How it works" },
  { href: "#scoring", label: "Scoring" },
  { href: "#roi", label: "ROI" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-semibold text-neutral-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 font-mono text-xs text-white">
            A
          </span>
          Atlas
        </a>
        <ul className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-neutral-900">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/home"
          className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}

import Link from "next/link";

export default function BackToLanding() {
  return (
    <Link
      href="/"
      className="absolute left-4 top-4 rounded-md border border-sky-200 bg-white/70 px-3 py-1.5 text-sm font-medium text-sky-900 backdrop-blur transition hover:bg-white"
    >
      ← Landing
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white font-mono text-xs text-emerald-900">
            A
          </span>
          <span className="font-semibold text-white">Atlas</span>
        </div>
        <span className="text-xs text-emerald-300">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

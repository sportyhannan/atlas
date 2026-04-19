import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/atlas.png"
            alt="Atlas"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-cover"
          />
          <span className="font-semibold text-white">Atlas</span>
        </div>
        <span className="text-xs text-emerald-300">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

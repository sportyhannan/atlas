"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  SearchIcon,
  TableIcon,
  UsersIcon,
  MapPinIcon,
  DocIcon,
  FlagIcon,
  CheckIcon,
} from "./icons";

export type NavView =
  | "search"
  | "shortlists"
  | "trials"
  | "outreach"
  | "map"
  | "saved"
  | "reports";

type Item = {
  id: NavView;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const WORKSPACE: Item[] = [
  { id: "search", label: "Search", icon: SearchIcon },
  { id: "shortlists", label: "Shortlists", icon: TableIcon },
  { id: "trials", label: "Trials", icon: FlagIcon },
  { id: "outreach", label: "Outreach", icon: UsersIcon },
];

const LIBRARY: Item[] = [
  { id: "map", label: "Map", icon: MapPinIcon },
  { id: "saved", label: "Saved", icon: CheckIcon },
  { id: "reports", label: "Reports", icon: DocIcon },
];

function Section({
  title,
  items,
  active,
  onNav,
}: {
  title: string;
  items: Item[];
  active: NavView;
  onNav: (v: NavView) => void;
}) {
  return (
    <div className="mt-6">
      <div className="px-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        {title}
      </div>
      <ul className="mt-2 space-y-0.5">
        {items.map((it) => {
          const isActive = it.id === active;
          const Icon = it.icon;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onNav(it.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-emerald-50 font-medium text-emerald-800"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-emerald-700" : "text-neutral-400"}`}
                />
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Nav({
  active,
  onNav,
}: {
  active: NavView;
  onNav: (v: NavView) => void;
}) {
  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-neutral-200 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 font-mono text-xs text-white">
          A
        </span>
        <span className="font-semibold text-neutral-900">Atlas</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <Section title="Workspace" items={WORKSPACE} active={active} onNav={onNav} />
        <Section title="Library" items={LIBRARY} active={active} onNav={onNav} />
      </div>

      <div className="border-t border-neutral-200 p-3">
        <Link
          href="/"
          className="block rounded-md px-3 py-1.5 text-xs text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          ← Landing
        </Link>
      </div>
    </aside>
  );
}

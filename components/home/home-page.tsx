"use client";

import { useCallback, useMemo, useState } from "react";
import type { Investigator } from "@/types/investigator";
import type { HomeData } from "./types";
import { Nav, type NavView } from "./nav";
import { Topbar } from "./topbar";
import { SearchView } from "./search-view";
import { Inspector } from "./inspector";
import { matchesQuery, isRisingStar } from "./helpers";

export function HomePage({ data }: { data: HomeData }) {
  const [navView, setNavView] = useState<NavView>("search");
  const [inputQuery, setInputQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [risingStarsOnly, setRisingStarsOnly] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Investigator | null>(null);

  const results = useMemo(() => {
    return data.investigators.filter((inv) => {
      if (risingStarsOnly && !isRisingStar(inv)) return false;
      if (!matchesQuery(inv, committedQuery)) return false;
      return true;
    });
  }, [data.investigators, committedQuery, risingStarsOnly]);

  const handleSearch = useCallback(() => {
    setCommittedQuery(inputQuery);
    setSelectedInv(null);
  }, [inputQuery]);

  const handleSelect = useCallback((inv: Investigator) => {
    setSelectedInv(inv);
  }, []);

  const hasInspector = selectedInv !== null;

  return (
    <div
      className="grid h-screen w-full"
      style={{
        gridTemplateColumns: hasInspector
          ? "224px minmax(0, 1fr) 440px"
          : "224px minmax(0, 1fr)",
        gridTemplateRows: "minmax(0, 1fr)",
      }}
    >
      <Nav active={navView} onNav={setNavView} />

      <main className="flex h-screen min-w-0 flex-col overflow-hidden bg-neutral-50">
        <Topbar
          query={inputQuery}
          setQuery={setInputQuery}
          onSearch={handleSearch}
          risingStarsOnly={risingStarsOnly}
          onToggleRisingStars={() => setRisingStarsOnly((v) => !v)}
        />
        <div className="flex-1 overflow-y-auto">
          <SearchView
            investigators={results}
            data={data}
            selectedId={selectedInv?.id ?? null}
            onSelect={handleSelect}
            query={committedQuery}
          />
        </div>
      </main>

      {hasInspector && (
        <Inspector
          inv={selectedInv}
          data={data}
          onClose={() => setSelectedInv(null)}
        />
      )}
    </div>
  );
}

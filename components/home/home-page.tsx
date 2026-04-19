"use client";

import { useCallback, useMemo, useState } from "react";
import type { Investigator } from "@/types/investigator";
import type { HomeData } from "./types";
import { Nav, type NavView } from "./nav";
import { Topbar } from "./topbar";
import { SearchView, type AgentMatch } from "./search-view";
import { Inspector } from "./inspector";
import { isRisingStar } from "./helpers";
import { searchInvestigators } from "@/actions/search_investigators";

export function HomePage({ data }: { data: HomeData }) {
  const [navView, setNavView] = useState<NavView>("search");
  const [inputQuery, setInputQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [agentMatches, setAgentMatches] = useState<AgentMatch[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [risingStarsOnly, setRisingStarsOnly] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Investigator | null>(null);

  const byId = useMemo(() => {
    const m = new Map<string, Investigator>();
    for (const inv of data.investigators) m.set(inv.id, inv);
    return m;
  }, [data.investigators]);

  const results = useMemo(() => {
    const base = agentMatches
      ? agentMatches
          .map((c) => byId.get(c.id))
          .filter((v): v is Investigator => !!v)
      : data.investigators;
    return base.filter((inv) => !risingStarsOnly || isRisingStar(inv));
  }, [agentMatches, byId, data.investigators, risingStarsOnly]);

  const handleSearch = useCallback(async () => {
    const q = inputQuery.trim();
    setCommittedQuery(q);
    setSelectedInv(null);
    setSearchError(null);
    if (!q) {
      setAgentMatches(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await searchInvestigators(q);
      setAgentMatches(res.candidates);
    } catch (err) {
      setAgentMatches([]);
      setSearchError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsSearching(false);
    }
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
          isSearching={isSearching}
        />
        <div className="flex-1 overflow-y-auto">
          <SearchView
            investigators={results}
            data={data}
            selectedId={selectedInv?.id ?? null}
            onSelect={handleSelect}
            query={committedQuery}
            isSearching={isSearching}
            searchError={searchError}
            agentMatches={agentMatches}
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

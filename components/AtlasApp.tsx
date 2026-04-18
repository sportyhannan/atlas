'use client';
import { useState, useCallback } from 'react';
import type { Investigator, SearchResult, ReasoningStep } from '@/types/investigator';
import Nav from './Nav';
import Topbar from './Topbar';
import SearchView from './SearchView';
import Inspector from './Inspector';
import CompareView from './CompareView';

type NavView = 'search' | 'shortlists' | 'trials' | 'outreach' | 'map' | 'saved' | 'reports';

export default function AtlasApp() {
  const [navView, setNavView] = useState<NavView>('search');
  const [query, setQuery] = useState('Phase 3 R/R DLBCL, 22 sites global, rising stars only');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [selectedInv, setSelectedInv] = useState<Investigator | null>(null);
  const [compareInvs, setCompareInvs] = useState<Investigator[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [risingStarsOnly, setRisingStarsOnly] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setReasoningSteps([]);
    setSelectedInv(null);
    setShowCompare(false);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, risingStarsOnly }),
      });

      if (!res.ok || !res.body) throw new Error('Search failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === 'step') {
              setReasoningSteps(prev => [...prev, {
                id: `step-${Date.now()}-${Math.random()}`,
                agent: payload.agent,
                action: payload.text,
                detail: payload.detail,
              }]);
            } else if (payload.type === 'results') {
              setResult(payload.data);
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, risingStarsOnly]);

  const handleToggleCompare = useCallback((inv: Investigator) => {
    setCompareInvs(prev => {
      const exists = prev.find(i => i.id === inv.id);
      if (exists) return prev.filter(i => i.id !== inv.id);
      if (prev.length >= 3) return [...prev.slice(1), inv]; // max 3
      return [...prev, inv];
    });
    setShowCompare(true);
  }, []);

  const handleRemoveFromCompare = useCallback((id: string) => {
    setCompareInvs(prev => {
      const next = prev.filter(i => i.id !== id);
      if (next.length === 0) setShowCompare(false);
      return next;
    });
  }, []);

  const hasInspector = selectedInv !== null && !showCompare;
  const hasCompare = showCompare && compareInvs.length > 0;

  const appClass = [
    'app',
    !hasInspector && !hasCompare ? 'no-inspector' : '',
    hasCompare ? 'show-compare' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={appClass}>
      <Nav active={navView} onNav={v => setNavView(v as NavView)} />

      <Topbar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      <SearchView
        result={result}
        selectedId={selectedInv?.id ?? null}
        compareIds={compareInvs.map(i => i.id)}
        onSelectInv={inv => { setSelectedInv(inv); setShowCompare(false); }}
        onToggleCompare={handleToggleCompare}
        reasoningSteps={reasoningSteps}
        isSearching={loading}
        risingStarsOnly={risingStarsOnly}
        onToggleRisingStars={() => setRisingStarsOnly(v => !v)}
      />

      {hasCompare ? (
        <CompareView
          investigators={compareInvs}
          onRemove={handleRemoveFromCompare}
          onClose={() => setShowCompare(false)}
        />
      ) : (
        <Inspector
          inv={selectedInv}
          onClose={() => setSelectedInv(null)}
          onCompare={handleToggleCompare}
          compareIds={compareInvs.map(i => i.id)}
        />
      )}
    </div>
  );
}

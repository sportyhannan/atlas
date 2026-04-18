'use client';
import { useRef } from 'react';
import * as Icon from './Icons';

type TopbarProps = {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  loading: boolean;
};

const DEMO_QUERIES = [
  'Phase 3 R/R DLBCL, 22 sites global, rising stars only',
  'Phase 3 NSCLC East Asia, 15+ enrollments/yr, Ordspono-eligible',
  'Hemophilia B underrepresented regions, gene therapy experience',
  'HER2+ metastatic breast cancer global, mAb experience required',
];

export default function Topbar({ query, setQuery, onSearch, loading }: TopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        {loading
          ? <Icon.Loader size={16} />
          : <span style={{ color: 'var(--atlas-fg-muted)', flexShrink: 0, display:'flex' }}><Icon.Search size={16}/></span>
        }
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search 2.1M investigators — try 'Phase 3 NSCLC, Seoul, 15+ enrollments/yr, Ordspono-eligible'"
          aria-label="Investigator search"
        />
        {!loading && query && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
            style={{ padding: '0 4px', height: 20 }}
          >
            <Icon.X size={14} />
          </button>
        )}
        <span className="kbd">↵</span>
      </div>

      <div className="topbar-right">
        <button className="btn btn-ghost btn-sm" aria-label="Notifications">
          <Icon.Bell size={16} />
        </button>
        <button className="btn btn-secondary btn-sm">
          <Icon.Plus size={14} />
          New trial
        </button>
        <button className="btn btn-primary btn-sm" onClick={onSearch} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </header>
  );
}

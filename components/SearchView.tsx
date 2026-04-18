'use client';
import { useState } from 'react';
import type { Investigator, SearchResult, ReasoningStep } from '@/types/investigator';
import * as Icon from './Icons';
import ReasoningTrace from './ReasoningTrace';

type Props = {
  result: SearchResult | null;
  selectedId: string | null;
  compareIds: string[];
  onSelectInv: (inv: Investigator) => void;
  onToggleCompare: (inv: Investigator) => void;
  reasoningSteps: ReasoningStep[];
  isSearching: boolean;
  risingStarsOnly: boolean;
  onToggleRisingStars: () => void;
};

const STATUS_MAP: Record<string, [string, string]> = {
  Responsive:  ['badge-success', '#0E7A4B'],
  Pending:     ['badge-warn',    '#B8892A'],
  Overbooked:  ['badge-danger',  '#B1452E'],
  Flagged:     ['badge-danger',  '#B1452E'],
};

function FitCell({ score }: { score: number }) {
  const cls = score >= 85 ? 'fit-hi' : score >= 70 ? 'fit-med' : 'fit-lo';
  return <span className={`fit ${cls}`}>{score}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const [cls, dot] = STATUS_MAP[status] ?? ['badge-neutral', '#9BA09D'];
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" style={{ background: dot }}/>
      {status}
    </span>
  );
}

type SortKey = 'fit' | 'velocity' | 'enrollments';

export default function SearchView({
  result, selectedId, compareIds, onSelectInv, onToggleCompare,
  reasoningSteps, isSearching, risingStarsOnly, onToggleRisingStars,
}: Props) {
  const [chips, setChips] = useState(['Phase 3', 'DLBCL', '15+ enrollments/yr', 'East Asia', 'Accepting trials']);
  const [sort, setSort] = useState<SortKey>('fit');
  const [showTrace, setShowTrace] = useState(true);

  const investigators = result?.investigators ?? [];
  const sorted = [...investigators].sort((a, b) => {
    if (sort === 'fit')        return b.fit - a.fit;
    if (sort === 'velocity')   return b.velocity - a.velocity;
    if (sort === 'enrollments')return b.enrollments - a.enrollments;
    return 0;
  });

  const displayCount = result?.totalFound ?? investigators.length;

  return (
    <main className="main">
      <div className="main-inner">
        <div className="page-header">
          <div>
            <h1 className="page-title">Investigator search</h1>
            <div className="page-sub">
              {isSearching
                ? <><span className="spin" style={{ display: 'inline-block', marginRight: 6 }}>↻</span> Querying registries…</>
                : result
                  ? <><span className="mono">{displayCount.toLocaleString()}</span> investigators match across{' '}
                      <span className="mono">{result.registriesQueried}</span> registries ·{' '}
                      {result.risingStarCount > 0 && <><span className="mono">{result.risingStarCount}</span> rising stars ·{' '}</>}
                      <span className="muted">updated just now</span>
                    </>
                  : <span className="muted">Search to find investigators</span>
              }
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary"><Icon.Doc size={14}/>Export</button>
            <button className="btn btn-primary"><Icon.Plus size={14}/>Save as shortlist</button>
          </div>
        </div>

        {/* Filter row */}
        <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="chip-row">
            {chips.map(c => (
              <span key={c} className="chip">
                {c}
                <span className="x" onClick={() => setChips(chips.filter(x => x !== c))}>
                  <Icon.X size={12}/>
                </span>
              </span>
            ))}
            <button className="chip">
              <Icon.Plus size={12}/>
              Add filter
            </button>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className={`chip${risingStarsOnly ? ' chip-active' : ''}`}
              onClick={onToggleRisingStars}
              title="Show only investigators with 0–1 prior industry trials but strong publication velocity"
            >
              <Icon.Star size={12}/>
              Rising stars only
            </button>

            <span className="muted" style={{ fontSize: 12 }}>Sort</span>
            <div className="seg">
              <button className={sort === 'fit'         ? 'active' : ''} onClick={() => setSort('fit')}>Fit score</button>
              <button className={sort === 'velocity'    ? 'active' : ''} onClick={() => setSort('velocity')}>Velocity</button>
              <button className={sort === 'enrollments' ? 'active' : ''} onClick={() => setSort('enrollments')}>Enrollments</button>
            </div>
          </div>
        </div>

        {/* Reasoning trace */}
        {(isSearching || reasoningSteps.length > 0) && showTrace && (
          <ReasoningTrace
            steps={reasoningSteps}
            isRunning={isSearching}
            onClose={() => setShowTrace(false)}
          />
        )}

        {/* Compare bar */}
        {compareIds.length >= 2 && (
          <div style={{
            marginTop: 12, padding: '8px 14px',
            background: 'var(--atlas-accent-bg)', border: '1px solid var(--atlas-green-200)', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
          }}>
            <span style={{ color: 'var(--atlas-accent)', display:'flex' }}><Icon.Columns size={14}/></span>
            <span>{compareIds.length} investigators selected for comparison</span>
            <span className="muted">— click an inspector row to compare</span>
          </div>
        )}

        {/* Table */}
        <div className="card" style={{ marginTop: 16, padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th>Investigator</th>
                <th>Site</th>
                <th>Indication focus</th>
                <th className="num">Enrollments</th>
                <th className="num">Velocity/yr</th>
                <th>Status</th>
                <th className="num">Fit</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && !isSearching && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--atlas-fg-muted)' }}>
                    {result ? 'No investigators match your criteria.' : 'Enter a search query above to find investigators.'}
                  </td>
                </tr>
              )}
              {sorted.map(inv => (
                <tr
                  key={inv.id}
                  className={selectedId === inv.id ? 'selected' : ''}
                  onClick={() => onSelectInv(inv)}
                >
                  <td>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{inv.initials}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 500 }}>Dr. {inv.name}</span>
                      {inv.isRisingStar && <span className="rising-star-badge">Rising star</span>}
                      {inv.has483Flag && <span style={{ color: 'var(--atlas-danger-500)', display:'flex' }} title="FDA 483 flag"><Icon.AlertTriangle size={12}/></span>}
                    </div>
                    <div className="muted mono" style={{ fontSize: 11 }}>{inv.credentials}</div>
                  </td>
                  <td>
                    <div>{inv.site}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{inv.city}, {inv.country}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {inv.indicationTags.slice(0, 2).map(t => (
                        <span key={t} className="badge-tag">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="num">{inv.enrollments}</td>
                  <td className="num">{inv.velocity}</td>
                  <td><StatusBadge status={inv.status}/></td>
                  <td className="num"><FitCell score={inv.fit}/></td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={e => { e.stopPropagation(); onToggleCompare(inv); }}
                      title={compareIds.includes(inv.id) ? 'Remove from comparison' : 'Add to comparison'}
                      style={{ padding: '0 4px', color: compareIds.includes(inv.id) ? 'var(--atlas-accent)' : undefined }}
                    >
                      <Icon.Columns size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="muted" style={{ fontSize: 12, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Check size={14}/>
          Every row cites at least 3 primary sources. Click an investigator to view the full dossier.
        </div>
      </div>
    </main>
  );
}

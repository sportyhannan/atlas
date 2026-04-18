'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Investigator } from '@/types/investigator';
import * as Icon from './Icons';

type Props = {
  inv: Investigator | null;
  onClose: () => void;
  onCompare: (inv: Investigator) => void;
  compareIds: string[];
};

const STATUS_MAP: Record<string, [string, string]> = {
  Responsive:  ['badge-success', '#0E7A4B'],
  Pending:     ['badge-warn',    '#B8892A'],
  Overbooked:  ['badge-danger',  '#B1452E'],
  Flagged:     ['badge-danger',  '#B1452E'],
};

function FitRing({ score }: { score: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const fill = circ * score / 100;
  const color = score >= 85 ? '#0E7A4B' : score >= 70 ? '#B8892A' : '#9BA09D';
  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#F1F2F1" strokeWidth="8"/>
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 36 36)"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{score}</div>
        <div className="mono muted" style={{ fontSize: 9, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 1 }}>Fit</div>
      </div>
    </div>
  );
}

const SCORE_LABELS: Record<string, string> = {
  indicationMatch: 'Indication match',
  phaseExperience: 'Phase experience',
  enrollmentVelocity: 'Enrollment velocity',
  publicationVelocity: 'Publication velocity',
  capacity: 'Capacity signal',
  institutionalTrack: 'Institutional track',
  responsiveness: 'Responsiveness',
  regulatoryRigor: 'Regulatory rigor',
};

export default function Inspector({ inv, onClose, onCompare, compareIds }: Props) {
  if (!inv) {
    return (
      <aside className="inspector">
        <div style={{ padding: '48px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: .35, marginBottom: 12 }}><Icon.TestTube size={28} /></div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No investigator selected</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>Click a row in the table to open the dossier.</div>
        </div>
      </aside>
    );
  }

  const [badgeCls, dotColor] = STATUS_MAP[inv.status] ?? ['badge-neutral', '#9BA09D'];

  const scoreEntries = Object.entries(inv.scoreBreakdown).map(([k, v]) => ({
    key: k,
    label: SCORE_LABELS[k] ?? k,
    value: v,
  }));

  const velocityData = inv.velocityHistory.map((v, i) => ({ i, v }));

  const inCompare = compareIds.includes(inv.id);

  return (
    <aside className="inspector">
      <div className="inspector-header">
        <div className="avatar avatar-lg">{inv.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Dr. {inv.name}</span>
            {inv.isRisingStar && <span className="rising-star-badge">Rising star</span>}
            {inv.has483Flag && <span className="badge badge-danger" style={{ height: 16, fontSize: 10 }}>483 flag</span>}
            {inv.rareDiseaseExpert && <span className="badge badge-info" style={{ height: 16, fontSize: 10 }}>Rare disease</span>}
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{inv.credentials} · {inv.site}</div>
          <div className="muted mono" style={{ fontSize: 11, marginTop: 2 }}>
            {inv.city}, {inv.country}
            {inv.npi && <> · NPI <span style={{ color: 'var(--atlas-accent)' }}>{inv.npi}</span></>}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close inspector" style={{ flexShrink: 0 }}>
          <Icon.X size={14} />
        </button>
      </div>

      <div className="inspector-body">
        {/* Fit score + summary */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <FitRing score={inv.fit} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              {inv.fit >= 85 ? 'Strong' : inv.fit >= 70 ? 'Good' : 'Moderate'} match for{' '}
              <span style={{ color: 'var(--atlas-accent)' }}>{inv.indicationTags[0]}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`badge ${badgeCls}`}>
                <span className="badge-dot" style={{ background: dotColor }}/>
                {inv.status}
              </span>
              <span className="muted mono" style={{ fontSize: 11 }}>{inv.activeTrials} active trials</span>
            </div>
          </div>
        </div>

        <div className="divider"/>

        {/* Score breakdown */}
        <div className="inspector-section-title">Score breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {scoreEntries.map(({ key, label, value }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--atlas-fg)', width: 148, flexShrink: 0 }}>{label}</div>
              <div className="bar" style={{ flex: 1 }}>
                <span style={{
                  width: `${value}%`,
                  background: value >= 80 ? 'var(--atlas-green-600)' : value >= 60 ? 'var(--atlas-warn-500)' : 'var(--atlas-neutral-400)',
                }}/>
              </div>
              <div className="mono" style={{ fontSize: 12, fontWeight: 600, width: 26, textAlign: 'right' }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="divider"/>

        {/* Institution */}
        <div className="inspector-section-title">Institution</div>
        <div style={{ background: 'var(--atlas-bg-sunken)', border: '1px solid var(--atlas-border)', borderRadius: 6, padding: '10px 12px' }}>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{inv.institution.name}</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{inv.institution.type}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12 }}>
            <span>Track record <strong className="mono">{inv.institution.trackRecordScore}</strong></span>
            <span>Active trials <strong className="mono">{inv.institution.activeTrialCount}</strong></span>
            {inv.institution.hasMinus80Freezer !== undefined && (
              <span style={{ color: inv.institution.hasMinus80Freezer ? 'var(--atlas-green-600)' : 'var(--atlas-danger-500)' }}>
                {inv.institution.hasMinus80Freezer ? <Icon.Check size={12}/> : <Icon.X size={12}/>} −80°C freezer
              </span>
            )}
          </div>
          {inv.institution.ehrSystem && (
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>EHR: {inv.institution.ehrSystem}</div>
          )}
        </div>

        <div className="divider"/>

        {/* Enrollment velocity sparkline */}
        <div className="inspector-section-title">Enrollment velocity</div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                {velocityData.map((_, i) => (
                  <Cell key={i} fill={i === velocityData.length - 1 ? '#0E7A4B' : '#A9D3B7'} />
                ))}
              </Bar>
              <Tooltip
                contentStyle={{ background: 'var(--atlas-bg-elevated)', border: '1px solid var(--atlas-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--atlas-font-mono)' }}
                formatter={(v) => [`${v} enrollments`, '']}
                cursor={{ fill: 'var(--atlas-bg-hover)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="muted mono" style={{ fontSize: 11, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>{2026 - inv.velocityHistory.length + 1} Q1</span>
          <span>2026 Q1</span>
        </div>

        <div className="divider"/>

        {/* Publications */}
        <div className="inspector-section-title">Recent publications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {inv.publications.map((pub, i) => (
            <div key={pub.pubmedId} style={{
              padding: '9px 0',
              borderBottom: i < inv.publications.length - 1 ? '1px solid var(--atlas-neutral-100)' : 'none',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pubmedId}/`}
                target="_blank" rel="noopener noreferrer"
                className="cite-pill" style={{ flexShrink: 0, marginTop: 1 }}
              >
                {pub.pubmedId}
              </a>
              <div>
                <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--atlas-fg)' }}>{pub.title}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                  {pub.journal} · {pub.year} · {pub.citationCount} citations
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"/>

        {/* Trials */}
        <div className="inspector-section-title">Trial history</div>
        {inv.recentTrials.map(trial => (
          <div key={trial.nctId} style={{
            padding: '8px 10px', borderRadius: 6, marginBottom: 6,
            background: 'var(--atlas-bg-sunken)', border: '1px solid var(--atlas-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{trial.title}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 3, display: 'flex', gap: 8 }}>
                  <a href={`https://clinicaltrials.gov/study/${trial.nctId}`} target="_blank" rel="noopener noreferrer" className="cite-pill">{trial.nctId}</a>
                  <span>{trial.phase}</span>
                  <span>{trial.role}</span>
                  <span>{trial.year}</span>
                </div>
              </div>
              <span className={`badge ${trial.status === 'Completed' ? 'badge-neutral' : 'badge-success'}`} style={{ flexShrink: 0, fontSize: 10, height: 18 }}>
                {trial.status}
              </span>
            </div>
            {trial.drug && <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>{trial.drug}</div>}
          </div>
        ))}

        <div className="divider"/>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Icon.Send size={14} /> Request outreach
          </button>
          <button
            className={`btn ${inCompare ? 'btn-secondary' : 'btn-secondary'}`}
            onClick={() => onCompare(inv)}
            title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
            style={{ background: inCompare ? 'var(--atlas-accent-bg)' : undefined, color: inCompare ? 'var(--atlas-green-800)' : undefined }}
          >
            <Icon.Columns size={14} />
            {inCompare ? 'In compare' : 'Compare'}
          </button>
          <button className="btn btn-secondary" title="Bookmark">
            <Icon.Bookmark size={14} />
          </button>
          <button className="btn btn-secondary" title="View on ClinicalTrials.gov">
            <Icon.External size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

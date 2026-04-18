'use client';
import type { Investigator } from '@/types/investigator';
import * as Icon from './Icons';

type Props = {
  investigators: Investigator[];
  onRemove: (id: string) => void;
  onClose: () => void;
};

const SCORE_LABELS: Record<string, string> = {
  indicationMatch:    'Indication match',
  phaseExperience:    'Phase experience',
  enrollmentVelocity: 'Enrollment velocity',
  publicationVelocity:'Publication velocity',
  capacity:           'Capacity signal',
  institutionalTrack: 'Institutional track',
  responsiveness:     'Responsiveness',
  regulatoryRigor:    'Regulatory rigor',
};

function ScoreBar({ value }: { value: number }) {
  const color = value >= 80 ? 'var(--atlas-green-600)' : value >= 60 ? 'var(--atlas-warn-500)' : 'var(--atlas-neutral-400)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="bar" style={{ flex: 1 }}>
        <span style={{ width: `${value}%`, background: color }}/>
      </div>
      <span className="mono" style={{ fontSize: 12, fontWeight: 600, width: 24, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function CompareView({ investigators, onRemove, onClose }: Props) {
  if (investigators.length === 0) {
    return (
      <aside className="inspector" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div className="muted" style={{ fontSize: 13 }}>Select investigators to compare</div>
      </aside>
    );
  }

  const scoreKeys = Object.keys(SCORE_LABELS);
  const maxInv = investigators.reduce((best, inv) => inv.fit > best.fit ? inv : best, investigators[0]);

  return (
    <aside className="inspector" style={{ width: investigators.length >= 3 ? 560 : undefined }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--atlas-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Columns size={16} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Compare investigators</span>
          <span className="badge badge-neutral" style={{ height: 16, fontSize: 10 }}>{investigators.length} selected</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon.X size={14}/></button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Investigator headers */}
        <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(${investigators.length}, 1fr)`, gap: 0 }}>
          <div style={{ padding: '12px 12px', borderBottom: '1px solid var(--atlas-border)', borderRight: '1px solid var(--atlas-border)' }} />
          {investigators.map(inv => (
            <div key={inv.id} style={{ padding: '12px 12px', borderBottom: '1px solid var(--atlas-border)', borderRight: '1px solid var(--atlas-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Dr. {inv.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{inv.site}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{inv.city}, {inv.country}</div>
                </div>
                <button className="btn btn-ghost btn-xs" onClick={() => onRemove(inv.id)} title="Remove from comparison">
                  <Icon.X size={10}/>
                </button>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`fit ${inv.fit >= 85 ? 'fit-hi' : inv.fit >= 70 ? 'fit-med' : 'fit-lo'}`}>{inv.fit}</span>
                {inv.id === maxInv.id && <span className="badge badge-success" style={{ height: 16, fontSize: 10 }}>Best fit</span>}
                {inv.isRisingStar && <span className="rising-star-badge">Rising star</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        {[
          { label: 'Status',         render: (inv: Investigator) => <span>{inv.status}</span> },
          { label: 'Enrollments',    render: (inv: Investigator) => <span className="mono">{inv.enrollments}</span> },
          { label: 'Active trials',  render: (inv: Investigator) => <span className={`mono${inv.activeTrials > 8 ? ' flag-danger' : ''}`}>{inv.activeTrials}</span> },
          { label: 'Velocity/yr',    render: (inv: Investigator) => <span className="mono">{inv.velocity}</span> },
          { label: 'Publications',   render: (inv: Investigator) => <span className="mono">{inv.publications.length}</span> },
          { label: '483 flag',       render: (inv: Investigator) => <span style={{ color: inv.has483Flag ? 'var(--atlas-danger-500)' : 'var(--atlas-green-600)' }}>{inv.has483Flag ? 'Yes' : 'None'}</span> },
        ].map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: `140px repeat(${investigators.length}, 1fr)`, gap: 0 }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--atlas-neutral-100)', borderRight: '1px solid var(--atlas-border)', fontSize: 12, color: 'var(--atlas-fg-muted)', display: 'flex', alignItems: 'center' }}>
              {row.label}
            </div>
            {investigators.map(inv => (
              <div key={inv.id} style={{ padding: '8px 12px', borderBottom: '1px solid var(--atlas-neutral-100)', borderRight: '1px solid var(--atlas-border)', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                {row.render(inv)}
              </div>
            ))}
          </div>
        ))}

        {/* Score breakdown */}
        <div style={{ padding: '10px 12px', background: 'var(--atlas-bg-sunken)', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--atlas-fg-muted)', borderBottom: '1px solid var(--atlas-border)', borderTop: '1px solid var(--atlas-border)' }}>
          Score breakdown
        </div>
        {scoreKeys.map(key => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: `140px repeat(${investigators.length}, 1fr)`, gap: 0 }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--atlas-neutral-100)', borderRight: '1px solid var(--atlas-border)', fontSize: 12, color: 'var(--atlas-fg-muted)', display: 'flex', alignItems: 'center' }}>
              {SCORE_LABELS[key]}
            </div>
            {investigators.map(inv => (
              <div key={inv.id} style={{ padding: '8px 12px', borderBottom: '1px solid var(--atlas-neutral-100)', borderRight: '1px solid var(--atlas-border)' }}>
                <ScoreBar value={(inv.scoreBreakdown as Record<string, number>)[key] ?? 0} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

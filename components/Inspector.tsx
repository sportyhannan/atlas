'use client';
import { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioScript, setAudioScript] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [audioInvId, setAudioInvId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset audio state when investigator changes
  if (inv.id !== audioInvId) {
    setAudioInvId(inv.id);
    setAudioState('idle');
    setAudioUrl(null);
    setAudioScript(null);
    setShowScript(false);
  }

  const handleAudioBriefing = async () => {
    if (audioState === 'ready' && audioRef.current) {
      audioRef.current.play();
      return;
    }
    setAudioState('loading');
    setAudioUrl(null);
    setAudioScript(null);
    try {
      const res = await fetch('/api/audio-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investigatorId: inv.id }),
      });
      const data = await res.json();
      setAudioScript(data.script ?? null);
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        setAudioState('ready');
      } else {
        setAudioState('error');
        setShowScript(true);
      }
    } catch {
      setAudioState('error');
    }
  };

  const [badgeCls, dotColor] = STATUS_MAP[inv.status] ?? ['badge-neutral', '#9BA09D'];

  const scoreEntries = Object.entries(inv.scoreBreakdown).map(([k, v]) => ({
    key: k,
    label: SCORE_LABELS[k] ?? k,
    value: v,
  }));

  const startYear = 2026 - inv.velocityHistory.length;
  const velocityData = inv.velocityHistory.map((v, i) => ({ year: startYear + i, v }));

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
            {/* Data provenance chips */}
            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
              {inv.recentTrials.length > 0 && <span className="registry-tag registry-tag-ct">CT.gov</span>}
              {inv.publications.length > 0 && <span className="registry-tag registry-tag-pm">PubMed</span>}
              {inv.publications.length > 0 && <span className="registry-tag registry-tag-oa">OpenAlex</span>}
              {inv.npi && <span className="registry-tag registry-tag-npi">NPI</span>}
              {inv.has483Flag && <span className="registry-tag registry-tag-fda">FDA 483</span>}
              {(inv.rareDiseaseExpert || inv.country !== 'US') && <span className="registry-tag registry-tag-who">WHO ICTRP</span>}
            </div>
          </div>
        </div>

        <div className="divider"/>

        {/* Audio briefing */}
        <div style={{ marginBottom: 4 }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', gap: 8 }}
            onClick={handleAudioBriefing}
            disabled={audioState === 'loading'}
            title="Generate a 45-second spoken dossier via ElevenLabs"
          >
            {audioState === 'loading'
              ? <><Icon.Loader size={15}/> Generating briefing…</>
              : audioState === 'ready'
              ? <><Icon.Play size={15}/> Play audio briefing</>
              : <><Icon.Headphones size={15}/> Audio briefing</>
            }
          </button>

          {audioState === 'ready' && audioUrl && (
            <div style={{ marginTop: 8, background: 'var(--atlas-bg-sunken)', border: '1px solid var(--atlas-border)', borderRadius: 6, padding: '8px 10px' }}>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                autoPlay
                style={{ width: '100%', height: 32, accentColor: 'var(--atlas-green-600)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span className="muted mono" style={{ fontSize: 10 }}>Generated by ElevenLabs · Claude Haiku script</span>
                <button className="btn btn-ghost btn-xs" onClick={() => setShowScript(s => !s)} style={{ fontSize: 10, height: 18 }}>
                  {showScript ? 'Hide script' : 'View script'}
                </button>
              </div>
            </div>
          )}

          {audioState === 'error' && (
            <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--atlas-warn-50)', border: '1px solid var(--atlas-warn-500)', borderRadius: 4, fontSize: 11, color: 'var(--atlas-warn-700)' }}>
              Audio unavailable — add ELEVENLABS_API_KEY to enable
            </div>
          )}

          {showScript && audioScript && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--atlas-bg-sunken)', border: '1px solid var(--atlas-border)', borderRadius: 6, fontSize: 12, lineHeight: 1.55, color: 'var(--atlas-fg-muted)' }}>
              {audioScript}
            </div>
          )}
        </div>

        <div className="divider"/>

        {/* Score breakdown */}
        <div className="inspector-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Score breakdown</span>
          <span className="section-source">Computed across 6 registries</span>
        </div>
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
        <div className="inspector-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Enrollment velocity</span>
          <span className="section-source">Source: ClinicalTrials.gov · WHO ICTRP</span>
        </div>
        <div style={{ height: 64 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityData} margin={{ top: 0, bottom: 16, left: 0, right: 0 }}>
              <XAxis
                dataKey="year"
                tick={{ fontSize: 9, fontFamily: 'var(--atlas-font-mono)', fill: 'var(--atlas-fg-muted)' }}
                axisLine={false} tickLine={false}
              />
              <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                {velocityData.map((_, i) => (
                  <Cell key={i} fill={i === velocityData.length - 1 ? '#0E7A4B' : '#A9D3B7'} />
                ))}
              </Bar>
              <Tooltip
                contentStyle={{ background: 'var(--atlas-bg-elevated)', border: '1px solid var(--atlas-border)', borderRadius: 4, fontSize: 11, fontFamily: 'var(--atlas-font-mono)' }}
                formatter={(v) => [`${v} enrollments/yr`, '']}
                cursor={{ fill: 'var(--atlas-bg-hover)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="divider"/>

        {/* Publications */}
        <div className="inspector-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Recent publications</span>
          <span className="section-source">Source: PubMed · OpenAlex</span>
        </div>
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
        <div className="inspector-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Trial history</span>
          <span className="section-source">Source: ClinicalTrials.gov</span>
        </div>
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

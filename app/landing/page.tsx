'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { Investigator, SearchResult, ReasoningStep } from '@/types/investigator';

// ── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ texts, speed = 50 }: { texts: string[]; speed?: number }) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    if (pause) return;
    const target = texts[ti];
    const t = setTimeout(() => {
      if (!deleting) {
        if (ci < target.length) { setDisplay(target.slice(0, ci + 1)); setCi(c => c + 1); }
        else { setPause(true); setTimeout(() => { setDeleting(true); setPause(false); }, 2600); }
      } else {
        if (ci > 0) { setDisplay(target.slice(0, ci - 1)); setCi(c => c - 1); }
        else { setDeleting(false); setTi(t => (t + 1) % texts.length); }
      }
    }, deleting ? speed / 2.2 : speed);
    return () => clearTimeout(t);
  }, [ci, deleting, pause, speed, texts, ti]);
  return <span>{display}<span style={{ borderRight: '2px solid #0E7A4B', animation: 'blink 1s step-end infinite' }}>&nbsp;</span></span>;
}

// ── Counter ──────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', prefix = '', duration = 2000 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ── Scroll fade ──────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px)', transition: `opacity .6s ${delay}ms ease, transform .6s ${delay}ms ease`, ...style }}>
      {children}
    </div>
  );
}

// ── Live Demo Modal ──────────────────────────────────────────────────────────
function DemoModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('Phase 3 R/R DLBCL, rising stars only');
  const [steps, setSteps] = useState<ReasoningStep[]>([]);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [running, setRunning] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  const runDemo = useCallback(async (q: string) => {
    setRunning(true);
    setSteps([]);
    setResult(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      if (!res.body) throw new Error('no body');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const p = JSON.parse(line.slice(6));
            if (p.type === 'step') setSteps(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, agent: p.agent, action: p.text, detail: p.detail }]);
            if (p.type === 'results') setResult(p.data);
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => { runDemo(query); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (stepsRef.current) stepsRef.current.scrollTop = stepsRef.current.scrollHeight;
  }, [steps]);

  const green = '#0E7A4B';
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,19,17,.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,.4)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7E6', display: 'flex', alignItems: 'center', gap: 12, background: '#FAFAF9' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: green, animation: 'pulse 2s infinite' }}/>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1311' }}>Atlas Live Demo</span>
          <span style={{ fontSize: 12, color: '#9BA09D', ...mono }}>— real API, real data pipeline</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9BA09D', fontSize: 18, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>

        {/* Search bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F2F1', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: `1.5px solid ${result ? green : running ? '#76B68D' : '#E5E7E6'}`, borderRadius: 8, padding: '8px 12px', transition: 'border-color .3s' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !running) runDemo(query); }}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#0F1311', background: 'transparent', ...mono }}
              placeholder="Type a trial brief…" />
          </div>
          <button onClick={() => runDemo(query)} disabled={running}
            style={{ background: running ? '#9BA09D' : green, color: 'white', border: 'none', borderRadius: 8, padding: '0 18px', fontSize: 13, fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer', transition: 'background .2s' }}>
            {running ? '…' : '→'}
          </button>
        </div>

        {/* Reasoning trace */}
        <div ref={stepsRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', background: '#FAFAF9', minHeight: 160, maxHeight: 220 }}>
          {steps.length === 0 && !running && (
            <div style={{ fontSize: 12, color: '#9BA09D', ...mono }}>Ready — press → to run</div>
          )}
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', gap: 8, marginBottom: 8, animation: 'fadeSlideIn .2s ease both' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: i === steps.length - 1 && running ? '#B8892A' : green, marginTop: 4, flexShrink: 0, ...(i === steps.length - 1 && running ? { animation: 'pulse 1s infinite' } : {}) }}/>
              <div>
                <span style={{ fontSize: 11, color: '#9BA09D', fontWeight: 600, ...mono, marginRight: 6 }}>{s.agent}</span>
                <span style={{ fontSize: 12, color: '#4B514E', ...mono }}>{s.action}</span>
              </div>
            </div>
          ))}
          {running && steps.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#B8892A', marginTop: 4, animation: 'pulse 1s infinite', flexShrink: 0 }}/>
              <span style={{ fontSize: 12, color: '#9BA09D', ...mono }}>running…</span>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div style={{ borderTop: '1px solid #E5E7E6', padding: '14px 20px' }}>
            <div style={{ fontSize: 11, color: '#9BA09D', ...mono, marginBottom: 10 }}>
              {result.totalFound} investigators · {result.risingStarCount} rising stars · {result.queryMs}ms
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 210, overflowY: 'auto' }}>
              {result.investigators.slice(0, 4).map(inv => (
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#FAFAF9', border: '1px solid #E5E7E6', borderRadius: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#A9D3B7,#0E7A4B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{inv.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Dr. {inv.name} {inv.isRisingStar && <span style={{ fontSize: 9, background: '#FEF3C7', color: '#92400E', borderRadius: 2, padding: '1px 5px', fontWeight: 700, marginLeft: 4 }}>★ RISING STAR</span>}</div>
                    <div style={{ fontSize: 11, color: '#9BA09D', marginTop: 1 }}>{inv.site} · {inv.city}, {inv.country}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: inv.fit >= 85 ? green : inv.fit >= 70 ? '#B8892A' : '#9BA09D', ...mono }}>{inv.fit}</div>
                    <div style={{ fontSize: 9, color: '#9BA09D' }}>FIT</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #E5E7E6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAF9' }}>
          <span style={{ fontSize: 11, color: '#9BA09D', ...mono }}>Demo uses live API · Mock investigator data</span>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: green, color: 'white', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Open full dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── World map dots ───────────────────────────────────────────────────────────
const INVESTIGATORS_MAP = [
  { name: 'Chuka Okonkwo',      city: 'Lagos',          lat: 6.5,   lng: 3.4,    fit: 92, star: true  },
  { name: 'Amelia Park',        city: 'Seoul',          lat: 37.5,  lng: 126.9,  fit: 88, star: false },
  { name: 'Jason Westin',       city: 'Houston',        lat: 29.7,  lng: -95.4,  fit: 76, star: false },
  { name: 'Magda Kowalski',     city: 'Warsaw',         lat: 52.2,  lng: 21.0,   fit: 84, star: true  },
  { name: 'Priya Nair',         city: 'Mumbai',         lat: 19.1,  lng: 72.9,   fit: 79, star: false },
  { name: 'Ji-hoon Lee',        city: 'Seoul',          lat: 37.6,  lng: 127.0,  fit: 81, star: false },
  { name: 'Rafael Santos',      city: 'São Paulo',      lat: -23.6, lng: -46.6,  fit: 87, star: false },
  { name: 'Nandi Mokoena',      city: 'Cape Town',      lat: -33.9, lng: 18.5,   fit: 71, star: true  },
  { name: 'Johnny Mahlangu',    city: 'Johannesburg',   lat: -26.2, lng: 28.0,   fit: 93, star: false },
  { name: 'Elena Santagostino', city: 'Milan',          lat: 45.5,  lng: 9.2,    fit: 89, star: false },
  { name: 'David Weinberg',     city: 'Houston',        lat: 29.71, lng: -95.39, fit: 72, star: false },
  { name: 'Isabela Ferreira',   city: 'Rio de Janeiro', lat: -22.9, lng: -43.2,  fit: 83, star: true  },
];

function latLngToPercent(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

function WorldMap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const green = '#0E7A4B';
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '46%', background: '#EDF6F0', borderRadius: 16, overflow: 'hidden', border: '1px solid #D6EADD' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(14,122,75,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(14,122,75,.07) 1px, transparent 1px)', backgroundSize: '6.25% 11.11%' }}/>
      {[30, 50, 70].map(p => <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(14,122,75,.1)' }}/>)}
      {INVESTIGATORS_MAP.map((inv, i) => {
        const { x, y } = latLngToPercent(inv.lat, inv.lng);
        const isHov = hovered === i;
        return (
          <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', zIndex: isHov ? 10 : 2, cursor: 'default' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `2px solid ${inv.star ? '#B8892A' : green}`, opacity: .35, animation: `ring ${1.8 + i * .15}s ease-out infinite` }}/>
            <div style={{ width: inv.fit >= 85 ? 12 : 9, height: inv.fit >= 85 ? 12 : 9, borderRadius: '50%', background: inv.star ? '#B8892A' : green, border: '2px solid white', boxShadow: `0 0 ${inv.fit >= 85 ? 10 : 6}px ${inv.star ? 'rgba(184,137,42,.5)' : 'rgba(14,122,75,.5)'}` }}/>
            {isHov && (
              <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: '#0F1311', color: '#F0FFF4', borderRadius: 8, padding: '7px 12px', fontSize: 12, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,.25)', zIndex: 20 }}>
                <div style={{ fontWeight: 600 }}>Dr. {inv.name}</div>
                <div style={{ opacity: .6, fontSize: 11, marginTop: 2 }}>{inv.city} · Fit {inv.fit}</div>
                {inv.star && <div style={{ color: '#F59E0B', fontSize: 10, marginTop: 2, fontWeight: 600 }}>★ Rising star</div>}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ position: 'absolute', bottom: 14, left: 16, display: 'flex', gap: 16, fontSize: 11, color: '#4B514E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: green, border: '1.5px solid white' }}/> Investigator</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B8892A', border: '1.5px solid white' }}/> Rising star</div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 16, fontSize: 10, color: '#9BA09D', fontFamily: "'IBM Plex Mono', monospace" }}>Demo data</div>
    </div>
  );
}

// ── Pipeline diagram ─────────────────────────────────────────────────────────
function PipelineDiagram() {
  const [active, setActive] = useState(-1);
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  useEffect(() => {
    const iv = setInterval(() => setActive(a => (a + 1) % 6), 900);
    return () => clearInterval(iv);
  }, []);
  const box = (label: string, sub: string, color: string, bg: string, i: number) => (
    <div style={{ flex: 1, padding: '14px 16px', background: active === i ? bg : '#FAFAF9', border: `1.5px solid ${active === i ? color : '#E5E7E6'}`, borderRadius: 10, transition: 'all .4s ease', boxShadow: active === i ? `0 4px 20px ${bg}` : 'none' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: active === i ? color : '#9BA09D', ...mono, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#4B514E', lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
  const arrow = () => <div style={{ color: '#CDD0CE', fontSize: 18, alignSelf: 'center', flexShrink: 0 }}>→</div>;
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E5E7E6', borderRadius: 16, padding: '28px 24px' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
        {box('Query', 'Natural language trial brief', '#0E7A4B', '#EDF6F0', 0)}
        {arrow()}
        {box('Gemini 2.5 Flash', 'Parses intent → structured criteria', '#1E4D91', '#EBF4FF', 1)}
        {arrow()}
        <div style={{ flex: 1, padding: '10px 12px', background: active >= 2 && active <= 4 ? '#EDF6F0' : '#FAFAF9', border: `1.5px solid ${active >= 2 && active <= 4 ? '#0E7A4B' : '#E5E7E6'}`, borderRadius: 10, transition: 'all .4s ease' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#0E7A4B', ...mono, marginBottom: 8 }}>Dedalus Containers — parallel</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { l: 'Enrichment', s: 'PubMed · NPI · FDA' },
              { l: 'Identity', s: 'Dedup across registries' },
              { l: 'Scoring', s: 'K2 Think V2 · 8-factor' },
            ].map((a, i) => (
              <div key={i} style={{ flex: 1, padding: '8px 10px', background: active === i + 2 ? '#D6EADD' : 'white', border: `1px solid ${active === i + 2 ? '#0E7A4B' : '#E5E7E6'}`, borderRadius: 7, transition: 'all .4s ease' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0E7A4B', ...mono }}>{a.l}</div>
                <div style={{ fontSize: 10, color: '#9BA09D', marginTop: 2 }}>{a.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 0 }}>
        <div style={{ color: '#CDD0CE', fontSize: 18, marginRight: 'auto', marginLeft: '66%' }}>↓</div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        <div style={{ flex: '0 0 66%' }}/>
        {box('Dossier', 'Evidence-cited · scored · audio-ready', '#0E7A4B', '#EDF6F0', 5)}
        <div style={{ flex: '0 0 10px', display: 'flex', alignItems: 'center', fontSize: 11, color: '#9BA09D', ...mono, flexShrink: 0, whiteSpace: 'nowrap' }}>ElevenLabs →</div>
        {box('Audio brief', '45s spoken summary · Rachel voice', '#4C1D95', '#F5F3FF', 5)}
      </div>
    </div>
  );
}

// ── Score card ───────────────────────────────────────────────────────────────
function ScoreCard() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  const green = '#0E7A4B';
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const factors = [
    { label: 'Indication match',    value: 96, src: 'CT.gov + PubMed'         },
    { label: 'Phase experience',    value: 88, src: 'ClinicalTrials.gov'       },
    { label: 'Enrollment velocity', value: 85, src: 'CT.gov + WHO ICTRP'      },
    { label: 'Publication velocity',value: 94, src: 'PubMed + OpenAlex'       },
    { label: 'Capacity signal',     value: 91, src: 'CT.gov active trials'    },
    { label: 'Institutional track', value: 84, src: 'CT.gov site history'     },
    { label: 'Responsiveness',      value: 95, src: 'Historical startup time' },
    { label: 'Regulatory rigor',    value: 100,src: 'FDA BMIS + 483 records'  },
  ];
  return (
    <div ref={ref} style={{ background: 'white', border: '1px solid #E5E7E6', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F2F1', display: 'flex', alignItems: 'center', gap: 12, background: '#FAFAF9' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#A9D3B7,#0E7A4B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>CO</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            Dr. Chuka Okonkwo
            <span style={{ fontSize: 9, background: '#FEF3C7', color: '#92400E', borderRadius: 3, padding: '2px 6px', fontWeight: 700, letterSpacing: '.04em' }}>RISING STAR</span>
          </div>
          <div style={{ fontSize: 11, color: '#9BA09D', marginTop: 2 }}>Lagos University Teaching Hospital · MBBS, FWACS</div>
          <div style={{ fontSize: 10, color: '#CDD0CE', ...mono, marginTop: 2 }}>Demo investigator profile</div>
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative', width: 60, height: 60 }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#F1F2F1" strokeWidth="6"/>
            <circle cx="30" cy="30" r="25" fill="none" stroke={green} strokeWidth="6"
              strokeDasharray={`${visible ? 2 * Math.PI * 25 * 0.92 : 0} ${2 * Math.PI * 25}`}
              strokeLinecap="round" transform="rotate(-90 30 30)"
              style={{ transition: 'stroke-dasharray 1.2s ease' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F1311', lineHeight: 1 }}>92</div>
            <div style={{ fontSize: 8, color: '#9BA09D', letterSpacing: '.04em' }}>FIT</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {factors.map((f, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#313633', fontWeight: 500 }}>{f.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#9BA09D', ...mono }}>{f.src}</span>
                <span style={{ fontSize: 12, fontWeight: 700, ...mono, color: f.value >= 90 ? green : f.value >= 80 ? '#4B514E' : '#B8892A' }}>{f.value}</span>
              </div>
            </div>
            <div style={{ height: 5, background: '#F1F2F1', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: f.value >= 90 ? green : f.value >= 80 ? '#76B68D' : '#B8892A', borderRadius: 3, width: visible ? `${f.value}%` : '0%', transition: `width 1s ${i * 80}ms ease` }}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 20px', borderTop: '1px solid #F1F2F1', background: '#FAFAF9', fontSize: 11, color: '#CDD0CE', ...mono }}>
        8 factors · each traced to primary registry source
      </div>
    </div>
  );
}

// ── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalc() {
  const [protocols, setProtocols] = useState(8);
  const green = '#0E7A4B';
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

  // Industry estimates: CRO feasibility ~$30K/protocol, 6 analyst-weeks at $100/hr burdened
  const croFees = protocols * 30000;
  const analystHours = protocols * 6 * 40; // 6 weeks × 40 hr
  const atlasCost = protocols * 15000;
  const netSaving = croFees - atlasCost;
  const roi = Math.round((netSaving / atlasCost) * 100);

  return (
    <div style={{ background: 'white', border: '1px solid #E5E7E6', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
      <div style={{ padding: '28px 32px', borderBottom: '1px solid #F1F2F1', background: '#FAFAF9' }}>
        <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 8 }}>ROI Calculator</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#0F1311', marginBottom: 6 }}>How much does your current process cost?</div>
        <div style={{ fontSize: 14, color: '#6D7370' }}>Based on industry-average CRO feasibility fees ($30K/protocol) and analyst time (6 weeks × 3 analysts).</div>
      </div>
      <div style={{ padding: '28px 32px' }}>
        {/* Slider */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Phase 2–3 protocols initiated per year</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: green, ...mono }}>{protocols}</span>
          </div>
          <input type="range" min={1} max={50} value={protocols} onChange={e => setProtocols(+e.target.value)}
            style={{ width: '100%', accentColor: green, height: 4, cursor: 'pointer' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9BA09D', marginTop: 4, ...mono }}>
            <span>1</span><span>25</span><span>50</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'CRO fees replaced', val: `$${(croFees / 1000).toFixed(0)}K`, sub: 'annual feasibility spend', color: '#B1452E', bg: '#FAEDEA', border: '#F9C4B8' },
            { label: 'Analyst weeks freed', val: `${Math.round(analystHours / 40)}`, sub: 'analyst-weeks per year', color: '#B8892A', bg: '#FFF7ED', border: '#FCD9A8' },
            { label: 'Net annual savings', val: `$${(netSaving / 1000).toFixed(0)}K`, sub: `vs. $${(atlasCost/1000).toFixed(0)}K Atlas cost`, color: green, bg: '#EDF6F0', border: '#A9D3B7' },
          ].map((m, i) => (
            <div key={i} style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 900, color: m.color, ...mono, lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#313633', marginTop: 6 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: '#9BA09D', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ROI highlight */}
        <div style={{ background: green, borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: 'white', ...mono, lineHeight: 1 }}>{roi}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>ROI</div>
          </div>
          <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,.2)' }}/>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>At {protocols} protocols/year, Atlas pays for itself {Math.round(roi / 100 + 1)}× over.</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.55 }}>
              That's before counting the value of finding the right investigator 6 weeks earlier — at $1M/day Phase 3 burn, one week of faster startup recovers your entire annual Atlas subscription.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Market section ────────────────────────────────────────────────────────────
function MarketSection() {
  const green = '#0E7A4B';
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  return (
    <section style={{ padding: '80px 48px', background: 'white', borderTop: '1px solid #E5E7E6', borderBottom: '1px solid #E5E7E6' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 16 }}>Market opportunity</div>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18, color: '#0F1311' }}>
              A $65B industry that still<br/>runs on spreadsheets and CRO calls.
            </h2>
            <p style={{ fontSize: 16, color: '#6D7370', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              The global clinical research services market reached $65B in 2025. Site identification and investigator feasibility — the part Atlas replaces — represents an estimated $8–12B of that, with no dominant software solution.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          {/* TAM/SAM/SOM */}
          <FadeIn>
            <div>
              {[
                { label: 'TAM', amount: '$65B', desc: 'Global clinical research services market (IQVIA estimate, 2025)', pct: 100, color: '#335784', bg: '#EBF4FF', border: '#BEDCFF' },
                { label: 'SAM', amount: '$9.7B', desc: 'Site identification, feasibility, and investigator selection services', pct: 65, color: green, bg: '#EDF6F0', border: '#A9D3B7' },
                { label: 'SOM', amount: '$150M', desc: 'Top 200 pharma/biotech sponsors, 10% penetration at $15K–50K/protocol', pct: 30, color: '#92400E', bg: '#FFF7ED', border: '#FCD9A8' },
              ].map((t, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, ...mono, color: t.color, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 3, padding: '2px 7px', flexShrink: 0 }}>{t.label}</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#0F1311', ...mono, letterSpacing: '-.03em' }}>{t.amount}</span>
                  </div>
                  <div style={{ height: 8, background: '#F1F2F1', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', background: t.color, borderRadius: 4, width: `${t.pct}%`, opacity: .8 }}/>
                  </div>
                  <div style={{ fontSize: 12, color: '#6D7370', lineHeight: 1.55 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Business model + customers */}
          <FadeIn delay={80}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Business model */}
              <div style={{ background: '#FAFAF9', border: '1px solid #E5E7E6', borderRadius: 14, padding: '22px 22px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1311', marginBottom: 14 }}>Business model</div>
                {[
                  { tier: 'Per-protocol', price: '$15K–50K', desc: 'One-time per Phase 2–4 protocol. Price scales with phase and number of global sites targeted.' },
                  { tier: 'Enterprise', price: 'Custom', desc: 'Annual subscription for unlimited protocols. Channel deals with top-5 CROs.' },
                ].map((b, i) => (
                  <div key={i} style={{ paddingBottom: i === 0 ? 14 : 0, marginBottom: i === 0 ? 14 : 0, borderBottom: i === 0 ? '1px solid #E5E7E6' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{b.tier}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: green, ...mono }}>{b.price}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6D7370', lineHeight: 1.55 }}>{b.desc}</div>
                  </div>
                ))}
              </div>

              {/* Customers */}
              <div style={{ background: '#FAFAF9', border: '1px solid #E5E7E6', borderRadius: 14, padding: '22px 22px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1311', marginBottom: 14 }}>Who buys Atlas</div>
                {[
                  { icon: '🏢', label: 'Pharma sponsor clinical ops', detail: 'VP-level buyers. Own the site selection decision. Budget from protocol development line.' },
                  { icon: '🔬', label: 'Biotech sponsors', detail: 'Series B+ companies running their first Phase 2–3. No internal site intel infrastructure.' },
                  { icon: '🌐', label: 'Contract Research Organizations', detail: 'CROs offer feasibility as a service. Atlas replaces manual analyst work at scale.' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.2 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: '#6D7370', lineHeight: 1.5 }}>{c.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Why now */}
              <div style={{ background: '#EDF6F0', border: '1px solid #A9D3B7', borderRadius: 14, padding: '18px 22px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: green, marginBottom: 6 }}>Why now</div>
                <div style={{ fontSize: 13, color: '#313633', lineHeight: 1.65 }}>
                  ClinicalTrials.gov API v2 (2024) opened structured trial data at scale for the first time. Combined with LLM query parsing and distributed compute, what required a 10-person CRO team can now run in under 5 seconds.
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Before timeline ──────────────────────────────────────────────────────────
const BEFORE_STEPS = [
  { week: 'Wk 1', label: 'Manual CT.gov keyword search', sub: 'No structured query. No scoring. Just text search.' },
  { week: 'Wk 2', label: 'Cross-reference publications', sub: 'PubMed, Google Scholar, manually.' },
  { week: 'Wk 3', label: 'Check FDA records', sub: 'BMIS portal. One investigator at a time.' },
  { week: 'Wk 4', label: 'Contact CRO for local intelligence', sub: 'Pay a CRO $30K+ for context you could query.' },
  { week: 'Wk 5', label: 'Send feasibility questionnaires', sub: '60% response rate. 3-week turnaround.' },
  { week: 'Wk 6', label: 'Shortlist 20 investigators', sub: 'After 6 weeks and significant CRO spend.' },
];

// ── Page queries ─────────────────────────────────────────────────────────────
const QUERIES = [
  'Phase 3 R/R DLBCL, 22 sites global, rising stars only',
  'NSCLC East Asia, EGFR-mutant, 15+ enrollments/yr',
  'Hemophilia A/B underrepresented regions, gene therapy exp.',
  'HER2+ metastatic breast cancer, mAb experience, no 483 flags',
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
  const green = '#0E7A4B';
  const greenLight = '#EDF6F0';
  const border = '#E5E7E6';
  const text = '#0F1311';
  const muted = '#6D7370';

  return (
    <div style={{ background: '#FAFAF9', color: text, fontFamily: "'Inter', ui-sans-serif, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.8);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        a{color:inherit;text-decoration:none;}
        button{cursor:pointer;font-family:inherit;}
        ::-webkit-scrollbar{width:3px;background:#FAFAF9;}
        ::-webkit-scrollbar-thumb{background:#0E7A4B;border-radius:2px;}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;}
        input[type=range]::-webkit-slider-runnable-track{background:#E5E7E6;height:4px;border-radius:2px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0E7A4B;margin-top:-7px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.2);}
      `}</style>

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: 'rgba(250,250,249,.92)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke={green} strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill={green}/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke={green} strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.02em' }}>Atlas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['The problem', 'How it works', 'Scoring', 'ROI'].map(l => (
            <span key={l} style={{ fontSize: 13, color: muted, cursor: 'pointer', transition: 'color .15s' }}
              onMouseEnter={e=>(e.currentTarget.style.color=text)} onMouseLeave={e=>(e.currentTarget.style.color=muted)}>{l}</span>
          ))}
          <button onClick={() => setShowDemo(true)} style={{ background: 'white', color: text, border: `1px solid ${border}`, borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 500 }}>Live demo</button>
          <Link href="/"><button style={{ background: green, color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600 }}>Enter Atlas →</button></Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '80px 48px 60px', maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: greenLight, border: `1px solid #A9D3B7`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 500, color: green, marginBottom: 28, ...mono }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: green, animation: 'pulse 2s infinite', display: 'inline-block' }}/>
            6 live registries · ClinicalTrials.gov API v2 · Gemini 2.5 Flash · Dedalus
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24, maxWidth: 820 }}>
            Clinical trial site selection<br/>is broken.{' '}
            <span style={{ color: green }}>We fixed it.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', color: muted, maxWidth: 640, lineHeight: 1.7, marginBottom: 36 }}>
            The average Phase 3 trial misses its enrollment target. Not because the patients aren't there — because the site selection process is built on spreadsheets, CRO calls, and manual CT.gov keyword searches. Atlas is the infrastructure that should have existed a decade ago.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
            <button onClick={() => setShowDemo(true)} style={{ background: green, color: 'white', border: 'none', borderRadius: 8, padding: '13px 26px', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px rgba(14,122,75,.3)' }}>Launch live demo →</button>
            <Link href="/"><button style={{ background: 'white', color: text, border: `1px solid ${border}`, borderRadius: 8, padding: '13px 26px', fontSize: 15, fontWeight: 500 }}>Enter full dashboard</button></Link>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <WorldMap />
          <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: muted, ...mono }}>Hover to explore investigators →</span>
          </div>
        </FadeIn>
      </section>

      {/* ── 3 problem stats ── */}
      <section style={{ padding: '60px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', background: border }}>
            {[
              { stat: '50%+',    color: '#B1452E', label: 'of Phase 3 trials miss enrollment targets',      sub: "The leading cause: wrong sites selected. The right investigator data existed \u2014 it just wasn\u2019t connected." },
              { stat: '6–12 wk', color: '#B8892A', label: 'average time to shortlist investigators',        sub: 'Manual CT.gov searches. CRO feasibility calls. FDA portal checks. One investigator at a time.' },
              { stat: '480K+',   color: green,     label: 'registered trials on ClinicalTrials.gov alone',  sub: 'Plus WHO ICTRP, NPI, FDA BMIS, PubMed, OpenAlex. All public. None of it queryable — until now.' },
            ].map((c, i) => (
              <div key={i} style={{ background: '#FAFAF9', padding: '36px 32px' }}>
                <div style={{ fontSize: 'clamp(40px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-.04em', color: c.color, lineHeight: 1, marginBottom: 14, ...mono }}>{c.stat}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{c.label}</div>
                <div style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Before: manual process ── */}
      <section style={{ padding: '60px 48px 80px', background: 'white', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <FadeIn>
            <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: muted, fontWeight: 600, marginBottom: 14 }}>The broken status quo</div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 16 }}>Six weeks.<br/>Tens of thousands in CRO fees.<br/>20 investigators.</h2>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, marginBottom: 24 }}>This is the process at every major pharma sponsor today. The data you need already exists — in ClinicalTrials.gov, PubMed, FDA inspection records, NPI registries. Nobody has built the infrastructure to connect it.</p>
            <div style={{ padding: '14px 18px', background: '#FAEDEA', border: '1px solid #F9C4B8', borderRadius: 10, fontSize: 13, color: '#7D2D1D', lineHeight: 1.65 }}>
              A VP of Clinical Operations at a top-10 pharma sponsor spends 6–12 weeks on site feasibility for a single protocol. During that time, a competitor may already be onboarding the investigators you needed.
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 2, background: '#F1F2F1' }}/>
              {BEFORE_STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 20, position: 'relative' }}>
                  <div style={{ width: 72, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#E5E7E6', border: '3px solid #FAFAF9', zIndex: 1, position: 'relative' }}/>
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{ fontSize: 10, ...mono, color: '#B1452E', fontWeight: 600, marginBottom: 2 }}>{s.week}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: muted }}>{s.sub}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 72, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#B1452E', border: '3px solid #FAFAF9', zIndex: 1 }}/>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#B1452E' }}>6 weeks later. 20 investigators. One protocol.</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Market & opportunity ── */}
      <MarketSection />

      {/* ── The data exists ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 16 }}>The insight</div>
            <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18 }}>The data already exists.<br/>It just wasn't connected.</h2>
            <p style={{ fontSize: 16, color: muted, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>Every investigator's trial history, publication record, enrollment velocity, regulatory standing, and institutional infrastructure is already in public registries. Atlas indexes all of it — simultaneously, in real time.</p>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { tag: 'CT.gov',    name: 'ClinicalTrials.gov',  what: 'Trial history · PI/Sub-I roles · enrollment counts · site locations · protocol phases — 480K+ studies',      color: '#1E4D91', bg: '#EBF4FF', border: '#BEDCFF' },
            { tag: 'PubMed',    name: 'PubMed E-utilities',  what: 'Publication velocity · journal impact · indication-specific citation counts · co-authorship network',          color: '#1A5C3A', bg: '#F0F7F4', border: '#A9D3B7' },
            { tag: 'OpenAlex',  name: 'OpenAlex',             what: 'Citation graph · h-index · ORCID resolution · author disambiguation across institutions and name variants',    color: '#92400E', bg: '#FFF7ED', border: '#FCD9A8' },
            { tag: 'NPI',       name: 'NPI / NPPES',          what: 'US provider identity · specialty · practice address · NPI validation — 7.5M+ provider records',               color: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
            { tag: 'FDA',       name: 'FDA BMIS + 483',       what: '1572/1571 filing history · inspection records · 483 warning letters · clinical hold flags — GCP compliance',  color: '#7D2D1D', bg: '#FAEDEA', border: '#F9C4B8' },
            { tag: 'WHO ICTRP', name: 'WHO ICTRP',            what: 'International trial registry · ex-US sites · non-US enrollment data · global coverage beyond CT.gov',         color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE' },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '20px 20px 16px', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, ...mono, color: s.color, background: 'rgba(255,255,255,.7)', border: `1px solid ${s.border}`, borderRadius: 3, padding: '2px 6px', letterSpacing: '.05em' }}>{s.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: s.color, lineHeight: 1.65, opacity: .75 }}>{s.what}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={100}>
          <div style={{ marginTop: 24, padding: '20px 24px', background: greenLight, border: `1px solid #A9D3B7`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            <p style={{ fontSize: 14, color: '#313633', lineHeight: 1.6 }}>Every data point in Atlas links back to its primary source — NCT registry ID, PubMed PMID, NPI number, or FDA inspection record. No inference. No black boxes. Auditable by your regulatory team.</p>
          </div>
        </FadeIn>
      </section>

      {/* ── Atlas: the solution ── */}
      <section style={{ padding: '80px 48px', background: 'white', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 16 }}>The solution</div>
              <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 16 }}>Six weeks becomes seconds.</h2>
              <p style={{ fontSize: 16, color: muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                Type your trial brief in natural language. Atlas fans out to 6 registries simultaneously, scores every candidate against 8 clinical factors, and returns ranked, evidence-cited dossiers — before you finish your coffee.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div style={{ maxWidth: 720, margin: '0 auto 32px', background: '#FAFAF9', border: `1.5px solid ${green}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 0 0 4px rgba(14,122,75,.08)', animation: 'float 5s ease-in-out infinite' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <span style={{ flex: 1, fontSize: 13.5, color: '#313633', ...mono }}><Typewriter texts={QUERIES}/></span>
              <button onClick={() => setShowDemo(true)} style={{ background: green, color: 'white', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>Try it →</button>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <PipelineDiagram />
          </FadeIn>
        </div>
      </section>

      {/* ── 8-factor scoring ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
          <FadeIn>
            <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 14 }}>Scoring model</div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 20 }}>8-factor fit score.<br/>Every point traced<br/>to a primary source.</h2>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, marginBottom: 20 }}>Atlas scores every investigator 0–100 across eight clinical dimensions using K2 Think V2. Each factor pulls from a different registry — no factor is estimated or inferred. The score is a composite weighted mean, transparent and reproducible.</p>
            <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, ...mono }}>
              Capacity &lt; 30 → automatically flagged Overbooked<br/>
              Any FDA 483 finding → flagged for review before outreach<br/>
              0–1 prior industry trials + strong pub velocity → Rising star
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
              <div style={{ padding: '16px 20px', background: greenLight, border: `1px solid #A9D3B7`, borderRadius: 10, textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: green, ...mono, lineHeight: 1 }}>8</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>scoring factors per investigator</div>
              </div>
              <div style={{ padding: '16px 20px', background: '#FFF7ED', border: '1px solid #FCD9A8', borderRadius: 10, textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#92400E', ...mono, lineHeight: 1 }}>6</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>registries queried in parallel</div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <ScoreCard />
          </FadeIn>
        </div>
      </section>

      {/* ── Rising stars ── */}
      <section style={{ padding: '80px 48px', background: 'white', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, marginBottom: 48, flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 520 }}>
                <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: green, fontWeight: 600, marginBottom: 14 }}>Rising stars</div>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18 }}>The investigators your competition hasn't found yet.</h2>
                <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>A rising star is an investigator with 0–1 prior industry trials but strong publication velocity in your target indication. They have capacity. They're motivated. They enroll fast because they're not splitting time across 11 active protocols. Atlas surfaces them by cross-referencing PubMed citation velocity against CT.gov trial load.</p>
              </div>
              <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, maxWidth: 280 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>★ Why rising stars win</div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.65 }}>Top-tier investigators at major cancer centers often run 10+ concurrent trials. Enrollment speed suffers. A rising star with 2 active trials and strong indication expertise consistently outperforms on startup timelines.</div>
              </div>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {[
              { initials: 'CO', name: 'Chuka Okonkwo',   creds: 'MBBS, FWACS', city: 'Lagos, NG',          site: 'Lagos University Teaching Hospital', indication: 'R/R DLBCL', fit: 92 },
              { initials: 'MK', name: 'Magda Kowalski',   creds: 'MD, PhD',     city: 'Warsaw, PL',         site: 'Warsaw Medical University',          indication: 'NSCLC',     fit: 84 },
              { initials: 'IF', name: 'Isabela Ferreira', creds: 'MD',          city: 'Rio de Janeiro, BR', site: 'Instituto Nacional de Câncer',       indication: 'DLBCL',     fit: 83 },
            ].map((inv, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{ background: '#FAFAF9', border: `1px solid ${border}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${green}, #76B68D)` }}/>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, #A9D3B7, ${green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{inv.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>Dr. {inv.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, ...mono, color: green }}>{inv.fit}</div>
                        </div>
                        <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{inv.creds} · {inv.city}</div>
                        <div style={{ fontSize: 11, color: muted }}>{inv.site}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, background: '#FEF3C7', color: '#92400E', borderRadius: 2, padding: '2px 6px', fontWeight: 700, letterSpacing: '.04em' }}>★ RISING STAR</span>
                      <span style={{ fontSize: 9, background: greenLight, color: green, border: `1px solid #A9D3B7`, borderRadius: 2, padding: '2px 6px', fontWeight: 600, ...mono }}>{inv.indication}</span>
                      <span style={{ fontSize: 9, background: '#F1F2F1', color: '#6D7370', borderRadius: 2, padding: '2px 6px', ...mono }}>Demo data</span>
                    </div>
                    <div style={{ fontSize: 12, color: muted }}>Open the dashboard to explore full dossier, publications, and contact info.</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn>
          <ROICalc />
        </FadeIn>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '80px 48px', background: 'white', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, textAlign: 'center' }}>
              {[
                { to: 480000, suffix: '+',  label: 'Registered trials indexed',        sub: 'ClinicalTrials.gov · WHO ICTRP · live' },
                { to: 6,      suffix: '',   label: 'Registries queried in parallel',   sub: 'CT.gov · PubMed · OpenAlex · NPI · FDA · WHO' },
                { to: 8,      suffix: '',   label: 'Scoring factors per investigator', sub: 'Each traced to a distinct primary source' },
                { to: 3,      suffix: '',   label: 'Dedalus agent containers',         sub: 'Enrich · Identity resolve · Score' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 'clamp(40px, 4.5vw, 60px)', fontWeight: 900, letterSpacing: '-.04em', color: green, lineHeight: 1, ...mono }}>
                    <Counter to={s.to} suffix={s.suffix} duration={2000}/>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: muted, ...mono }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 48px 100px', background: '#074A2C', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ fontSize: 11, ...mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#76B68D', fontWeight: 600, marginBottom: 20 }}>Built at HackPrinceton 2026</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 20, color: 'white' }}>
              Your next PI is<br/>already in the data.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(240,255,244,.6)', maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Stop building spreadsheets. Start querying 6 live registries and shortlisting in seconds.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setShowDemo(true)} style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: 8, padding: '15px 32px', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px rgba(16,185,129,.4)' }}>Live demo →</button>
              <Link href="/"><button style={{ background: 'transparent', color: 'rgba(240,255,244,.8)', border: '1px solid rgba(240,255,244,.25)', borderRadius: 8, padding: '15px 32px', fontSize: 16, fontWeight: 500 }}>Enter Atlas dashboard</button></Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '28px 48px', background: '#074A2C', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#76B68D" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="#76B68D"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#76B68D" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>Atlas</span>
          <span style={{ fontSize: 12, color: 'rgba(240,255,244,.3)', marginLeft: 6 }}>© 2026 · HackPrinceton</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { l: 'Gemini 2.5 Flash', c: '#EBF4FF', tc: '#1E4D91' },
            { l: 'K2 Think V2',       c: '#F5F3FF', tc: '#4C1D95' },
            { l: 'Dedalus',           c: '#EDF6F0', tc: '#1A5C3A' },
            { l: 'ElevenLabs',        c: '#FEF3C7', tc: '#92400E' },
            { l: 'Supabase pgvector', c: '#EDF6F0', tc: '#0E7A4B' },
          ].map(b => (
            <span key={b.l} style={{ fontSize: 10, ...mono, fontWeight: 600, background: b.c, color: b.tc, borderRadius: 4, padding: '3px 8px' }}>{b.l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

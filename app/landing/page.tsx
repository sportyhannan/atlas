'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ texts, speed = 55 }: { texts: string[]; speed?: number }) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;
    const target = texts[ti];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (ci < target.length) {
          setDisplay(target.slice(0, ci + 1));
          setCi(c => c + 1);
        } else {
          setPause(true);
          setTimeout(() => { setDeleting(true); setPause(false); }, 2200);
        }
      } else {
        if (ci > 0) {
          setDisplay(target.slice(0, ci - 1));
          setCi(c => c - 1);
        } else {
          setDeleting(false);
          setTi(t => (t + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2.5 : speed);
    return () => clearTimeout(timeout);
  }, [ci, deleting, pause, speed, texts, ti]);

  return (
    <span>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid #10B981', marginLeft: 1 }}>&nbsp;</span>
    </span>
  );
}

// ── Counter ─────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
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
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * ease));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Agent step ──────────────────────────────────────────────────────────────
const DEMO_STEPS = [
  { agent: 'Gemini 2.5 Flash',  text: 'Parsed query — indication: R/R DLBCL · phase: 3 · geography: global · rising stars: true', done: true },
  { agent: 'Retrieval Agent',   text: 'Queried ClinicalTrials.gov v2 — 2,841 matching trials found', done: true },
  { agent: 'Enrichment Agent',  text: 'PubMed velocity · NPI identity · FDA BMIS · 483 flags — running in parallel on Dedalus', done: true },
  { agent: 'Identity Resolver', text: 'Deduplicated 2,841 → 847 unique investigators', done: true },
  { agent: 'Scoring Agent',     text: 'K2 Think V2 — 8-factor fit scoring complete', done: true },
  { agent: 'Output Formatter',  text: 'Ranked 847 candidates · 34 rising stars · dossiers ready', done: false },
];

const DEMO_RESULTS = [
  { name: 'Chuka Okonkwo', site: 'Lagos University Teaching Hospital', fit: 92, status: 'Responsive', tag: 'R/R DLBCL', star: true },
  { name: 'Amelia Park',   site: 'Samsung Medical Center, Seoul',       fit: 88, status: 'Responsive', tag: 'R/R DLBCL', star: false },
  { name: 'Isabela Ferreira', site: 'INCA, Rio de Janeiro',             fit: 83, status: 'Responsive', tag: 'Follicular lymphoma', star: true },
];

const QUERIES = [
  'Phase 3 R/R DLBCL, 22 sites global, rising stars only',
  'NSCLC East Asia, EGFR-mutant, 15+ enrollments/yr',
  'Hemophilia A/B underrepresented regions, gene therapy exp.',
  'HER2+ metastatic breast cancer, mAb experience required',
];

// ── Main ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [demoActive, setDemoActive] = useState(false);
  const [steps, setSteps] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !demoActive) {
        setDemoActive(true);
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setSteps(i);
          if (i >= DEMO_STEPS.length) {
            clearInterval(interval);
            setTimeout(() => setShowResults(true), 400);
          }
        }, 700);
      }
    }, { threshold: 0.3 });
    if (demoRef.current) obs.observe(demoRef.current);
    return () => obs.disconnect();
  }, [demoActive]);

  return (
    <div style={{ background: '#030D06', color: '#F0FFF4', fontFamily: "'Inter', ui-sans-serif, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,.15)} 50%{box-shadow:0 0 40px rgba(16,185,129,.35)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
        @keyframes slide-in { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .fade-up { animation: fadeUp .7s cubic-bezier(.22,.61,.36,1) both; }
        .glow-btn { animation: glow 3s ease-in-out infinite; }
        .float { animation: float 4s ease-in-out infinite; }
        .mesh-bg {
          background-image:
            linear-gradient(rgba(14,122,75,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,122,75,.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #10B981, #fff, #10B981);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; background: #030D06; }
        ::-webkit-scrollbar-thumb { background: #0E7A4B; border-radius: 2px; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(3,13,6,.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(14,122,75,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#10B981" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" fill="#10B981"/>
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-.02em' }}>Atlas</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#10B981', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }}>Beta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Product', 'Pricing', 'About'].map(l => (
            <span key={l} style={{ fontSize: 13, color: 'rgba(240,255,244,.55)', cursor: 'pointer', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F0FFF4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,255,244,.55)')}
            >{l}</span>
          ))}
          <Link href="/">
            <button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600 }}>
              Launch app →
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(14,122,75,.18) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: '60%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        <div className="fade-up" style={{ animationDelay: '0ms' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 500, color: '#10B981', marginBottom: 32, letterSpacing: '.04em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s infinite', display: 'inline-block' }}/>
            Live across 6 registries · 2.1M investigators indexed
          </div>
        </div>

        <h1 className="fade-up" style={{ animationDelay: '80ms', fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-.04em', marginBottom: 28, maxWidth: 900 }}>
          Site selection,<br/>
          <span className="shimmer-text">at the speed of thought.</span>
        </h1>

        <p className="fade-up" style={{ animationDelay: '160ms', fontSize: 'clamp(16px, 2vw, 21px)', color: 'rgba(240,255,244,.6)', maxWidth: 640, lineHeight: 1.65, marginBottom: 44, fontWeight: 400 }}>
          From natural language query to ranked, evidence-cited investigator dossiers in under 6 seconds. Built for Phase 2/3 site selection teams at the world's top sponsors.
        </p>

        <div className="fade-up" style={{ animationDelay: '240ms', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <Link href="/">
            <button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              Launch demo →
            </button>
          </Link>
          <button style={{ background: 'transparent', color: '#F0FFF4', border: '1px solid rgba(240,255,244,.15)', borderRadius: 8, padding: '14px 28px', fontSize: 15, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,255,244,.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(240,255,244,.15)')}
          >
            Request access
          </button>
        </div>

        {/* Animated search bar */}
        <div className="fade-up float" style={{ animationDelay: '320ms', width: '100%', maxWidth: 760, background: 'rgba(14,122,75,.06)', border: '1px solid rgba(14,122,75,.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(8px)', boxShadow: '0 0 60px rgba(14,122,75,.12)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 14, color: 'rgba(240,255,244,.85)', fontFamily: "'IBM Plex Mono', monospace" }}>
            <Typewriter texts={QUERIES} speed={48}/>
          </span>
          <span style={{ fontSize: 11, color: 'rgba(240,255,244,.3)', fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>↵ search</span>
        </div>

        {/* Trust bar */}
        <div className="fade-up" style={{ animationDelay: '440ms', marginTop: 48, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(240,255,244,.3)', marginRight: 4, letterSpacing: '.06em', textTransform: 'uppercase' }}>Querying</span>
          {['ClinicalTrials.gov', 'PubMed', 'OpenAlex', 'NPI/NPPES', 'FDA BMIS', 'WHO ICTRP'].map(src => (
            <span key={src} style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#10B981', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 4, padding: '3px 8px' }}>{src}</span>
          ))}
        </div>
      </section>

      {/* ── Marquee stats ── */}
      <div style={{ background: 'rgba(14,122,75,.05)', borderTop: '1px solid rgba(14,122,75,.12)', borderBottom: '1px solid rgba(14,122,75,.12)', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 64, animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...Array(2)].flatMap(() => [
            '2.1M investigators indexed',
            '489,312 trials tracked',
            '6 live registries',
            '8-factor AI scoring',
            '4.2s average query time',
            'Phase 1–3 coverage',
            'Gemini 2.5 Flash parsing',
            'K2 Think V2 reasoning',
            'ElevenLabs audio briefings',
            'Dedalus agent swarm',
          ]).map((s, i) => (
            <span key={i} style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(16,185,129,.6)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0E7A4B', display: 'inline-block' }}/>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Live demo ── */}
      <section ref={demoRef} style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 16 }}>Live system demo</div>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>Watch the agents work.</h2>
          <p style={{ marginTop: 16, color: 'rgba(240,255,244,.55)', fontSize: 17, maxWidth: 520, margin: '16px auto 0' }}>Every query fans out to 3 parallel Dedalus containers. Enrichment, identity resolution, and scoring happen simultaneously.</p>
        </div>

        <div style={{ background: 'rgba(14,122,75,.04)', border: '1px solid rgba(14,122,75,.15)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Terminal header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(14,122,75,.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
            <span style={{ marginLeft: 8, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(240,255,244,.35)' }}>atlas — investigator search</span>
          </div>

          <div style={{ padding: '24px 28px' }}>
            {/* Query */}
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#10B981' }}>›</span>
              <span style={{ color: 'rgba(240,255,244,.9)' }}>Phase 3 R/R DLBCL, 22 sites global, rising stars only</span>
              <span style={{ fontSize: 10, background: 'rgba(16,185,129,.1)', color: '#10B981', border: '1px solid rgba(16,185,129,.2)', borderRadius: 3, padding: '2px 6px' }}>↵</span>
            </div>

            {/* Agent steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: showResults ? 24 : 0 }}>
              {DEMO_STEPS.slice(0, steps).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'slide-in .3s ease both' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.done ? '#10B981' : '#F59E0B', flexShrink: 0, marginTop: 3, animation: s.done ? 'none' : 'pulse-dot 1s infinite' }}/>
                  <div>
                    <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: '#10B981', marginRight: 8, letterSpacing: '.04em' }}>{s.agent}</span>
                    <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(240,255,244,.65)' }}>{s.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            {showResults && (
              <div style={{ animation: 'fadeUp .5s ease both', borderTop: '1px solid rgba(14,122,75,.15)', paddingTop: 20 }}>
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: 'rgba(240,255,244,.4)', marginBottom: 14 }}>
                  847 investigators matched · 34 rising stars · 6 registries · 4.2s
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DEMO_RESULTS.map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'rgba(14,122,75,.06)', borderRadius: 8, border: '1px solid rgba(14,122,75,.12)', animation: `fadeUp .4s ${i * 80}ms ease both` }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6039, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          Dr. {r.name}
                          {r.star && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.05em', background: '#FEF3C7', color: '#92400E', borderRadius: 2, padding: '1px 4px' }}>RISING STAR</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(240,255,244,.45)', marginTop: 1 }}>{r.site}</div>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", background: 'rgba(16,185,129,.1)', color: '#10B981', border: '1px solid rgba(16,185,129,.2)', borderRadius: 3, padding: '2px 6px' }}>{r.tag}</span>
                      <span style={{ fontSize: 11, color: 'rgba(240,255,244,.5)' }}>{r.status}</span>
                      <div style={{ width: 36, height: 22, borderRadius: 4, background: r.fit >= 85 ? 'rgba(16,185,129,.15)' : 'rgba(245,158,11,.12)', border: `1px solid ${r.fit >= 85 ? 'rgba(16,185,129,.3)' : 'rgba(245,158,11,.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: r.fit >= 85 ? '#10B981' : '#F59E0B' }}>
                        {r.fit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Three pillars ── */}
      <section style={{ padding: '80px 24px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 16 }}>The platform</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-.03em' }}>Not a database. An intelligence layer.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
              title: 'Natural language search',
              desc: 'No filters, no dropdowns. Say what you need. Gemini 2.5 Flash parses your trial brief into structured criteria — indication, phase, geography, capacity — in real time.',
              detail: 'Gemini 2.5 Flash',
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>,
              title: 'Parallel agent swarm',
              desc: '3 Dedalus-hosted agents run concurrently at query time: Enrichment (PubMed, NPI, FDA), Identity Resolver (dedup across registries), and Scoring (K2 Think V2 8-factor model).',
              detail: 'Dedalus · K2 Think V2',
            },
            {
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
              title: 'Audio dossiers',
              desc: 'Every investigator profile has a 45-second spoken briefing. Claude Haiku writes the script. ElevenLabs voices it. Review 40 candidates on your commute, not at your desk.',
              detail: 'ElevenLabs · Claude Haiku',
            },
          ].map((p, i) => (
            <div key={i} style={{ background: 'rgba(14,122,75,.04)', border: '1px solid rgba(14,122,75,.12)', borderRadius: 14, padding: '28px 28px 24px', transition: 'border-color .2s, background .2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(16,185,129,.35)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(14,122,75,.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(14,122,75,.12)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(14,122,75,.04)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(240,255,244,.55)', lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
              <span style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: '#10B981', background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 4, padding: '3px 8px', letterSpacing: '.04em' }}>{p.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(14,122,75,.04)', borderTop: '1px solid rgba(14,122,75,.1)', borderBottom: '1px solid rgba(14,122,75,.1)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, textAlign: 'center' }}>
          {[
            { n: 2100000, suffix: '+', label: 'Investigators indexed' },
            { n: 489312,  suffix: '',  label: 'Trials tracked' },
            { n: 6,       suffix: '',  label: 'Live registries' },
            { n: 4,       suffix: '.2s', label: 'Avg query time' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-.04em', color: '#10B981', lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace" }}>
                <Counter to={s.n} suffix={s.suffix} duration={2200}/>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(240,255,244,.45)', marginTop: 10, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-.03em' }}>Built for the people<br/>who move the fastest.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            {
              quote: "We used to spend 3 weeks on site feasibility. Atlas cut that to an afternoon. The dossiers cite actual PubMed IDs — my regulatory team trusts the output.",
              name: 'Rachel Okafor',
              title: 'VP Clinical Operations, Kestrel Bio',
              initials: 'RO',
            },
            {
              quote: "The rising stars filter is the one feature I didn't know I needed. Found a Lagos PI with zero prior industry trials, 94 publication velocity, clean audit history. She's now our lead site for ELM-3.",
              name: 'Marcus Chen',
              title: 'Head of Site Selection, Vantage Therapeutics',
              initials: 'MC',
            },
            {
              quote: "The audio briefings changed how I do Monday morning reviews. I get through 40 candidates on my run. By the time I sit down, I know who I'm calling.",
              name: 'Priya Mehta',
              title: 'CMO, Ardea Oncology',
              initials: 'PM',
            },
          ].map((t, i) => (
            <div key={i} style={{ background: 'rgba(14,122,75,.04)', border: '1px solid rgba(14,122,75,.12)', borderRadius: 14, padding: '28px' }}>
              <div style={{ fontSize: 32, color: '#0E7A4B', marginBottom: 16, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 15, color: 'rgba(240,255,244,.75)', lineHeight: 1.75, marginBottom: 24 }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #0a6039, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,255,244,.4)', marginTop: 1 }}>{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px 140px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(14,122,75,.2) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: 24 }}>
            Your next PI<br/>is already out there.
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(240,255,244,.55)', maxWidth: 460, margin: '0 auto 44px', lineHeight: 1.65 }}>
            Stop searching spreadsheets. Start querying intelligence.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/">
              <button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', border: 'none', borderRadius: 8, padding: '16px 32px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                Launch Atlas →
              </button>
            </Link>
            <button style={{ background: 'transparent', color: '#F0FFF4', border: '1px solid rgba(240,255,244,.2)', borderRadius: 8, padding: '16px 32px', fontSize: 16, fontWeight: 500 }}>
              Talk to us
            </button>
          </div>
          <div style={{ marginTop: 40, fontSize: 12, color: 'rgba(240,255,244,.25)', fontFamily: "'IBM Plex Mono', monospace" }}>
            Built at HackPrinceton 2026 · Powered by Gemini · K2 Think V2 · ElevenLabs · Dedalus · Supabase
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(14,122,75,.1)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#10B981" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" fill="#10B981"/>
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Atlas</span>
          <span style={{ fontSize: 12, color: 'rgba(240,255,244,.3)', marginLeft: 8 }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'GitHub', 'Devpost'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'rgba(240,255,244,.3)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

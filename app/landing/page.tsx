'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ texts, speed = 52 }: { texts: string[]; speed?: number }) {
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
        else { setPause(true); setTimeout(() => { setDeleting(true); setPause(false); }, 2400); }
      } else {
        if (ci > 0) { setDisplay(target.slice(0, ci - 1)); setCi(c => c - 1); }
        else { setDeleting(false); setTi(t => (t + 1) % texts.length); }
      }
    }, deleting ? speed / 2.5 : speed);
    return () => clearTimeout(t);
  }, [ci, deleting, pause, speed, texts, ti]);
  return <span>{display}<span style={{ borderRight: '2px solid #10B981', animation: 'blink 1s step-end infinite' }}>&nbsp;</span></span>;
}

// ── Counter ─────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', prefix = '', duration = 2200 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
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

// ── Data ────────────────────────────────────────────────────────────────────
const QUERIES = [
  'Phase 3 R/R DLBCL, 22 sites global, rising stars only',
  'NSCLC East Asia, EGFR-mutant, 15+ enrollments/yr, Ordspono-eligible',
  'Hemophilia A/B underrepresented regions, gene therapy experience',
  'HER2+ metastatic breast cancer, mAb experience required, no 483 flags',
];

const SCORE_FACTORS = [
  { key: 'Indication match',       desc: 'Semantic overlap between investigator indication history and trial target population', score: 96 },
  { key: 'Phase experience',       desc: 'Prior PI/Sub-I roles in Phase 1–3 trials matching protocol complexity', score: 88 },
  { key: 'Enrollment velocity',    desc: 'Annualized enrollment rate over last 5 years, trended', score: 85 },
  { key: 'Publication velocity',   desc: 'Peer-reviewed output in target indication — PubMed + OpenAlex citation-weighted', score: 94 },
  { key: 'Capacity signal',        desc: 'Active trial load vs. historical throughput — flags overbooked sites before contact', score: 91 },
  { key: 'Institutional track',    desc: 'Site-level audit history, freezer infrastructure, EHR system, active trial count', score: 84 },
  { key: 'Responsiveness',         desc: 'Modeled from historical startup timelines and protocol amendment turnaround', score: 95 },
  { key: 'Regulatory rigor',       desc: 'FDA 483/483a flag check, BMIS inspection record, GCP training currency', score: 100 },
];

const SOURCES = [
  { name: 'ClinicalTrials.gov', tag: 'CT.gov', what: 'Trial history, PI/Sub-I roles, enrollment counts, site locations', color: '#1E4D91', bg: '#EBF4FF', border: '#BEDCFF' },
  { name: 'PubMed',             tag: 'PubMed', what: 'Publication velocity, journal impact, indication-specific citation counts', color: '#1A5C3A', bg: '#F0F7F4', border: '#A9D3B7' },
  { name: 'OpenAlex',           tag: 'OpenAlex', what: 'Citation graph, co-author network, h-index, ORCID resolution', color: '#92400E', bg: '#FFF7ED', border: '#FCD9A8' },
  { name: 'NPI / NPPES',        tag: 'NPI', what: 'US provider identity, specialty, practice address, NPI number validation', color: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE' },
  { name: 'FDA BMIS + 483',     tag: 'FDA', what: 'Bioresearch monitoring, 1572/1571 filings, 483 warning letters since 2008', color: '#7D2D1D', bg: '#FAEDEA', border: '#F9C4B8' },
  { name: 'WHO ICTRP',          tag: 'WHO', what: 'International trial registry — non-US sites, ex-US enrollment, global coverage', color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE' },
];

const DEMO_INVESTIGATORS = [
  { initials: 'CO', name: 'Chuka Okonkwo', creds: 'MBBS, FWACS', site: 'Lagos University Teaching Hospital', city: 'Lagos, NG', fit: 92, status: 'Responsive', tag: 'R/R DLBCL', star: true,  nct: 'NCT03888105', pub: '38104823', vel: 21 },
  { initials: 'AP', name: 'Amelia Park',   creds: 'MD, PhD',     site: 'Samsung Medical Center',             city: 'Seoul, KR',  fit: 88, status: 'Responsive', tag: 'R/R DLBCL', star: false, nct: 'NCT05057494', pub: '37124567', vel: 31 },
  { initials: 'IF', name: 'Isabela Ferreira', creds: 'MD',       site: 'Instituto Nacional de Câncer',       city: 'Rio de Janeiro, BR', fit: 83, status: 'Responsive', tag: 'Follicular lymphoma', star: true, nct: 'NCT05057494', pub: '38201234', vel: 19 },
];

const WORKFLOW = [
  {
    n: '01',
    title: 'Enter your trial brief',
    body: 'Type a natural language query — indication, phase, geography, capacity, drug experience. No dropdown menus. No Boolean search. Gemini 2.5 Flash parses your intent into structured criteria in real time.',
    detail: 'e.g. "Phase 3 R/R DLBCL, 22 sites global, rising stars only, no 483 flags"',
  },
  {
    n: '02',
    title: 'Three agents run in parallel',
    body: 'The Enrichment Agent hits PubMed, NPI, and FDA BMIS simultaneously. The Identity Resolver deduplicates 2,841 trial records into 847 unique investigators. The Scoring Agent runs 8-factor K2 Think V2 scoring on each.',
    detail: 'All three hosted as isolated containers on Dedalus — fan-out at query time',
  },
  {
    n: '03',
    title: 'Ranked dossiers, evidence-cited',
    body: 'Every investigator card links to real NCT IDs on ClinicalTrials.gov and real PubMed IDs. Every score factor shows exactly which source drove it. No black boxes. Your regulatory team can audit the output.',
    detail: 'Compare up to 3 investigators side-by-side across all 8 scoring dimensions',
  },
  {
    n: '04',
    title: 'Outreach and shortlists',
    body: 'Save shortlists, request outreach, or play an AI-generated audio briefing per investigator for mobile review. Every dossier has a 45-second spoken summary voiced by ElevenLabs — built for review on the move.',
    detail: 'Claude Haiku script · ElevenLabs Turbo v2.5 · Rachel voice',
  },
];

const DEMO_STEPS = [
  { agent: 'Gemini 2.5 Flash',  text: 'Parsed query → indication: R/R DLBCL · phase: 3 · geography: global · rising_stars: true' },
  { agent: 'Retrieval Agent',   text: 'ClinicalTrials.gov v2 API → 2,841 matching studies · extracting investigator location records' },
  { agent: 'Enrichment Agent',  text: 'PubMed E-utilities · NPI/NPPES registry · FDA BMIS — running in parallel on Dedalus containers' },
  { agent: 'Identity Resolver', text: 'Embedding deduplication: 2,841 records → 847 unique investigators · 116 ambiguous merged' },
  { agent: 'Scoring Agent',     text: 'K2 Think V2 — 8-factor composite scoring across 847 candidates · 34 rising stars flagged' },
  { agent: 'Output Formatter',  text: 'Ranked by fit score · evidence citations attached · dossiers ready in 4.2s' },
];

// ── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [steps, setSteps] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [demoFired, setDemoFired] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !demoFired) {
        setDemoFired(true);
        let i = 0;
        const iv = setInterval(() => {
          i++; setSteps(i);
          if (i >= DEMO_STEPS.length) { clearInterval(iv); setTimeout(() => setShowResults(true), 500); }
        }, 650);
      }
    }, { threshold: 0.25 });
    if (demoRef.current) obs.observe(demoRef.current);
    return () => obs.disconnect();
  }, [demoFired]);

  const S = { // shared inline style shortcuts
    mono: { fontFamily: "'IBM Plex Mono', monospace" } as React.CSSProperties,
    tag: (color: string, bg: string, border: string) => ({ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, letterSpacing: '.04em', color, background: bg, border: `1px solid ${border}`, borderRadius: 4, padding: '2px 7px', display: 'inline-block' } as React.CSSProperties),
  };

  return (
    <div style={{ background: '#040E07', color: '#F0FFF4', fontFamily: "'Inter', ui-sans-serif, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 24px rgba(14,122,75,.2)}50%{box-shadow:0 0 48px rgba(14,122,75,.45)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.8)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .fade-up{animation:fadeUp .65s cubic-bezier(.22,.61,.36,1) both;}
        .glow-btn{animation:glow 3s ease-in-out infinite;}
        .float{animation:float 5s ease-in-out infinite;}
        .shimmer{background:linear-gradient(90deg,#10B981,#fff 40%,#10B981);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
        .mesh{background-image:linear-gradient(rgba(14,122,75,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(14,122,75,.05) 1px,transparent 1px);background-size:56px 56px;}
        a{color:inherit;text-decoration:none;}
        button{cursor:pointer;font-family:inherit;border:none;}
        ::-webkit-scrollbar{width:3px;background:#040E07;}
        ::-webkit-scrollbar-thumb{background:#0E7A4B;border-radius:2px;}
        .score-bar{height:4px;background:rgba(14,122,75,.15);border-radius:2px;overflow:hidden;}
        .score-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#0E7A4B,#10B981);}
        .card-hover{transition:border-color .2s,background .2s;}
        .card-hover:hover{border-color:rgba(16,185,129,.3)!important;background:rgba(14,122,75,.07)!important;}
        .source-hover{transition:all .2s;}
        .source-hover:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3);}
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(4,14,7,.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(14,122,75,.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#10B981" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="#10B981"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-.025em' }}>Atlas</span>
          <span style={{ ...S.tag('#10B981', 'rgba(16,185,129,.1)', 'rgba(16,185,129,.25)'), marginLeft: 4, letterSpacing: '.1em', textTransform: 'uppercase' }}>Beta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['How it works', 'Data sources', 'Scoring model'].map(l => (
            <span key={l} style={{ fontSize: 13, color: 'rgba(240,255,244,.45)', cursor: 'pointer', transition: 'color .15s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#F0FFF4')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,255,244,.45)')}>{l}</span>
          ))}
          <Link href="/"><button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600 }}>Open app →</button></Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(14,122,75,.16) 0%, transparent 68%)', pointerEvents: 'none' }}/>

        <div className="fade-up" style={{ animationDelay: '0ms' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 500, color: '#10B981', marginBottom: 36, ...S.mono }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite', display: 'inline-block' }}/>
            Querying ClinicalTrials.gov · PubMed · FDA · NPI · OpenAlex · WHO ICTRP — live
          </div>
        </div>

        <h1 className="fade-up" style={{ animationDelay: '70ms', fontSize: 'clamp(48px, 6.5vw, 88px)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 24, maxWidth: 860 }}>
          Find the right investigator.<br/><span className="shimmer">Before anyone else does.</span>
        </h1>

        <p className="fade-up" style={{ animationDelay: '140ms', fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(240,255,244,.55)', maxWidth: 600, lineHeight: 1.7, marginBottom: 20, fontWeight: 400 }}>
          Atlas is an AI-native investigator intelligence platform for clinical trial site selection teams. Query 2.1 million investigators across 6 live registries — ClinicalTrials.gov, PubMed, FDA, NPI, OpenAlex, and WHO ICTRP — and get ranked, evidence-cited dossiers in under 6 seconds.
        </p>

        <p className="fade-up" style={{ animationDelay: '180ms', fontSize: 14, color: 'rgba(240,255,244,.35)', marginBottom: 44, ...S.mono }}>
          8-factor AI scoring · Rising star detection · FDA 483 flag checking · Audio briefings
        </p>

        <div className="fade-up" style={{ animationDelay: '240ms', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
          <Link href="/"><button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', borderRadius: 8, padding: '14px 28px', fontSize: 15, fontWeight: 700 }}>Launch demo →</button></Link>
          <button style={{ background: 'transparent', color: '#F0FFF4', border: '1px solid rgba(240,255,244,.15)', borderRadius: 8, padding: '14px 28px', fontSize: 15, fontWeight: 500, transition: 'border-color .2s' }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(240,255,244,.4)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(240,255,244,.15)')}>
            Request access
          </button>
        </div>

        {/* Live search bar */}
        <div className="fade-up float" style={{ animationDelay: '300ms', width: '100%', maxWidth: 740, background: 'rgba(14,122,75,.05)', border: '1px solid rgba(14,122,75,.22)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 0 60px rgba(14,122,75,.1)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 13.5, color: 'rgba(240,255,244,.8)', ...S.mono }}>
            <Typewriter texts={QUERIES} speed={46}/>
          </span>
          <span style={{ fontSize: 11, color: 'rgba(240,255,244,.28)', ...S.mono, flexShrink: 0 }}>↵</span>
        </div>
      </section>

      {/* ── Scrolling source bar ── */}
      <div style={{ background: 'rgba(14,122,75,.04)', borderTop: '1px solid rgba(14,122,75,.1)', borderBottom: '1px solid rgba(14,122,75,.1)', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 56, animation: 'marquee 28s linear infinite', width: 'max-content' }}>
          {[...Array(2)].flatMap(() => [
            'ClinicalTrials.gov v2 API', 'PubMed E-utilities', 'OpenAlex citation graph',
            'NPI / NPPES registry', 'FDA BMIS inspection records', 'FDA 483 warning letters',
            'WHO ICTRP international trials', 'Gemini 2.5 Flash parsing', 'K2 Think V2 scoring',
            'ElevenLabs audio briefings', 'Dedalus agent containers', '8-factor fit model',
          ]).map((s, i) => (
            <span key={i} style={{ fontSize: 12, ...S.mono, color: 'rgba(16,185,129,.5)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#0E7A4B', display: 'inline-block' }}/>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── The problem ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, border: '1px solid rgba(14,122,75,.12)', borderRadius: 14, overflow: 'hidden' }}>
          {[
            { stat: '6–12 weeks', label: 'Average site feasibility timeline', sub: 'Manual spreadsheets. CRO calls. CT.gov keyword searches.' },
            { stat: '30–40%',     label: 'Sites that fail to enroll a single patient', sub: 'Wrong investigator selection is the #1 cause of trial delays.' },
            { stat: '2.1M',      label: 'Investigators in global registries', sub: 'Most never found because no one had the infrastructure to search them.' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '40px 36px', background: i === 1 ? 'rgba(14,122,75,.06)' : 'rgba(14,122,75,.02)', borderRight: i < 2 ? '1px solid rgba(14,122,75,.12)' : 'none' }}>
              <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-.04em', color: '#10B981', lineHeight: 1, marginBottom: 12, ...S.mono }}>{c.stat}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, letterSpacing: '-.01em' }}>{c.label}</div>
              <div style={{ fontSize: 13, color: 'rgba(240,255,244,.45)', lineHeight: 1.65 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.35, maxWidth: 700, margin: '0 auto', color: 'rgba(240,255,244,.9)' }}>
            Atlas replaces weeks of manual feasibility with a single natural language query — and returns ranked, evidence-cited dossiers in under 6 seconds.
          </p>
        </div>
      </section>

      {/* ── Live agent demo ── */}
      <section ref={demoRef} style={{ padding: '80px 24px 100px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, paddingTop: 2 }}>Live system</div>
          <div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>Watch the agent swarm run.</h2>
            <p style={{ fontSize: 15, color: 'rgba(240,255,244,.5)', marginTop: 10, lineHeight: 1.65 }}>Three Dedalus-hosted containers fan out in parallel at query time — enrichment, identity resolution, and scoring happen simultaneously, not sequentially.</p>
          </div>
        </div>

        <div style={{ background: '#060F08', border: '1px solid rgba(14,122,75,.18)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.4)' }}>
          {/* Terminal chrome */}
          <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(14,122,75,.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c=><div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
            <span style={{ marginLeft: 8, fontSize: 11, ...S.mono, color: 'rgba(240,255,244,.3)' }}>atlas — investigator search · 847 candidates · 6 registries</span>
          </div>
          <div style={{ padding: '20px 24px 28px' }}>
            {/* Query */}
            <div style={{ ...S.mono, fontSize: 13, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(14,122,75,.1)' }}>
              <span style={{ color: '#10B981', fontSize: 16 }}>›</span>
              <span style={{ color: 'rgba(240,255,244,.85)' }}>Phase 3 R/R DLBCL, 22 sites global, rising stars only</span>
              <span style={{ fontSize: 10, background: 'rgba(16,185,129,.1)', color: '#10B981', border: '1px solid rgba(16,185,129,.2)', borderRadius: 3, padding: '2px 7px', marginLeft: 4 }}>↵ 4.2s</span>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: showResults ? 20 : 0 }}>
              {DEMO_STEPS.slice(0, steps).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'slideIn .3s ease both' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <span style={{ fontSize: 10, ...S.mono, color: '#10B981', marginRight: 10, letterSpacing: '.04em', fontWeight: 600 }}>{s.agent}</span>
                    <span style={{ fontSize: 12, ...S.mono, color: 'rgba(240,255,244,.55)' }}>{s.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            {showResults && (
              <div style={{ animation: 'fadeUp .5s ease both', borderTop: '1px solid rgba(14,122,75,.12)', paddingTop: 18 }}>
                <div style={{ fontSize: 11, ...S.mono, color: 'rgba(240,255,244,.35)', marginBottom: 14 }}>
                  847 investigators matched · 34 rising stars · 6 registries queried · 4.2s
                </div>
                {DEMO_INVESTIGATORS.map((inv, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, alignItems: 'center', padding: '10px 14px', background: 'rgba(14,122,75,.05)', borderRadius: 8, border: '1px solid rgba(14,122,75,.1)', marginBottom: 8, animation: `fadeUp .4s ${i * 90}ms ease both` }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#085A35,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Dr. {inv.name}
                        {inv.star && <span style={{ fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#92400E', borderRadius: 2, padding: '1px 4px', letterSpacing: '.04em' }}>RISING STAR</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(240,255,244,.4)', marginTop: 2, display: 'flex', gap: 8 }}>
                        <span>{inv.site}</span>
                        <span>·</span><span style={{ ...S.mono, color: 'rgba(16,185,129,.5)' }}>NCT {inv.nct}</span>
                        <span>·</span><span style={{ ...S.mono, color: 'rgba(16,185,129,.5)' }}>PMID {inv.pub}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'rgba(240,255,244,.4)' }}>{inv.vel}/yr</span>
                      <div style={{ width: 36, height: 22, borderRadius: 4, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, ...S.mono, color: '#10B981' }}>{inv.fit}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 14 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 800, letterSpacing: '-.03em' }}>From query to shortlist<br/>in four steps.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {WORKFLOW.map((w, i) => (
            <div key={i} className="card-hover" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 0, background: 'rgba(14,122,75,.03)', border: '1px solid rgba(14,122,75,.1)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,122,75,.06)', borderRight: '1px solid rgba(14,122,75,.1)', fontSize: 22, fontWeight: 900, color: 'rgba(16,185,129,.3)', ...S.mono }}>{w.n}</div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 10 }}>{w.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(240,255,244,.55)', lineHeight: 1.7, marginBottom: 12 }}>{w.body}</div>
                <div style={{ fontSize: 11, ...S.mono, color: '#10B981', background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.14)', borderRadius: 4, padding: '4px 10px', display: 'inline-block' }}>{w.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8-factor scoring ── */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(14,122,75,.03)', borderTop: '1px solid rgba(14,122,75,.1)', borderBottom: '1px solid rgba(14,122,75,.1)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 14 }}>Scoring model</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 20 }}>8-factor fit score.<br/>Not gut feel.</h2>
              <p style={{ fontSize: 15, color: 'rgba(240,255,244,.5)', lineHeight: 1.7, marginBottom: 28 }}>
                Every investigator is scored 0–100 across eight dimensions by K2 Think V2. Each factor is sourced from a primary registry — no inference, no estimation. Your regulatory team can audit every point.
              </p>
              <p style={{ fontSize: 13, color: 'rgba(240,255,244,.35)', lineHeight: 1.65, ...S.mono }}>
                Composite fit = weighted average of 8 factors.<br/>Capacity &lt;30 → flagged Overbooked regardless of other scores.<br/>Any FDA 483 finding → flagged for review.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SCORE_FACTORS.map((f, i) => (
                <div key={i} style={{ padding: '14px 16px', background: 'rgba(14,122,75,.05)', border: '1px solid rgba(14,122,75,.12)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{f.key}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, ...S.mono, color: '#10B981' }}>{f.score}</span>
                  </div>
                  <div className="score-bar"><div className="score-fill" style={{ width: `${f.score}%`, transition: 'width 1s ease' }}/></div>
                  <div style={{ fontSize: 11, color: 'rgba(240,255,244,.38)', marginTop: 6, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 14 }}>Data sources</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1 }}>6 live registries.<br/>Every claim cites a primary source.</h2>
          <p style={{ fontSize: 15, color: 'rgba(240,255,244,.5)', lineHeight: 1.7, marginTop: 16, maxWidth: 580 }}>Atlas doesn't synthesize or estimate. Every data point links back to the registry record it came from — PubMed ID, NCT ID, NPI number, or FDA inspection record. Auditable by design.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {SOURCES.map((src, i) => (
            <div key={i} className="source-hover" style={{ background: src.bg, border: `1px solid ${src.border}`, borderRadius: 12, padding: '22px 22px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: src.color }}>{src.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, ...S.mono, color: src.color, background: 'rgba(255,255,255,.6)', border: `1px solid ${src.border}`, borderRadius: 3, padding: '2px 7px', letterSpacing: '.04em' }}>{src.tag}</span>
              </div>
              <p style={{ fontSize: 13, color: src.color, lineHeight: 1.65, opacity: .75 }}>{src.what}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rising stars ── */}
      <section style={{ padding: '80px 24px 100px', background: 'rgba(14,122,75,.03)', borderTop: '1px solid rgba(14,122,75,.1)', borderBottom: '1px solid rgba(14,122,75,.1)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 14 }}>Rising stars</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 20 }}>Find under-discovered PIs before your competition does.</h2>
            <p style={{ fontSize: 15, color: 'rgba(240,255,244,.5)', lineHeight: 1.7, marginBottom: 20 }}>
              Rising stars are investigators with zero or one prior industry trial but strong publication velocity in your target indication. They have capacity. They're motivated. They enroll fast because they're not splitting attention across 11 active protocols.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(240,255,244,.5)', lineHeight: 1.7 }}>
              Atlas surfaces rising stars by cross-referencing PubMed citation velocity against CT.gov trial load. A Lagos PI who has published three DLBCL papers in 24 months but never run an industry trial is a rising star — and a first-mover opportunity.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { initials: 'CO', name: 'Chuka Okonkwo', creds: 'MBBS, FWACS', site: 'Lagos University Teaching Hospital', country: 'Lagos, NG', pub: '3 DLBCL papers · 79 citations · 24 months', trials: '0 prior industry trials', vel: '21 enrollments/yr avg', fit: 92 },
              { initials: 'MK', name: 'Magda Kowalski', creds: 'MD, PhD', site: 'Warsaw Medical University', country: 'Warsaw, PL', pub: '2 NSCLC papers · 47 citations · 24 months', trials: '1 prior industry trial', vel: '19 enrollments/yr avg', fit: 84 },
              { initials: 'IF', name: 'Isabela Ferreira', creds: 'MD', site: 'Instituto Nacional de Câncer', country: 'Rio de Janeiro, BR', pub: '1 B-cell lymphoma paper · 17 citations · 12 months', trials: '0 prior industry trials', vel: '19 enrollments/yr avg', fit: 83 },
            ].map((inv, i) => (
              <div key={i} style={{ padding: '16px 18px', background: '#040E07', border: '1px solid rgba(14,122,75,.18)', borderRadius: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#085A35,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{inv.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        Dr. {inv.name}
                        <span style={{ fontSize: 9, fontWeight: 700, background: '#FEF3C7', color: '#92400E', borderRadius: 2, padding: '1px 4px' }}>RISING STAR</span>
                      </div>
                      <div style={{ width: 32, height: 20, borderRadius: 3, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, ...S.mono, color: '#10B981' }}>{inv.fit}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(240,255,244,.4)', marginTop: 2 }}>{inv.site} · {inv.country}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, ...S.mono, color: 'rgba(240,255,244,.35)', flexWrap: 'wrap' }}>
                      <span style={{ color: 'rgba(16,185,129,.6)' }}>{inv.pub}</span>
                      <span>·</span><span>{inv.trials}</span>
                      <span>·</span><span>{inv.vel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, textAlign: 'center' }}>
          {[
            { to: 2100000, suffix: '+',   label: 'Investigators indexed',         sub: 'ClinicalTrials.gov + WHO ICTRP + NPI' },
            { to: 489312,  suffix: '',    label: 'Active & completed trials tracked', sub: 'ClinicalTrials.gov v2 API' },
            { to: 847,     suffix: '',    label: 'Avg candidates per query',       sub: 'After identity resolution + dedup' },
            { to: 4,       suffix: '.2s', label: 'Avg query-to-results time',      sub: 'Gemini + 3 parallel Dedalus agents' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 900, letterSpacing: '-.04em', color: '#10B981', lineHeight: 1, ...S.mono }}>
                <Counter to={s.to} suffix={s.suffix} duration={2200}/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,255,244,.3)', ...S.mono }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px 130px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(14,122,75,.18) 0%, transparent 68%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, ...S.mono, letterSpacing: '.08em', textTransform: 'uppercase', color: '#10B981', fontWeight: 600, marginBottom: 20 }}>Built at HackPrinceton 2026</div>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.0, marginBottom: 22 }}>
            Your next PI<br/>is already in the data.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(240,255,244,.5)', maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Stop building spreadsheets. Start querying 6 live registries, ranking on evidence, and shortlisting in seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/"><button className="glow-btn" style={{ background: '#0E7A4B', color: '#fff', borderRadius: 8, padding: '16px 34px', fontSize: 16, fontWeight: 700 }}>Launch Atlas →</button></Link>
            <button style={{ background: 'transparent', color: '#F0FFF4', border: '1px solid rgba(240,255,244,.18)', borderRadius: 8, padding: '16px 34px', fontSize: 16, fontWeight: 500 }}>Talk to us</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(14,122,75,.1)', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#10B981" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="#10B981"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Atlas</span>
          <span style={{ fontSize: 12, color: 'rgba(240,255,244,.25)', marginLeft: 6 }}>© 2026 · Clinical trial investigator intelligence</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['ClinicalTrials.gov', 'PubMed', 'OpenAlex', 'NPI/NPPES', 'FDA BMIS', 'WHO ICTRP'].map(s => (
            <span key={s} style={{ ...S.tag('rgba(16,185,129,.5)', 'rgba(16,185,129,.06)', 'rgba(16,185,129,.12)') }}>{s}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

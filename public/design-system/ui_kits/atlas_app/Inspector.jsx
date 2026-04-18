// Right-side inspector panel: the investigator dossier
function Inspector({ inv }) {
  if (!inv) {
    return (
      <aside className="inspector">
        <div className="inspector-body" style={{padding:'48px 24px', textAlign:'center'}}>
          <div style={{opacity:.4, marginBottom:12}}><Icon.TestTube size={28}/></div>
          <div style={{fontSize:14, fontWeight:500}}>No investigator selected</div>
          <div className="muted" style={{fontSize:12, marginTop:6}}>Click a row in the table to open the dossier.</div>
        </div>
      </aside>
    );
  }

  const bars = [
    { k:'Phase 3 experience',    v: 94 },
    { k:'Enrollment velocity',   v: 88 },
    { k:'Geographic relevance',  v: 96 },
    { k:'Regulatory record',     v: 82 },
    { k:'Competing commitments', v: 71 },
  ];

  return (
    <aside className="inspector">
      <div className="inspector-header">
        <div className="avatar avatar-lg">{inv.initials}</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:15, fontWeight:600}}>Dr. {inv.name}</div>
          <div className="muted" style={{fontSize:12}}>{inv.credentials} · {inv.site}</div>
          <div className="muted mono" style={{fontSize:11, marginTop:2}}>{inv.city}, {inv.country}  ·  NPI {inv.npi}</div>
        </div>
        <button className="btn btn-ghost btn-sm"><Icon.X size={14}/></button>
      </div>

      <div className="inspector-body">
        {/* Fit score block */}
        <div style={{display:'flex', gap:16, alignItems:'center'}}>
          <div style={{position:'relative', width:72, height:72, flexShrink:0}}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#F1F2F1" strokeWidth="8"/>
              <circle cx="36" cy="36" r="30" fill="none" stroke="#0E7A4B" strokeWidth="8"
                strokeDasharray={`${2*Math.PI*30*inv.fit/100} ${2*Math.PI*30}`}
                strokeLinecap="round" transform="rotate(-90 36 36)"/>
            </svg>
            <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <div style={{fontSize:20, fontWeight:600}}>{inv.fit}</div>
              <div className="mono muted" style={{fontSize:9}}>FIT</div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13, fontWeight:500}}>Strong match for <span style={{color:'var(--atlas-accent)'}}>Phase 3 NSCLC, APAC</span></div>
            <div className="muted" style={{fontSize:12, marginTop:2, lineHeight:1.5}}>
              Above-cohort enrollment velocity. No FDA warnings in the last 10 years. Currently on 1 competing Phase 3.
            </div>
          </div>
        </div>

        <div className="divider"/>

        <div className="eyebrow" style={{fontSize:11, marginBottom:10}}>Score breakdown</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'8px 12px', alignItems:'center'}}>
          {bars.map(b => (
            <React.Fragment key={b.k}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{fontSize:12, color:'var(--atlas-fg)', width:150}}>{b.k}</div>
                <div className="bar" style={{flex:1}}>
                  <span style={{width: b.v+'%', background: b.v >= 80 ? 'var(--atlas-green-600)' : 'var(--atlas-warn-500)'}}/>
                </div>
              </div>
              <div className="mono" style={{fontSize:12, fontWeight:600, textAlign:'right', width:28}}>{b.v}</div>
            </React.Fragment>
          ))}
        </div>

        <div className="divider"/>

        <div className="eyebrow" style={{fontSize:11, marginBottom:8}}>Evidence · last 24 months</div>
        <div style={{background:'var(--atlas-bg-sunken)', border:'1px solid var(--atlas-border)', borderRadius:6, padding:'10px 12px'}}>
          <div style={{fontSize:13, lineHeight:1.55}}>
            Dr. {inv.name.split(' ')[inv.name.split(' ').length-1]} enrolled <strong>{inv.enrollments} patients</strong> across <strong>{inv.trials} Phase 2/3 oncology trials</strong> since 2021, with a median screen-to-enroll ratio of <strong>2.3</strong>.
          </div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:10}}>
            <span className="cite-pill">NCT05482451</span>
            <span className="cite-pill">NCT04983342</span>
            <span className="cite-pill">PubMed 38104823</span>
            <span className="cite-pill">FDA 1572 · 2024</span>
            <span className="muted mono" style={{fontSize:11, alignSelf:'center'}}>+4 more</span>
          </div>
        </div>

        <div className="divider"/>

        <div className="eyebrow" style={{fontSize:11, marginBottom:8}}>Enrollment velocity</div>
        <svg viewBox="0 0 320 60" width="100%" height="60" preserveAspectRatio="none" style={{display:'block'}}>
          {[14,18,22,19,26,24,28,25,30,27,33,31].map((v,i) => (
            <rect key={i} x={i*26+4} y={60-v*1.6} width="18" height={v*1.6} rx="2" fill="#0E7A4B" opacity={0.5 + i*0.04}/>
          ))}
        </svg>
        <div className="muted mono" style={{fontSize:11, marginTop:4, display:'flex', justifyContent:'space-between'}}>
          <span>2024 Q1</span><span>2026 Q2</span>
        </div>

        <div style={{display:'flex', gap:8, marginTop:20}}>
          <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}}><Icon.Send size={14}/>Request outreach</button>
          <button className="btn btn-secondary"><Icon.Bookmark size={14}/></button>
          <button className="btn btn-secondary"><Icon.External size={14}/></button>
        </div>
      </div>
    </aside>
  );
}

window.Inspector = Inspector;

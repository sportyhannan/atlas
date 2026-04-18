// Search / results view — the core Atlas workspace
const { useState: useStateSR } = React;

function FitCell({ score }) {
  const cls = score >= 85 ? 'fit-hi' : score >= 70 ? 'fit-med' : 'fit-lo';
  return <span className={'fit ' + cls}>{score}</span>;
}

function StatusBadge({ status }) {
  const map = {
    'Responsive':  ['badge-success', 'var(--atlas-green-600)'],
    'Pending':     ['badge-warn',    'var(--atlas-warn-500)'],
    'Overbooked':  ['badge-danger',  'var(--atlas-danger-500)'],
  };
  const [cls, dot] = map[status] || ['badge-neutral','#999'];
  return (
    <span className={'badge ' + cls}>
      <span className="badge-dot" style={{background: dot}}/>
      {status}
    </span>
  );
}

function SearchView({ onSelectInv, selectedId }) {
  const [chips, setChips] = useStateSR(['Phase 3','NSCLC','15+ enrollments/yr','East Asia','Accepting trials']);
  const [sort, setSort] = useStateSR('fit');
  const data = window.ATLAS_DATA.investigators;
  return (
    <main className="main">
      <div className="main-inner">

        <div className="page-header">
          <div>
            <h1 className="page-title">Investigator search</h1>
            <div className="page-sub">
              <span className="mono">{data.length}</span> investigators match across{' '}
              <span className="mono">17</span> registries ·{' '}
              <span className="muted">updated 14 min ago</span>
            </div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-secondary"><Icon.Doc size={14}/>Export</button>
            <button className="btn btn-primary"><Icon.Plus size={14}/>Save as shortlist</button>
          </div>
        </div>

        <div style={{marginTop:16, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <div className="chip-row">
            {chips.map(c => (
              <span key={c} className="chip">{c}<span className="x" onClick={() => setChips(chips.filter(x=>x!==c))}><Icon.X size={12}/></span></span>
            ))}
            <button className="chip" style={{cursor:'pointer'}}><Icon.Plus size={12}/>Add filter</button>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center'}}>
            <span className="muted" style={{fontSize:12}}>Sort</span>
            <div className="seg">
              <button className={sort==='fit'?'active':''}     onClick={()=>setSort('fit')}>Fit score</button>
              <button className={sort==='velocity'?'active':''} onClick={()=>setSort('velocity')}>Velocity</button>
              <button className={sort==='recency'?'active':''}  onClick={()=>setSort('recency')}>Recency</button>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop:16, padding:0, overflow:'hidden'}}>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:36}}></th>
                <th>Investigator</th>
                <th>Site</th>
                <th>Focus</th>
                <th className="num">Enrollments</th>
                <th className="num">Velocity / yr</th>
                <th>Status</th>
                <th className="num">Fit</th>
              </tr>
            </thead>
            <tbody>
              {data.map(inv => (
                <tr key={inv.id} className={selectedId===inv.id?'selected':''} onClick={()=>onSelectInv(inv)}>
                  <td><div className="avatar" style={{width:28,height:28,fontSize:11}}>{inv.initials}</div></td>
                  <td>
                    <div style={{fontWeight:500}}>Dr. {inv.name}</div>
                    <div className="muted mono" style={{fontSize:11}}>{inv.credentials}</div>
                  </td>
                  <td>
                    <div>{inv.site}</div>
                    <div className="muted" style={{fontSize:11}}>{inv.city}, {inv.country}</div>
                  </td>
                  <td>
                    <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                      {inv.phases.map(p => <span key={p} className="badge-tag">{p}</span>)}
                    </div>
                  </td>
                  <td className="num mono">{inv.enrollments}</td>
                  <td className="num mono">{inv.velocity}</td>
                  <td><StatusBadge status={inv.status}/></td>
                  <td className="num"><FitCell score={inv.fit}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="muted" style={{fontSize:12, marginTop:12, display:'flex', alignItems:'center', gap:8}}>
          <Icon.Check size={14}/> Every row is linked to at least 3 primary sources. Click an investigator to see the dossier.
        </div>

      </div>
    </main>
  );
}

window.SearchView = SearchView;

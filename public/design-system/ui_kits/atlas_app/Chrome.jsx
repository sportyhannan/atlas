// Atlas app — navigation + topbar + shared chrome
const { useState } = React;

function Nav({ active, onNav }) {
  const items = [
    { k:'search',   label:'Search',       Icon: Icon.Search,   count:null },
    { k:'shortlists', label:'Shortlists', Icon: Icon.Bookmark, count:'3' },
    { k:'trials',   label:'My trials',     Icon: Icon.TestTube, count:'4' },
    { k:'outreach', label:'Outreach',      Icon: Icon.Send,     count:'12' },
    { k:'map',      label:'Geographic',    Icon: Icon.Globe,    count:null },
  ];
  const library = [
    { k:'saved',    label:'Saved queries', Icon: Icon.Folder, count:'7' },
    { k:'reports',  label:'Audit reports', Icon: Icon.Doc,    count:null },
  ];
  return (
    <aside className="nav">
      <div className="nav-brand">
        <img src="../../assets/logo-mark.svg" width="24" height="24" alt=""/>
        <span className="nav-brand-text">Atlas</span>
      </div>

      <div className="nav-section">Workspace</div>
      {items.map(it => (
        <a key={it.k} className={'nav-item' + (active===it.k?' active':'')}
           onClick={() => onNav && onNav(it.k)}>
          <it.Icon size={16}/>
          <span>{it.label}</span>
          {it.count && <span className="count">{it.count}</span>}
        </a>
      ))}

      <div className="nav-section">Library</div>
      {library.map(it => (
        <a key={it.k} className={'nav-item' + (active===it.k?' active':'')}
           onClick={() => onNav && onNav(it.k)}>
          <it.Icon size={16}/>
          <span>{it.label}</span>
          {it.count && <span className="count">{it.count}</span>}
        </a>
      ))}

      <div style={{marginTop:'auto', padding:'16px', borderTop:'1px solid var(--atlas-border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="avatar" style={{width:32, height:32, fontSize:12}}>RO</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13, fontWeight:500}}>Rachel Okafor</div>
            <div className="muted" style={{fontSize:11}}>VP Clin Ops · Kestrel Bio</div>
          </div>
          <Icon.Settings size={16}/>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ query, setQuery }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Icon.Search size={16}/>
        <input
          value={query}
          onChange={e => setQuery && setQuery(e.target.value)}
          placeholder="Search 2.1M investigators — try 'Phase 3 NSCLC, Seoul, 15+ enrollments/year'"/>
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-right">
        <button className="btn btn-ghost btn-sm"><Icon.Bell size={16}/></button>
        <button className="btn btn-secondary btn-sm"><Icon.Plus size={14}/>New trial</button>
      </div>
    </header>
  );
}

window.Nav = Nav;
window.Topbar = Topbar;

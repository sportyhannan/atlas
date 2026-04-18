/* Atlas app — shared shell components: Nav, Topbar, Badges, Chips, FitScore */

function Brand() {
  return React.createElement('div', {className:'nav-brand'},
    React.createElement('img',{src:'../../assets/logo-mark.svg', width:28, height:28, alt:''}),
    React.createElement('span',{className:'nav-brand-text'},'Atlas')
  );
}

function NavItem({icon, label, active, count, onClick}) {
  const I = Icon[icon];
  return React.createElement('a',{
      className:'nav-item' + (active?' active':''),
      onClick: onClick,
    },
    I ? React.createElement(I,{size:16}) : null,
    React.createElement('span', null, label),
    count != null ? React.createElement('span',{className:'count'}, count) : null
  );
}

function Sidebar({current, onNav}) {
  return React.createElement('aside',{className:'nav'},
    React.createElement(Brand),
    React.createElement('div',{className:'nav-section'},'Discover'),
    React.createElement(NavItem,{icon:'Search', label:'Search', active:current==='search', onClick:()=>onNav('search')}),
    React.createElement(NavItem,{icon:'Globe',  label:'World atlas', onClick:()=>onNav('search')}),
    React.createElement(NavItem,{icon:'Activity', label:'Enrollment trends', onClick:()=>onNav('search')}),
    React.createElement('div',{className:'nav-section'},'My work'),
    React.createElement(NavItem,{icon:'Bookmark', label:'Shortlists', active:current==='shortlists', count:'4', onClick:()=>onNav('shortlists')}),
    React.createElement(NavItem,{icon:'TestTube', label:'Trials', count:'12', onClick:()=>onNav('search')}),
    React.createElement(NavItem,{icon:'Send',     label:'Outreach',  count:'38', onClick:()=>onNav('search')}),
    React.createElement(NavItem,{icon:'Folder',   label:'Saved searches', count:'7', onClick:()=>onNav('search')}),
    React.createElement('div',{style:{marginTop:'auto'}},
      React.createElement('div',{className:'nav-section'},'Account'),
      React.createElement(NavItem,{icon:'Settings', label:'Settings', onClick:()=>onNav('search')}),
      React.createElement('div',{style:{padding:'10px 16px 14px', borderTop:'1px solid var(--atlas-border)', display:'flex', gap:10, alignItems:'center'}},
        React.createElement('div',{className:'avatar',style:{width:28,height:28,fontSize:11}},'RO'),
        React.createElement('div',{style:{flex:1,lineHeight:1.2}},
          React.createElement('div',{style:{fontSize:13,fontWeight:500}},'Rachel Okafor'),
          React.createElement('div',{style:{fontSize:11,color:'var(--atlas-fg-muted)'}},'Verent Oncology')
        )
      )
    )
  );
}

function Topbar({query, setQuery, onSubmit}) {
  return React.createElement('header',{className:'topbar'},
    React.createElement('div',{className:'topbar-search'},
      React.createElement(Icon.Search,{size:16}),
      React.createElement('input',{
        value:query, onChange:e=>setQuery(e.target.value),
        onKeyDown:e=>{if(e.key==='Enter')onSubmit();},
        placeholder:'Ask in natural language — "Phase 3 HER2+ breast cancer, EU, 15+ enrollments/year"'
      }),
      React.createElement('span',{className:'kbd'},'⌘K')
    ),
    React.createElement('div',{className:'topbar-right'},
      React.createElement('button',{className:'btn btn-ghost',style:{width:32,padding:0,justifyContent:'center'}},
        React.createElement(Icon.Bell,{size:16})),
      React.createElement('button',{className:'btn btn-secondary'}, 'Invite team'),
      React.createElement('button',{className:'btn btn-primary', onClick:onSubmit},
        React.createElement(Icon.Plus,{size:14}),'New search')
    )
  );
}

function FitScore({value}) {
  const cls = value >= 85 ? 'fit-hi' : value >= 70 ? 'fit-med' : 'fit-lo';
  return React.createElement('span',{className:`fit ${cls}`}, value);
}

function Chip({children, closable=true}) {
  return React.createElement('span',{className:'chip'},
    children,
    closable ? React.createElement('span',{className:'x'},'✕') : null
  );
}

function Bar({value, color}) {
  return React.createElement('div',{className:'bar'},
    React.createElement('span',{style:{width: value+'%', background: color||'var(--atlas-accent)'}})
  );
}

Object.assign(window, { Brand, Sidebar, Topbar, FitScore, Chip, Bar, NavItem });

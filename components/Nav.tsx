'use client';
import * as Icon from './Icons';

type NavView = 'search' | 'shortlists' | 'trials' | 'outreach' | 'map' | 'saved' | 'reports';

type NavProps = {
  active: NavView;
  onNav: (v: NavView) => void;
};

const WORKSPACE = [
  { k: 'search'     as NavView, label: 'Search',      Icon: Icon.Search,   count: null },
  { k: 'shortlists' as NavView, label: 'Shortlists',  Icon: Icon.Bookmark, count: '3' },
  { k: 'trials'     as NavView, label: 'My trials',   Icon: Icon.TestTube, count: '4' },
  { k: 'outreach'   as NavView, label: 'Outreach',    Icon: Icon.Send,     count: '12' },
  { k: 'map'        as NavView, label: 'Geographic',  Icon: Icon.Globe,    count: null },
];

const LIBRARY = [
  { k: 'saved'   as NavView, label: 'Saved queries', Icon: Icon.Folder, count: '7' },
  { k: 'reports' as NavView, label: 'Audit reports', Icon: Icon.Doc,    count: null },
];

export default function Nav({ active, onNav }: NavProps) {
  return (
    <aside className="nav">
      <div className="nav-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" stroke="#0E7A4B" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="4" fill="#0E7A4B"/>
          <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="#0E7A4B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="nav-brand-text">Atlas</span>
      </div>

      <div className="nav-section">Workspace</div>
      {WORKSPACE.map(item => (
        <button
          key={item.k}
          className={`nav-item${active === item.k ? ' active' : ''}`}
          onClick={() => onNav(item.k)}
        >
          <item.Icon size={16} />
          <span>{item.label}</span>
          {item.count && <span className="count">{item.count}</span>}
        </button>
      ))}

      <div className="nav-section">Library</div>
      {LIBRARY.map(item => (
        <button
          key={item.k}
          className={`nav-item${active === item.k ? ' active' : ''}`}
          onClick={() => onNav(item.k)}
        >
          <item.Icon size={16} />
          <span>{item.label}</span>
          {item.count && <span className="count">{item.count}</span>}
        </button>
      ))}

      <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid var(--atlas-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>RO</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Rachel Okafor</div>
            <div className="muted" style={{ fontSize: 11 }}>VP Clin Ops · Kestrel Bio</div>
          </div>
          <Icon.Settings size={16} />
        </div>
      </div>
    </aside>
  );
}

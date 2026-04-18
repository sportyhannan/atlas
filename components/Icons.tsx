'use client';
// Inline SVG icons — Lucide style, 1.5px stroke, currentColor

type IconProps = { size?: number; className?: string };

const svg = (paths: React.ReactNode, { size = 16, className = '' }: IconProps) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.5}
    strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true"
  >
    {paths}
  </svg>
);

export const Search    = (p: IconProps) => svg(<><circle cx={11} cy={11} r={7}/><path d="m21 21-4.3-4.3"/></>, p);
export const Plus      = (p: IconProps) => svg(<><path d="M12 5v14"/><path d="M5 12h14"/></>, p);
export const X         = (p: IconProps) => svg(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>, p);
export const Filter    = (p: IconProps) => svg(<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>, p);
export const Globe     = (p: IconProps) => svg(<><circle cx={12} cy={12} r={10}/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, p);
export const TestTube  = (p: IconProps) => svg(<><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></>, p);
export const List      = (p: IconProps) => svg(<><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></>, p);
export const Doc       = (p: IconProps) => svg(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></>, p);
export const Folder    = (p: IconProps) => svg(<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>, p);
export const Settings  = (p: IconProps) => svg(<><circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>, p);
export const Bell      = (p: IconProps) => svg(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>, p);
export const Send      = (p: IconProps) => svg(<path d="m22 2-7 20-4-9-9-4 20-7z"/>, p);
export const Bookmark  = (p: IconProps) => svg(<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>, p);
export const Star      = (p: IconProps) => svg(<path d="M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z"/>, p);
export const External  = (p: IconProps) => svg(<><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>, p);
export const Check     = (p: IconProps) => svg(<path d="M20 6 9 17l-5-5"/>, p);
export const ChevDown  = (p: IconProps) => svg(<path d="m6 9 6 6 6-6"/>, p);
export const ArrowRight= (p: IconProps) => svg(<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>, p);
export const Activity  = (p: IconProps) => svg(<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>, p);
export const MapPin    = (p: IconProps) => svg(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx={12} cy={10} r={3}/></>, p);
export const AlertTriangle = (p: IconProps) => svg(<><path d="M10.3 3.3 2 21h20L13.7 3.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>, p);
export const Loader    = (p: IconProps) => svg(<><path d="M21 12a9 9 0 1 1-6.22-8.56"/></>, { ...p, className: (p.className ?? '') + ' spin' });
export const Columns   = (p: IconProps) => svg(<><rect x={3} y={3} width={8} height={18} rx={1}/><rect x={13} y={3} width={8} height={18} rx={1}/></>, p);
export const TrendingUp= (p: IconProps) => svg(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>, p);
export const Headphones= (p: IconProps) => svg(<><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>, p);
export const Play      = (p: IconProps) => svg(<><circle cx={12} cy={12} r={10}/><polygon points="10 8 16 12 10 16 10 8"/></>, p);

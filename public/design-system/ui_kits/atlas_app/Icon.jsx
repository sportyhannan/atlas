/* Atlas icons — inline SVGs mirroring Lucide, rendered through React.
   Stroke 1.5, size 16 default. currentColor. */
const _svg = (d, size = 16, props = {}) =>
  React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    ...props
  }, d);

const Icon = {
  Search:  (p={}) => _svg([React.createElement('circle',{key:1,cx:11,cy:11,r:7}), React.createElement('path',{key:2,d:'m21 21-4.3-4.3'})], p.size||16, p),
  Plus:    (p={}) => _svg([React.createElement('path',{key:1,d:'M12 5v14'}), React.createElement('path',{key:2,d:'M5 12h14'})], p.size||16, p),
  Check:   (p={}) => _svg([React.createElement('path',{key:1,d:'M20 6 9 17l-5-5'})], p.size||16, p),
  X:       (p={}) => _svg([React.createElement('path',{key:1,d:'M18 6 6 18'}), React.createElement('path',{key:2,d:'m6 6 12 12'})], p.size||16, p),
  Filter:  (p={}) => _svg([React.createElement('path',{key:1,d:'M22 3H2l8 9.5V19l4 2v-8.5L22 3z'})], p.size||16, p),
  Globe:   (p={}) => _svg([React.createElement('circle',{key:1,cx:12,cy:12,r:10}),React.createElement('path',{key:2,d:'M2 12h20'}),React.createElement('path',{key:3,d:'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'})], p.size||16, p),
  Activity:(p={}) => _svg([React.createElement('path',{key:1,d:'M22 12h-4l-3 9L9 3l-3 9H2'})], p.size||16, p),
  TestTube:(p={}) => _svg([React.createElement('path',{key:1,d:'M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2'}),React.createElement('path',{key:2,d:'M8.5 2h7'}),React.createElement('path',{key:3,d:'M14.5 16h-5'})], p.size||16, p),
  List:    (p={}) => _svg([React.createElement('path',{key:1,d:'M8 6h13'}),React.createElement('path',{key:2,d:'M8 12h13'}),React.createElement('path',{key:3,d:'M8 18h13'}),React.createElement('path',{key:4,d:'M3 6h.01'}),React.createElement('path',{key:5,d:'M3 12h.01'}),React.createElement('path',{key:6,d:'M3 18h.01'})], p.size||16, p),
  Doc:     (p={}) => _svg([React.createElement('path',{key:1,d:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'}),React.createElement('path',{key:2,d:'M14 2v6h6'}),React.createElement('path',{key:3,d:'M16 13H8'}),React.createElement('path',{key:4,d:'M16 17H8'})], p.size||16, p),
  Folder:  (p={}) => _svg([React.createElement('path',{key:1,d:'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z'})], p.size||16, p),
  Settings:(p={}) => _svg([React.createElement('circle',{key:1,cx:12,cy:12,r:3}),React.createElement('path',{key:2,d:'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'})], p.size||16, p),
  Bell:    (p={}) => _svg([React.createElement('path',{key:1,d:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'}),React.createElement('path',{key:2,d:'M10.3 21a1.94 1.94 0 0 0 3.4 0'})], p.size||16, p),
  Send:    (p={}) => _svg([React.createElement('path',{key:1,d:'m22 2-7 20-4-9-9-4 20-7z'})], p.size||16, p),
  Bookmark:(p={}) => _svg([React.createElement('path',{key:1,d:'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'})], p.size||16, p),
  Clock:   (p={}) => _svg([React.createElement('circle',{key:1,cx:12,cy:12,r:10}),React.createElement('path',{key:2,d:'M12 6v6l4 2'})], p.size||16, p),
  Star:    (p={}) => _svg([React.createElement('path',{key:1,d:'M12 2 15.1 8.3 22 9.3l-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z'})], p.size||16, p),
  Dots:    (p={}) => _svg([React.createElement('circle',{key:1,cx:12,cy:12,r:1}),React.createElement('circle',{key:2,cx:19,cy:12,r:1}),React.createElement('circle',{key:3,cx:5,cy:12,r:1})], p.size||16, p),
  ChevDown:(p={}) => _svg([React.createElement('path',{key:1,d:'m6 9 6 6 6-6'})], p.size||16, p),
  ArrowRight:(p={}) => _svg([React.createElement('path',{key:1,d:'M5 12h14'}),React.createElement('path',{key:2,d:'m12 5 7 7-7 7'})], p.size||16, p),
  External:(p={}) => _svg([React.createElement('path',{key:1,d:'M15 3h6v6'}),React.createElement('path',{key:2,d:'M10 14 21 3'}),React.createElement('path',{key:3,d:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'})], p.size||16, p),
};

window.Icon = Icon;

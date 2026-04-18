# Atlas web app — UI kit

A high-fidelity recreation of the Atlas investigator discovery workspace.

## What this kit contains

- **`index.html`** — the canonical view of the product: left nav, global search top bar, investigator search results, right-side dossier inspector.
- **`Chrome.jsx`** — `<Nav/>` (sidebar with workspace + library sections, user footer) and `<Topbar/>` (sticky, blurred, global NL search).
- **`SearchView.jsx`** — the central table view with filter chips, sort segmented control, and the canonical investigator table. Includes `<FitCell/>` and `<StatusBadge/>`.
- **`Inspector.jsx`** — the right-hand dossier panel: big Fit score donut, score breakdown bars, citations block, enrollment-velocity sparkline, action buttons.
- **`Icon.jsx`** — a small set of inline SVG icons matching Lucide's 1.5px-stroke aesthetic.
- **`data.js`** — mock investigator payload used by the search + dossier.
- **`app.css`** — all component styling, layered on top of `colors_and_type.css`.

## Interactions demonstrated

- Click any row in the table → loads that investigator into the inspector.
- Chip row: remove a filter by clicking the X; "Add filter" is wired as a button.
- Sort segmented control toggles between Fit, Velocity, Recency (cosmetic).
- Keyboard hint `⌘K` shown on global search; nav items reflect active route.

## Visual rules enforced

- 1440px canvas width, 56px topbar, 240px nav, 400px inspector — matches the root system's layout rules.
- Table uses compact 32px rows with hairline bottom borders (no zebra).
- Clinical green (`--atlas-green-600`) is the only accent color.
- All identifiers (NCT, NPI, DOI) are set in IBM Plex Mono.
- All claims in the inspector are followed by a citation pill row.

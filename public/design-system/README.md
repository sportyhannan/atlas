# Atlas Design System

> The talent layer for global clinical trials.

Atlas is an AI-native platform that helps pharma Clinical Operations teams, CROs, and disease foundations find the right principal investigators for clinical trials. It replaces the 2013-era investigator databases (Citeline, DrugDev) and the $2M–$5M-per-study CRO site-selection services with a queryable, evidence-linked graph over ClinicalTrials.gov, PubMed, FDA Form 1572 filings, the NPI registry, FDA warning letters, and 17 international trial registries.

The product is best understood as **"Moneyball for principal investigators"** — an AI reasoning layer over every piece of public clinical evidence on the planet.

---

## Product surfaces

Atlas is primarily one product — a web application — with a thin marketing site on top. This design system documents:

1. **Atlas web app** — the investigator-discovery workspace (search, shortlist, dossier, outreach). This is where Clinical Ops Directors live.
2. **Atlas marketing site** — a single dense landing page aimed at pharma decision-makers.

There is no mobile app. Atlas is used at a desk, with two monitors, for hours at a time.

---

## Who we design for

The primary user is **Dr. Rachel Okafor**, VP of Clinical Operations at a Series C oncology biotech. She runs 4–6 concurrent Phase 2/3 trials. Every delayed day costs $800K. She is:

- **Data-literate.** Comfortable reading a forest plot.
- **Time-poor.** Scans before reading. Hates empty states and marketing copy.
- **Accountable.** Will be asked by her CEO *why* a site was chosen. Every recommendation must cite evidence.
- **International.** Her trials run in São Paulo, Seoul, Warsaw, Lagos. The product must not feel American-first.

The secondary user is a **Site Selection Analyst** at a CRO (IQVIA, ICON, Syneos) who runs Atlas as a service to pharma clients and needs receipts.

---

## Sources referenced

No codebase, Figma, or deck was attached to this project. The system below was synthesized from the product brief (the Atlas pitch deck script) and from the conventions of the clinical-trial / health-tech category:

- Product tone: the attached 2-minute pitch script ("Moneyball for principal investigators", "78% of trials fail to enroll on time", "Nashville, Lagos, Manila").
- Visual references: the restrained data-dense aesthetic of Palantir Foundry, Benchling, Stripe's internal dashboards, Atomwise, and Truveta. Clinical-green accent, dense tables, evidence-forward layouts.

If a codebase or Figma file exists, re-attach it and I'll reconcile this system against it.

---

## Index

- [`README.md`](./README.md) — this file (context, content rules, visual foundations, iconography)
- [`colors_and_type.css`](./colors_and_type.css) — CSS custom properties for the full token system
- [`SKILL.md`](./SKILL.md) — agent-invocable skill manifest (Claude Code compatible)
- `assets/` — `logo-mark.svg`, `logo-horizontal.svg`, `logo-horizontal-dark.svg`
- `preview/` — Design System tab cards (23 cards across Brand / Colors / Type / Spacing / Components)
- `ui_kits/atlas_app/` — React/JSX recreation of the Atlas web app: `Nav`, `Topbar`, `SearchView`, `Inspector`, `Icon`, `data.js`, `app.css`, `index.html`

**Fonts** are loaded from Google Fonts (Inter, Fraunces, IBM Plex Mono) via `colors_and_type.css`. No local font files are stored — see the substitution flag in ICONOGRAPHY.

---

## CONTENT FUNDAMENTALS

Atlas copy is written the way a senior analyst writes a memo: **dense, specific, numerate, and skeptical of hype.** Cut every word that doesn't earn its place. Pharma ops directors read thousands of pages of regulatory text a week — they can smell marketing fluff at 30 feet.

### Voice pillars

1. **Numerate over narrative.** Lead with a number. `22 sites, 8 countries, 87% enrollment confidence` beats *"Accelerate your trial."*
2. **Specific over general.** Name the disease, the phase, the geography. `Phase 3 NSCLC in Seoul` beats *"oncology trials in Asia."*
3. **Receipts always.** Every claim is linked to a source — a publication, a Form 1572, a ClinicalTrials.gov record. The UI says "Cited" not "Trusted."
4. **Deferential to the user.** The user is the expert. Atlas surfaces evidence; it does not tell them what to do. No hype, no emoji, no exclamation marks.

### Casing & punctuation

- **Sentence case** for every heading, button, and menu item. *"Run search"*, not *"Run Search"* or *"RUN SEARCH"*.
- **Oxford comma** always.
- **Numerals for numbers ≥ 2**, including when starting a sentence. `22 sites, not twenty-two sites.`
- **No em-dashes in product copy.** Use periods or parentheses. Em-dashes are reserved for editorial writing on the marketing site.
- **Proper nouns are preserved exactly:** ClinicalTrials.gov, PubMed, Form 1572. Never "Clinicaltrials" or "FDA 1572."

### Pronouns & address

- **You** addresses the user directly. *"You have 3 saved shortlists."*
- **We** is avoided in product copy. Atlas is a tool, not a team. On the marketing site, "we" is fine in the About section only.
- **The system never says "I."** Atlas is not a chatbot; it's a research surface.

### Forbidden words

Ban list for product copy: *seamless, effortless, magical, revolutionary, game-changing, unlock, empower, supercharge, AI-powered* (it's obvious), *delightful, beautiful, journey.* Also ban *doctor* when we mean *investigator* — the precision matters.

### Examples

| Wrong | Right |
|---|---|
| "Unlock the power of AI-driven investigator discovery!" | "Search 2.1M investigators across 17 trial registries." |
| "We found some great matches for you" | "18 investigators match. 4 have Phase 3 NSCLC experience." |
| "Oops, something went wrong 😔" | "Search failed. The ClinicalTrials.gov connector is rate-limited; retrying in 30s." |
| "Get started" (CTA) | "Run first search" |
| "Trusted by leading pharma" | "Used by 14 trial teams, including 3 of the top-20 biopharma." |

### Emoji policy

**No emoji, ever, in product surfaces.** This is a clinical tool. Emoji read as unserious. The only exception is the occasional internal Slack-style status dot (●), and that is rendered as a colored circle in CSS, not as a Unicode character.

### Empty states

Empty states are the single biggest tell of product maturity. Atlas empty states always include: (1) a specific next action, (2) a sample query the user can run, (3) an estimate of what they'll see.

> **No shortlists yet.**
> Shortlists let you compare investigators across a single trial protocol.
> **Try:** "Phase 3 HER2+ breast cancer, EU, 15+ enrollments/year" — returns ~40 investigators.

---

## VISUAL FOUNDATIONS

Atlas feels like a **instrument**, not an app. The visual language is closer to a Bloomberg terminal, a hospital EHR, or Palantir Foundry than it is to a Figma-bright SaaS dashboard.

### Color

- **Core palette is bone-white and near-black**, with a single **clinical green** (`--atlas-green-600 #0E7A4B`) as the accent. Green reads as clinical (scrubs, validated, "go") without feeling like a startup.
- **No gradients** except one very subtle neutral protection gradient over data-dense images (0% → 12% black). No blue-to-purple SaaS gradients. Ever.
- **Semantic colors are muted**, not bright. Warning is ochre, not yellow. Error is brick, not red. Success is the same clinical green as the accent.
- **Dark mode exists** and is treated as first-class — many users work in dimmed rooms reviewing patient data.
- **Data viz palette** is a 7-step categorical scale calibrated for colorblind accessibility and for printing on paper (audit reports get printed).

### Typography

- **Display/body:** Inter (variable). Chosen for its neutrality and screen legibility at small sizes — critical for dense tables.
- **Editorial/marketing display:** Fraunces (variable) at optical size 144, weight 400, used sparingly on the marketing site only. Adds a slightly editorial, almost journal-like quality — appropriate for a company whose core asset is evidence.
- **Mono:** IBM Plex Mono, for NCT numbers, NPI IDs, DOIs, query syntax.
- **No type scale above 72px in product.** The marketing hero goes to 96px.
- **Numbers use tabular figures everywhere.** `font-variant-numeric: tabular-nums;` is set on the root.

### Spacing

- **4px base grid.** All spacing is a multiple of 4.
- **Density is a deliberate virtue.** Atlas uses a "compact" row height (32px) as the default, not the SaaS-standard 48px. Power users get more on screen; that matters.
- **Gutters are narrow (16–24px)** in product. The marketing site breathes more (64–96px section padding).

### Corner radii

- **4px** for inputs, buttons, badges (the default).
- **8px** for cards and panels.
- **12px** for modals and the global search bar only.
- **Full radius (9999px)** for the occasional pill/tag.
- Never more than 12px on a rectangular element. Clinical, not cute.

### Borders & dividers

- **1px hairlines in `--atlas-border` (#E5E7EB-ish)** separate table rows, panels, and sections.
- **Focus rings are a 2px clinical-green outline with a 2px offset.** Never removed.
- **Table rows use bottom-border dividers, not zebra striping.** Zebra feels spreadsheet-y; borders feel scientific.

### Shadows & elevation

A 4-step elevation system, all cool-neutral, never warm:

- `shadow-xs` — 0 1px 0 rgba(17,24,39,0.04) — for buttons at rest
- `shadow-sm` — 0 1px 2px rgba(17,24,39,0.06) — for cards
- `shadow-md` — 0 4px 12px rgba(17,24,39,0.08) — for menus and popovers
- `shadow-lg` — 0 12px 32px rgba(17,24,39,0.12) — for modals

Inner shadows are used only on pressed buttons (`inset 0 1px 0 rgba(0,0,0,0.08)`).

### Backgrounds, imagery, illustration

- **Backgrounds are flat.** No repeating textures, no noise, no generated gradients in product. The marketing site is allowed one full-bleed photograph per section, but it must be documentary (a real lab, a real investigator at a microscope, not stock).
- **No AI-generated illustration.** Ever. We are a company built on evidence; fake hero illustrations undermine that.
- **Data visualization IS the illustration.** A 3-year enrollment velocity chart. A world map of a PI's trial footprint. A citation graph. These are the "brand images."
- **When photos appear, they are desaturated to ~70% saturation** and lightly cool-graded. No warm Instagram filters.

### Animation

- **Restrained. Functional.** Easing is `cubic-bezier(0.22, 0.61, 0.36, 1)` (a fast-out, soft-land curve) at 140ms for most UI transitions.
- **No bounce.** Bounce feels toy-like; Atlas is an instrument.
- **Fades are 80ms.** Layout transitions (shortlist reordering) are 160ms.
- **Never animate on scroll.** Users scroll tables for hours; chrome moving under them is hostile.
- **Skeleton loaders, not spinners**, for any load over 200ms.

### Hover & press states

- **Hover** darkens the background by 4–6% (for neutral surfaces) or applies `--atlas-bg-hover` (`#F5F6F7`). Never lightens. Never scales.
- **Press** darkens by an additional 4% and applies a 1px inset shadow. No shrink — it's uncomfortable at high density.
- **Focus** is always the green 2px ring, offset 2px.
- **Disabled** is 40% opacity, `cursor: not-allowed`, no other treatment.

### Cards

Cards have `1px solid --atlas-border`, `border-radius: 8px`, `background: --atlas-bg-elevated` (near-white in light mode), and `shadow-sm`. Padding is 20px. Cards do **not** use colored left borders as category markers — that tropes SaaS. Category is communicated by a labeled header or a monochrome icon.

### Layout rules

- **Max content width in the app is 1440px.** Tables go edge-to-edge inside that.
- **Sticky left nav at 240px wide.** Collapsible to 56px.
- **Sticky top bar at 56px.** Contains global search only; no secondary actions.
- **Right panel ("inspector") at 400px**, used for investigator dossiers opened from a list without leaving context.
- **Marketing site is 1200px max**, single-column, generous vertical rhythm.

### Transparency & blur

- **Modal backdrop is `rgba(17, 24, 39, 0.40)` with no blur.** Blur is expensive and reads as iOS-y. We don't need it.
- **The only use of `backdrop-filter`** is the sticky top bar, which uses `backdrop-filter: saturate(1.2) blur(8px)` over a `rgba(255,255,255,0.85)` background so content scrolls cleanly under it.

### Imagery color vibe

Cool, slightly cyan-shifted, moderately desaturated (~70%), never warm. Photography is documentary in framing — wide shots, natural light, real clinical environments. No grain.

---

## ICONOGRAPHY

Atlas uses **[Lucide](https://lucide.dev)** as its icon system. Lucide was chosen over Heroicons, Feather, and Phosphor because:

1. Its 1.5px stroke weight matches Atlas's hairline aesthetic.
2. It has specific medical-adjacent glyphs (`activity`, `stethoscope`, `test-tube`, `microscope`, `pill`) without being twee.
3. It ships as a CDN module and as individual SVGs — we use the CDN in prototypes, and snapshot specific SVGs into `assets/icons/` for production.

### Rules

- **Icons are always 16px or 20px** in product. 24px in the marketing site.
- **Stroke weight is 1.5px.** Never 2px (too heavy for our type), never 1px (illegible).
- **Icons are monochrome.** Either `currentColor` (inheriting text color) or `--atlas-fg-muted`. Never tinted.
- **Icons are decorative-first.** Every icon has a text label next to it, unless the icon is universally understood (close, search). Icon-only buttons always have `aria-label`.
- **No emoji in product UI.** See Content Fundamentals. On the marketing site, emoji in case studies quoted from customers may appear — but not in Atlas-authored copy.
- **Logo marks of integration partners** (ClinicalTrials.gov, PubMed, FDA, NPI registry) are stored as monochrome SVGs in `assets/integrations/` and rendered at `--atlas-fg-muted` — not in brand color, because we're not endorsing them, we're citing them.

### Substitutions flagged

This system currently **links Lucide from a CDN** rather than bundling icon SVGs locally. For production, snapshot the specific icons used into `assets/icons/`.

### Font substitutions flagged

Atlas ships with **Inter, Fraunces, and IBM Plex Mono** — all loaded from Google Fonts in this system (no local font files were provided). If the Atlas brand has specific licensed fonts, drop the `.woff2` files into `fonts/` and update `colors_and_type.css`. Flagged for the brand owner to confirm.

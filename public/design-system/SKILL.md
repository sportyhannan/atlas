---
name: atlas-design
description: Use this skill to generate well-branded interfaces and assets for Atlas, the talent layer for global clinical trials. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping Atlas screens, slides, and clinical-trial investigator-discovery experiences.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — company context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — CSS custom properties for the full token system (colors, type, spacing, radii, shadows, motion, layout). Import this at the top of any HTML artifact.
- `assets/` — logos, marks
- `preview/` — design-system cards
- `ui_kits/atlas_app/` — React/JSX recreation of the Atlas web app (Nav, Topbar, SearchView, Inspector, Icon)

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Always `@import url('colors_and_type.css')` and use the `--atlas-*` variables rather than hard-coding hex values.

If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

Core rules to respect when designing for Atlas:
1. **Clinical green (`--atlas-green-600` / `#0E7A4B`) is the ONLY brand accent.** No blue-to-purple gradients. No rainbow.
2. **No emoji in product surfaces.** This is a clinical instrument.
3. **Every claim cites its source** — NCT numbers, PubMed IDs, Form 1572, in IBM Plex Mono.
4. **Dense is good.** Default table rows are 32px tall. Default body is 14px.
5. **Restrained motion.** 140ms standard; no bounce; no scroll-triggered animation.
6. **Sentence case** everywhere. No ALL CAPS except eyebrow labels.
7. Use Lucide icons at 1.5px stroke, 16 or 20px, always monochrome.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

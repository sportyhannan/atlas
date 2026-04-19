# Rising Stars UI - Quick Setup Summary

## What Was Created

### 1. Type Definitions
- `types/rising-star.ts` - TypeScript type for pipeline candidates

### 2. Data Layer
- `lib/rising-stars.ts` - Server-side data fetching from Supabase
- `actions/rising-stars.ts` - Server action wrapper

### 3. UI Components
- `components/rising-star-card.tsx` - Detailed candidate card component
- `components/navigation.tsx` - Tab navigation between pages
- `app/rising-stars/page.tsx` - Main Rising Stars page with filters

### 4. Updated Files
- `app/layout.tsx` - Added navigation component
- `app/page.tsx` - Adjusted styling for navigation bar

### 5. Pipeline Utilities
- `pipeline/upload-to-supabase.js` - Upload script for pipeline results
- `docs/RISING_STARS_UI.md` - Comprehensive documentation

## Quick Start

### 1. Set up Supabase Table

Run this SQL in Supabase:

```sql
CREATE TABLE rising_stars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT,
  state TEXT,
  orcid_url TEXT,
  grant_id TEXT NOT NULL UNIQUE,
  fiscal_year INTEGER,
  research_topics TEXT[],
  composite_score INTEGER NOT NULL,
  research_output_score INTEGER,
  clinical_exposure_score INTEGER,
  institutional_readiness_score INTEGER,
  total_publications INTEGER,
  pubs_last_3_years INTEGER,
  active_trials_at_site INTEGER,
  phase_2_plus_trials INTEGER,
  investigator_trial_count INTEGER,
  data_completeness NUMERIC,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rising_stars_composite_score ON rising_stars(composite_score DESC);
CREATE INDEX idx_rising_stars_needs_review ON rising_stars(needs_review);
CREATE INDEX idx_rising_stars_institution ON rising_stars(institution);
CREATE INDEX idx_rising_stars_fiscal_year ON rising_stars(fiscal_year DESC);
```

### 2. Run the Pipeline

```bash
node pipeline/index.js
```

This creates `candidates_output.json` with all MD/PhD candidates.

### 3. Upload to Supabase

```bash
node pipeline/upload-to-supabase.js candidates_output.json
```

### 4. Start Dev Server

```bash
npm run dev
```

### 5. View the UI

Navigate to: `http://localhost:3000/rising-stars`

## Features

✅ **Filtering**
- All candidates
- High score (70+)
- Needs review

✅ **Search**
- By name
- By institution
- By research topics

✅ **Sorting**
- By composite score
- By name
- By institution

✅ **Score Visualization**
- Color-coded composite scores
- Progress bars for each score component
- Data completeness indicators

✅ **Statistics Dashboard**
- Total candidates
- High score count
- Needs review count
- Average score

## Navigation

The app now has 2 tabs:
1. **Investigators** - Your existing clinical trial investigators
2. **Rising Stars** - New MD/PhD candidates from the pipeline

Switch between tabs using the navigation bar at the top.

## Score Breakdown

Each candidate shows:
- **Composite Score** (0-100): Overall ranking
- **Research Output** (40% weight): Publications and research metrics
- **Clinical Exposure** (35% weight): Trial participation and clinical experience
- **Institutional Readiness** (25% weight): Institution's trial infrastructure

## Next Steps

1. Run the pipeline to generate real data
2. Upload the data to Supabase
3. Customize the UI colors/styling as needed
4. Add export functionality if desired
5. Set up automated pipeline runs

## File Structure

```
app/
  ├── rising-stars/
  │   └── page.tsx          # Main Rising Stars page
  ├── layout.tsx            # Updated with navigation
  └── page.tsx              # Updated Investigators page

components/
  ├── rising-star-card.tsx  # Candidate card component
  └── navigation.tsx        # Tab navigation

types/
  └── rising-star.ts        # TypeScript types

lib/
  └── rising-stars.ts       # Data fetching

actions/
  └── rising-stars.ts       # Server actions

pipeline/
  ├── index.js              # Main pipeline
  └── upload-to-supabase.js # Upload script

docs/
  ├── RISING_STARS_UI.md    # Full documentation
  └── SETUP_SUMMARY.md      # This file
```

## Support

See `docs/RISING_STARS_UI.md` for detailed documentation on:
- Customization options
- Troubleshooting
- Score color coding
- Future enhancements

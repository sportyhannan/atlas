# Rising Stars UI Documentation

This document explains how to set up and use the Rising Stars UI tab in your application.

## Overview

The Rising Stars UI displays MD/PhD candidates identified through the pipeline (`pipeline/index.js`) in a beautiful, filterable, and sortable interface.

## Features

- **Beautiful Card Layout**: Each candidate displayed in a detailed card with score breakdowns
- **Advanced Filtering**: Filter by score ranges, review status, or search by name/institution/topic
- **Multiple Sort Options**: Sort by composite score, name, or institution
- **Statistics Dashboard**: See total candidates, high scorers, review needed count, and average score
- **Score Visualizations**: Color-coded scores with progress bars for each score component
- **ORCID Integration**: Direct links to researcher ORCID profiles
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Create Supabase Table

First, create the `rising_stars` table in your Supabase project. Run this SQL in the Supabase SQL Editor:

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

-- Create indexes for performance
CREATE INDEX idx_rising_stars_composite_score ON rising_stars(composite_score DESC);
CREATE INDEX idx_rising_stars_needs_review ON rising_stars(needs_review);
CREATE INDEX idx_rising_stars_institution ON rising_stars(institution);
CREATE INDEX idx_rising_stars_fiscal_year ON rising_stars(fiscal_year DESC);
```

### 2. Run the Pipeline

Execute the pipeline to generate candidate data:

```bash
node pipeline/index.js
```

This will create `candidates_output.json` with all rising star candidates.

### 3. Upload Data to Supabase

Upload the pipeline results to your Supabase database:

```bash
node pipeline/upload-to-supabase.js candidates_output.json
```

Make sure your environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. View the UI

Navigate to the Rising Stars tab in your application:

```
http://localhost:3000/rising-stars
```

## UI Components

### Navigation
- Located at the top of the page
- Switches between "Investigators" and "Rising Stars" tabs
- Sticky header for easy navigation

### Statistics Dashboard
Shows 4 key metrics:
- **Total Candidates**: All candidates in the system
- **High Score (70+)**: Candidates with composite scores ≥ 70
- **Needs Review**: Candidates flagged for manual review (data completeness < 60%)
- **Average Score**: Mean composite score across all candidates

### Filters & Search
- **All**: Show all candidates
- **High Score**: Show only candidates with score ≥ 70
- **Needs Review**: Show only flagged candidates
- **Search**: Filter by name, institution, or research topics
- **Sort**: Order by score (default), name, or institution

### Candidate Cards

Each card displays:

**Header Section:**
- Candidate name
- Institution and location
- Fiscal year and grant ID
- "Needs Review" badge (if applicable)
- Research topic tags

**Score Section:**
- Large composite score (0-100)
- Color-coded badge (green: 70+, blue: 50-69, amber: 30-49, gray: <30)

**Score Breakdown:**
Three progress bars showing:
- Research Output (40% weight)
- Clinical Exposure (35% weight)
- Institutional Readiness (25% weight)

**Signals/Metrics:**
- Total Publications
- Recent Publications (last 3 years)
- Active Trials at Site
- Phase 2+ Trials
- Data Completeness percentage

**External Links:**
- ORCID profile link (when available)

## Score Color Coding

| Score Range | Color | Badge Style |
|-------------|-------|-------------|
| 70-100 | Green | High performer |
| 50-69 | Blue | Good candidate |
| 30-49 | Amber | Moderate potential |
| 0-29 | Gray | Low score |

## Data Flow

```
NIH RePORTER (F30 grants)
    ↓
Pipeline enrichment (ORCID, PubMed, ClinicalTrials.gov, CMS)
    ↓
Scoring algorithm
    ↓
candidates_output.json
    ↓
Upload to Supabase
    ↓
Next.js UI (Rising Stars tab)
```

## Updating Data

To refresh the data with new candidates:

1. Run the pipeline again: `node pipeline/index.js`
2. Upload new results: `node pipeline/upload-to-supabase.js candidates_output.json`
3. Refresh the browser to see updated data

## Customization

### Adjust Score Weights

Edit `pipeline/index.js`:

```javascript
weights: {
  researchOutput: 0.40,        // Adjust weights here
  clinicalExposure: 0.35,
  institutionalReadiness: 0.25,
}
```

### Change Filter Thresholds

Edit `app/rising-stars/page.tsx`:

```typescript
if (filter === "high-score" && star.compositeScore < 70) return false;
// Change 70 to your desired threshold
```

### Modify Card Layout

Edit `components/rising-star-card.tsx` to customize the card design and displayed information.

## Troubleshooting

### No candidates showing up
- Check that the pipeline ran successfully
- Verify data was uploaded to Supabase
- Check browser console for errors
- Verify Supabase credentials are correct

### Slow loading
- Add more indexes to the Supabase table
- Reduce the number of candidates returned
- Enable caching in the fetch function

### Filters not working
- Clear browser cache
- Check that data types match between frontend and database
- Verify the filter logic in `page.tsx`

## Future Enhancements

Potential improvements:
- Export to CSV functionality
- Candidate comparison tool
- Email notifications for high-score candidates
- Integration with CRM systems
- Advanced analytics dashboard
- Real-time pipeline status monitoring

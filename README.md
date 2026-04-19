# Atlas

Finding the right clinical trial investigators usually takes about six weeks. Atlas does it in fifteen seconds.

## Where this came from

We got talking to Dr. Henry at the sponsor booths — he used to be a medical director at Google. We asked him what he'd pay to delete from his job. He said picking principal investigators for new trials.

The way he described it: someone digs through ClinicalTrials.gov, someone else searches PubMed, someone else pulls NPI and FDA records. Then you sit with a dozen spreadsheets trying to figure out if the "Amelia Park" in one is the same person as "Park A" in another. Old FDA warning letters slip through until you've already flown to the site. And whole regions like São Paulo or Cape Town just don't show up, because searches default to US sites.

He said clinical ops teams just want to describe the trial in plain English and get a ranked list. So that's what we built.

## What it does

You type something like `NSCLC principal investigator in Korea` or `gene therapy Phase 1 PI for rare retinal disease in Europe`. About fifteen seconds later, you get a ranked list. Each person has a fit score, a one-line reason, and evidence chips like `pubmed:38100001` or `nct:NCT05001234`. Click one and you see the paper. If the agent can't cite the source, it doesn't rank the person.

Click into a candidate for the full profile — trials, publications, credentials, FDA filings, industry payments, and the audit trail showing how we decided those records belonged to the same human.

## How it works

Twelve public registries, all linked back to one `investigators` table. The move that made everything work was treating identity resolution as *data* — we precomputed the cross-registry links and stored them with confidence scores, instead of trying to fuzzy-match strings at query time.

Three Mastra agents on top: one parses the query, one searches, one scores. The search agent has two tools — list candidates, then pull a full profile for each by fanning out across every source table at once.

## What broke

Spent an hour on `result.object` being `undefined`. Turns out Mastra's default `maxSteps` is 5, and our agent uses a step per candidate, so we'd run out before it could write a response. Also, if an agent uses tools *and* wants structured output, you have to pass a separate `structuredOutput.model` — otherwise the tool loop eats the final response. Bumping to 20 steps and adding the structuring model fixed it.

We also started with twelve tools (one per table), which made the agent indecisive. Collapsing to one tool that fans out internally was better.

## What we'd do next

Semantic search over abstracts with pgvector. Sponsor-aware ranking. PDF export. More registries. A feedback loop so the rating agent learns from shortlist picks.

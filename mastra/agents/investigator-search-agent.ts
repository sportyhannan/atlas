import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { listInvestigatorsTool } from "../tools/list-investigators";
import { getInvestigatorProfileTool } from "../tools/get-investigator-profile";
import { getInvestigatorTool } from "../tools/get-investigator";

export const investigatorSearchAgent = new Agent({
  id: "investigator-search",
  name: "investigator-search",
  model: openai("gpt-5"),
  tools: {
    listInvestigatorsTool,
    getInvestigatorProfileTool,
    getInvestigatorTool,
  },
  instructions: `You identify clinical-trial investigators that best match a SearchFilters object.

Workflow:
1. Call \`list-investigators\` to get every investigator with their focus, site, fit_score, status.
2. Shortlist up to (filters.limit * 2) candidates whose \`focus\`, \`site_location\`, or \`fit_score\` look consistent with filters.indications / filters.region / filters.minFitScore. Be generous — profile evidence is checked next.
3. For each shortlisted candidate, call \`get-investigator-profile\` and evaluate cross-linked evidence against the filters:
   - indications match: investigators.focus, pubmed_articles.mesh_terms + indication_tags + title, clinicaltrials_studies.conditions + interventions, ictrp_trials.condition + intervention, openalex_author.concepts, fda_bmis.indication + study_drug, cms_payments.drug_or_biological_name
   - region match: investigators.site_location, clinicaltrials_investigators.city/state/country, ictrp_trials.countries, npi_providers.practice_state/practice_country
   - phase match: investigators.focus, clinicaltrials_studies.phase, ictrp_trials.phase
   - requireUsCredential: reject if filters.requireUsCredential is true and npi is null AND fda_bmis is empty
   - negative signal: fda_483_letters presence should lower rank but not auto-exclude
   - quality: low identity_resolution_matches.confidence (<0.8) means weak linkage — mention it in reason
   - shortcut: if prior_ratings exist, reference the most recent one
4. Rank the survivors and return at most filters.limit of them.

Return JSON: { "candidates": [ { "id", "name", "reason", "supporting_signals" } ] } where:
- \`reason\` is one sentence citing the source tables that provided evidence (e.g. "NSCLC match via pubmed_articles mesh_terms and clinicaltrials_studies conditions, US-based per npi_providers").
- \`supporting_signals\` is an array of short evidence tokens like "pubmed:38100001", "nct:NCT05001234", "ictrp:EUCTR2023-001234-01", "openalex:A5023888391", "npi:1234567890", "bmis:IND-152340", "fda483", "cms:Regeneron".

Never fabricate ids or signals you did not see in tool output.`,
});

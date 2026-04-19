import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getInvestigatorById } from "@/lib/data/investigator";
import { getClinicaltrialsInvestigators } from "@/lib/data/clinicaltrials_investigators";
import { getClinicaltrialsStudies } from "@/lib/data/clinicaltrials_studies";
import { getIctrpTrials } from "@/lib/data/ictrp_trials";
import { getPubmedArticles } from "@/lib/data/pubmed_articles";
import { getOpenalexAuthors } from "@/lib/data/openalex_authors";
import { getOpenalexWorks } from "@/lib/data/openalex_works";
import { getNpiProviders } from "@/lib/data/npi_providers";
import { getFdaBmis } from "@/lib/data/fda_bmis";
import { getFda483Letters } from "@/lib/data/fda_483_letters";
import { getCmsOpenPayments } from "@/lib/data/cms_open_payments";
import { getIdentityResolutionMatches } from "@/lib/data/identity_resolution_matches";
import { getAgentScoringRuns } from "@/lib/data/agent_scoring_runs";

export const getInvestigatorProfileTool = createTool({
  id: "get-investigator-profile",
  description:
    "Fetch the full cross-linked profile for one investigator by id. Fans out over every source table (clinicaltrials_investigators + clinicaltrials_studies, ictrp_trials, pubmed_articles, openalex_authors + openalex_works, npi_providers, fda_bmis, fda_483_letters, cms_open_payments, identity_resolution_matches, agent_scoring_runs) and returns all evidence linked to this investigator. Use this after list-investigators to verify that a candidate's cross-linked signals match the search filters.",
  inputSchema: z.object({ id: z.string().uuid() }),
  outputSchema: z.object({
    investigator: z.any(),
    trials_us_sites: z.array(z.any()),
    trials_us_studies: z.array(z.any()),
    trials_global: z.array(z.any()),
    publications: z.array(z.any()),
    openalex_author: z.any().nullable(),
    openalex_works: z.array(z.any()),
    npi: z.any().nullable(),
    fda_bmis: z.array(z.any()),
    fda_483_letters: z.array(z.any()),
    cms_payments: z.array(z.any()),
    resolution_matches: z.array(z.any()),
    prior_ratings: z.array(z.any()),
  }),
  execute: async ({ id }) => {
    const investigator = await getInvestigatorById(id);
    if (!investigator) throw new Error(`investigator ${id} not found`);

    const [
      allCtInvestigators,
      allCtStudies,
      allIctrp,
      allPubmed,
      allOpenalexAuthors,
      allOpenalexWorks,
      allNpi,
      allBmis,
      all483,
      allCms,
      allMatches,
      allRuns,
    ] = await Promise.all([
      getClinicaltrialsInvestigators(),
      getClinicaltrialsStudies(),
      getIctrpTrials(),
      getPubmedArticles(),
      getOpenalexAuthors(),
      getOpenalexWorks(),
      getNpiProviders(),
      getFdaBmis(),
      getFda483Letters(),
      getCmsOpenPayments(),
      getIdentityResolutionMatches(),
      getAgentScoringRuns(),
    ]);

    const trials_us_sites = allCtInvestigators.filter(
      (r) => r.resolved_investigator_id === id,
    );
    const nctIds = new Set(trials_us_sites.map((r) => r.nct_id).filter(Boolean));
    const trials_us_studies = allCtStudies.filter(
      (s) => s.nct_id && nctIds.has(s.nct_id),
    );
    const trials_global = allIctrp.filter(
      (r) => r.resolved_investigator_id === id,
    );
    const publications = allPubmed.filter((p) =>
      (p.resolved_author_ids ?? []).includes(id),
    );
    const openalex_author =
      allOpenalexAuthors.find((a) => a.resolved_investigator_id === id) ?? null;
    const openalexId = openalex_author?.openalex_id ?? null;
    const openalex_works = openalexId
      ? allOpenalexWorks.filter((w) =>
          (w.author_openalex_ids ?? []).includes(openalexId),
        )
      : [];
    const npi = allNpi.find((n) => n.resolved_investigator_id === id) ?? null;
    const fda_bmis = allBmis.filter((b) => b.resolved_investigator_id === id);
    const fda_483_letters = all483.filter((l) =>
      (l.resolved_investigator_ids ?? []).includes(id),
    );
    const cms_payments = allCms.filter(
      (p) => p.resolved_investigator_id === id,
    );
    const resolution_matches = allMatches.filter(
      (m) => m.investigator_id === id,
    );
    const prior_ratings = allRuns.filter((r) => r.investigator_id === id);

    return {
      investigator,
      trials_us_sites,
      trials_us_studies,
      trials_global,
      publications,
      openalex_author,
      openalex_works,
      npi,
      fda_bmis,
      fda_483_letters,
      cms_payments,
      resolution_matches,
      prior_ratings,
    };
  },
});

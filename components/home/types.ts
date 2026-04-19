import type { Investigator } from "@/types/investigator";
import type { clinicaltrials_investigators } from "@/types/clinicaltrials_investigators";
import type { clinicaltrials_studies } from "@/types/clinicaltrials_studies";
import type { ictrp_trials } from "@/types/ictrp_trials";
import type { pubmed_articles } from "@/types/pubmed_articles";
import type { fda_483_letters } from "@/types/fda_483_letters";
import type { fda_bmis } from "@/types/fda_bmis";
import type { cms_open_payments } from "@/types/cms_open_payments";
import type { npi_providers } from "@/types/npi_providers";
import type { openalex_authors } from "@/types/openalex_authors";
import type { identity_resolution_matches } from "@/types/identity_resolution_matches";
import type { agent_scoring_runs } from "@/types/agent_scoring_runs";

export type HomeData = {
  investigators: Investigator[];
  ctInvestigators: clinicaltrials_investigators[];
  ctStudies: clinicaltrials_studies[];
  ictrpTrials: ictrp_trials[];
  pubmed: pubmed_articles[];
  fda483: fda_483_letters[];
  fdaBmis: fda_bmis[];
  payments: cms_open_payments[];
  npi: npi_providers[];
  openalex: openalex_authors[];
  identity: identity_resolution_matches[];
  ratings: agent_scoring_runs[];
};

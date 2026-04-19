import { fetchInvestigators } from "@/actions/investigators";
import { fetchClinicaltrialsInvestigators } from "@/actions/clinicaltrials_investigators";
import { fetchClinicaltrialsStudies } from "@/actions/clinicaltrials_studies";
import { fetchIctrpTrials } from "@/actions/ictrp_trials";
import { fetchPubmedArticles } from "@/actions/pubmed_articles";
import { fetchFda483Letters } from "@/actions/fda_483_letters";
import { fetchFdaBmis } from "@/actions/fda_bmis";
import { fetchCmsOpenPayments } from "@/actions/cms_open_payments";
import { fetchNpiProviders } from "@/actions/npi_providers";
import { fetchOpenalexAuthors } from "@/actions/openalex_authors";
import { fetchIdentityResolutionMatches } from "@/actions/identity_resolution_matches";
import { fetchAgentScoringRuns } from "@/actions/agent_scoring_runs";
import { HomePage } from "@/components/home/home-page";

export default async function Home() {
  const [
    investigators,
    ctInvestigators,
    ctStudies,
    ictrpTrials,
    pubmed,
    fda483,
    fdaBmis,
    payments,
    npi,
    openalex,
    identity,
    ratings,
  ] = await Promise.all([
    fetchInvestigators(),
    fetchClinicaltrialsInvestigators(),
    fetchClinicaltrialsStudies(),
    fetchIctrpTrials(),
    fetchPubmedArticles(),
    fetchFda483Letters(),
    fetchFdaBmis(),
    fetchCmsOpenPayments(),
    fetchNpiProviders(),
    fetchOpenalexAuthors(),
    fetchIdentityResolutionMatches(),
    fetchAgentScoringRuns(),
  ]);

  return (
    <HomePage
      data={{
        investigators,
        ctInvestigators,
        ctStudies,
        ictrpTrials,
        pubmed,
        fda483,
        fdaBmis,
        payments,
        npi,
        openalex,
        identity,
        ratings,
      }}
    />
  );
}

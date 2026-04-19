export type RisingStar = {
  name: string;
  institution: string;
  state: string | null;
  orcidUrl: string | null;
  grantId: string;
  fiscalYear: number;
  researchTopics: string[];
  compositeScore: number;
  breakdown: {
    researchOutput: number;
    clinicalExposure: number;
    institutionalReadiness: number;
  };
  signals: {
    totalPublications: number | null;
    pubsLast3Years: number | null;
    activeTrialsAtSite: number | null;
    phase2PlusTrials: number | null;
    investigatorTrialCount: number | null;
  };
  dataCompleteness: number;
  needsReview: boolean;
};

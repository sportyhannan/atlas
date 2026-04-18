export type InvestigatorStatus = 'Responsive' | 'Pending' | 'Overbooked' | 'Flagged';

// Legacy alias used by older DB queries
export type Status = 'responsive' | 'pending' | 'overbooked';

export type Publication = {
  pubmedId: string;
  title: string;
  year: number;
  journal: string;
  citationCount: number;
};

export type TrialHistory = {
  nctId: string;
  title: string;
  phase: string;
  status: string;
  drug?: string;
  role: 'PI' | 'Sub-I';
  year: number;
};

export type ScoreBreakdown = {
  indicationMatch: number;
  phaseExperience: number;
  enrollmentVelocity: number;
  publicationVelocity: number;
  capacity: number;
  institutionalTrack: number;
  responsiveness: number;
  regulatoryRigor: number;
};

export type Institution = {
  name: string;
  city: string;
  country: string;
  type: string;
  trackRecordScore: number;
  activeTrialCount: number;
  hasMinus80Freezer?: boolean;
  ehrSystem?: string;
};

export type YearDataPoint = {
  year: number;
  enrollments: number;
  trials: number;
};

export type Investigator = {
  id: string;
  name: string;
  credentials: string;
  initials: string;
  npi?: string;
  orcid?: string;
  site: string;
  institution: Institution;
  city: string;
  country: string;
  lat: number;
  lng: number;
  indicationTags: string[];
  phaseExperience: string[];
  enrollments: number;
  trials: number;
  activeTrials: number;
  fit: number;
  scoreBreakdown: ScoreBreakdown;
  status: InvestigatorStatus;
  velocity: number;
  isRisingStar: boolean;
  rareDiseaseExpert: boolean;
  publications: Publication[];
  recentTrials: TrialHistory[];
  has483Flag: boolean;
  trajectoryYears: YearDataPoint[];
  velocityHistory: number[];
  email?: string;
};

export type ReasoningStep = {
  id: string;
  agent: string;
  action: string;
  detail?: string;
};

export type SearchResult = {
  investigators: Investigator[];
  totalFound: number;
  risingStarCount: number;
  registriesQueried: number;
  queryMs: number;
};

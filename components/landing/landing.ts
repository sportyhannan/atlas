export type MapPin = {
  name: string;
  city: string;
  x: number;
  y: number;
  fit: number;
  rising?: boolean;
};

export const MAP_PINS: MapPin[] = [
  { name: "Dr. Chuka Okonkwo", city: "Lagos", x: 52, y: 55, fit: 92, rising: true },
  { name: "Dr. Magda Kowalski", city: "Warsaw", x: 53, y: 32, fit: 89, rising: true },
  { name: "Dr. Isabela Ferreira", city: "São Paulo", x: 33, y: 64, fit: 87, rising: true },
  { name: "Dr. Wei Chen", city: "Shanghai", x: 77, y: 42, fit: 91 },
  { name: "Dr. Ravi Menon", city: "Bengaluru", x: 68, y: 52, fit: 85 },
  { name: "Dr. Sarah Whitman", city: "Boston", x: 25, y: 35, fit: 88 },
  { name: "Dr. Anna Müller", city: "Berlin", x: 50, y: 30, fit: 86 },
  { name: "Dr. James Park", city: "Seoul", x: 80, y: 38, fit: 90 },
  { name: "Dr. Laila Haddad", city: "Cairo", x: 55, y: 46, fit: 83 },
  { name: "Dr. Elena Rossi", city: "Milan", x: 50, y: 36, fit: 84 },
  { name: "Dr. Tom Becker", city: "Toronto", x: 24, y: 30, fit: 82 },
  { name: "Dr. Marco Silva", city: "Lisbon", x: 45, y: 38, fit: 81 },
];

export const EXAMPLE_QUERIES = [
  "Phase 3 R/R DLBCL, 22 sites global, rising stars only",
  "NSCLC East Asia, EGFR-mutant, 15+ enrollments/yr",
  "Hemophilia A/B underrepresented regions, gene therapy exp.",
  "HER2+ metastatic breast cancer, mAb experience, no 483 flags",
];

export const PIPELINE_STEPS = [
  { label: "Query", sub: "natural language brief" },
  { label: "Planner", sub: "Mastra · gpt-4o-mini" },
  { label: "Search", sub: "Mastra · gpt-4o-mini" },
  { label: "Profile fan-out", sub: "12 public registries" },
  { label: "Rating", sub: "Mastra · gpt-4o-mini" },
  { label: "Dossier", sub: "evidence-cited shortlist" },
];

export const SCORE_FACTORS = [
  { label: "Indication match", value: 96 },
  { label: "Phase experience", value: 88 },
  { label: "Enrollment velocity", value: 85 },
  { label: "Publication velocity", value: 94 },
  { label: "Capacity signal", value: 91 },
  { label: "Institutional track", value: 84 },
  { label: "Responsiveness", value: 95 },
  { label: "Regulatory rigor", value: 100 },
];

export const DATA_SOURCES = [
  { name: "ClinicalTrials.gov", desc: "480K+ trials, protocol history" },
  { name: "PubMed E-utilities", desc: "Publication velocity & impact" },
  { name: "OpenAlex", desc: "Citation graph, co-authors" },
  { name: "NPI / NPPES", desc: "Provider identity resolution" },
  { name: "FDA BMIS + 483", desc: "Regulatory track record" },
  { name: "WHO ICTRP", desc: "Global trial registry coverage" },
];

export type ReasoningStep = { agent: string; message: string; tone: "info" | "ok" | "warn" };

export const DEMO_TRACE: ReasoningStep[] = [
  { agent: "Planner", message: "Parsed: Phase 3 R/R DLBCL, rising-star investigators only", tone: "info" },
  { agent: "Search", message: "list-investigators → 612 hub rows, shortlisted 24 by focus + fit_score", tone: "info" },
  { agent: "Search", message: "get-investigator-profile → joined CT.gov, ICTRP, PubMed, OpenAlex, NPI, FDA BMIS, 483, CMS", tone: "info" },
  { agent: "Search", message: "Ranked 12 survivors by indication match + publication velocity, penalised 483 flags", tone: "warn" },
  { agent: "Rating", message: "Top match: Dr. Chuka Okonkwo — fit 92, velocity +68% YoY", tone: "ok" },
];

export const DEMO_RESULT = {
  name: "Dr. Chuka Okonkwo",
  site: "Lagos University Teaching Hospital",
  city: "Lagos, Nigeria",
  fit: 92,
  badges: ["Rising star", "Phase 3 veteran", "No 483 flags"],
  velocity: "+68% YoY",
};

export const RISING_STARS = [
  { name: "Dr. Chuka Okonkwo", site: "Lagos UTH", focus: "DLBCL, CAR-T", fit: 92, delta: "+68%" },
  { name: "Dr. Magda Kowalski", site: "Warsaw Med.", focus: "EGFR-NSCLC", fit: 89, delta: "+52%" },
  { name: "Dr. Isabela Ferreira", site: "USP São Paulo", focus: "HER2+ mBC", fit: 87, delta: "+47%" },
];

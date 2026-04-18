export type Status = "responsive" | "pending" | "overbooked";

export type Investigator = {
  id: string;
  name: string;
  site_name: string;
  site_location: string | null;
  focus: string[];
  enrollments: number;
  velocity_per_year: number;
  status: Status;
  fit_score: number;
  score_trajectory: number | null;
  score_comparison: number | null;
  score_institutional: number | null;
  score_capacity: number | null;
};

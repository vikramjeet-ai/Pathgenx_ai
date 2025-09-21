export interface RoadmapStep {
  year: number;
  title: string;
  description: string;
  skills: string[];
}

export interface ResourceItem {
  name: string;
  url: string;
}

export interface Resources {
  books: ResourceItem[];
  courses: ResourceItem[];
  tools: ResourceItem[];
  other: ResourceItem[];
}

export interface Summary {
  keyTakeaways: string[];
  bestForStability: string;
  bestForGrowth: string;
  finalVerdict: string;
}

export interface CareerPath {
  id: string; // Stable client-side identifier
  title: string;
  description: string;
  isLoadingDetails?: boolean; // Flag for progressive loading
  error?: string; // To store per-path errors
  incomeProjection?: {
    year1: string;
    year3: string;
    year5: string;
  };
  skillsToDevelop?: string[];
  stressLevel?: number; // A score from 1 to 10
  longTermUpside?: string;
  recommendation?: string;
  roadmap?: RoadmapStep[];
  pros?: string[];
  cons?: string[];
  resources?: Resources;
  industryTrends?: string;
  // Optional, flexible fields for refinement
  dayInTheLife?: string;
  workLifeBalance?: string;
  certifications?: string[];
  networking?: string[];
}

export interface CareerAnalysis {
  paths: CareerPath[];
  summary: Summary | null;
  summaryError?: string;
}

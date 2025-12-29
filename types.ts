
export interface RegionalData {
  region: string;
  boxOffice: number; // in Millions USD
  popularityScore: number; // 0-100
  availability: string[];
}

export interface ContinentalData {
  continent: string;
  marketShare: number; // percentage
  status: string; // e.g., "Trending", "Declining", "Stable"
  topCountry: string;
}

export interface MovieAnalysis {
  title: string;
  summary: string;
  globalHighlights: string[];
  regionalBreakdown: RegionalData[];
  continentalBreakdown: ContinentalData[];
  sources: { uri: string; title: string }[];
}

export interface AppState {
  isSearching: boolean;
  movieData: MovieAnalysis | null;
  error: string | null;
}

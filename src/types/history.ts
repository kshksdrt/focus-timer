export interface HistoryEntry {
  ts: Date;
  name: string;
  duration: number;
}

export type Filter = "day" | "month" | "year";
export interface CountQueryResult {
  name: string;
  count: number;
}

export interface DurationQueryResult {
  name: string;
  duration: number;
}

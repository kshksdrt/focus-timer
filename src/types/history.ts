export interface HistoryEntry {
  ts: Date;
  name: string;
  duration: number;
}

export interface HistoryV2Entry {
  ts: Date;
  timerId: string;
  duration: number;
}

export interface HistoryEntryIndeterminate {
  ts: Date;
  timerId?: string;
  name?: string;
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

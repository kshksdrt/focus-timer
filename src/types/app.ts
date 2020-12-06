import { HistoryEntry } from './history';
import { Timer } from './timer';

export type AppView = "home" | "manage" | "stats" | "settings"

export interface Settings {
  lastUsedTimer: string;
  [key:string]: any;
}

export interface BatchImport {
  history: HistoryEntry[];
  timers: Timer[];
  settings: Settings;
  version: string;
}
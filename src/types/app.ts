import { HistoryV2Entry } from './history';
import { Timer } from './timer';

export type AppView = "home" | "manage" | "stats" | "settings"

export interface Settings {
  lastUsedTimer: string;
  [key:string]: any;
}

export interface BatchImport {
  history?: HistoryV2Entry[];
  timers?: Timer[];
  settings?: Settings;
  version?: string;
}
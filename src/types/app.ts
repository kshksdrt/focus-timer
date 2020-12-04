export type AppView = "home" | "manage" | "stats" | "settings"

export interface Settings {
  lastUsedTimer: string;
  [key:string]: any;
}
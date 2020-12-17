import { Filter } from './history';

export type View = "week" | "month" | "year";

export interface Dataset {
  x: number[];
  y: number[];
}

export interface Stats {
  timerId: string;
  dataset: {
    x: number[];
    y: number[];
  }
}

export interface FilterOptions {
  range: Filter,
  date: Date,
  timerId?: string,
}
export type View = "week" | "month" | "year";

export interface Dataset {
  x: number[] | string[];
  y: number[];
}
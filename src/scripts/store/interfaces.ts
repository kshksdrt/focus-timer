export interface Timer {
  id: string;
  name: string;
  desc: string;
  spec: Spec[];
}

export interface Spec {
  name: string;
  icon: string;
  duration: number;
}

export interface TimerBarSegment {
  name: string;
  duration: number;
  isCurrent: boolean;
  css: Css;
}

interface Css {
  width: string;
  [key: string]: any;
}

export type CountdownState = "playing" | "paused" | "waiting" | "stopped"
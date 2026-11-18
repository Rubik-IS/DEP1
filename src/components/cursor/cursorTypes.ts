export type CursorState =
  | 'default'
  | 'interactive'
  | 'cta'
  | 'nexus-3d'
  | 'text'
  | 'disabled';

export interface CursorTelemetry {
  clientX: number;
  clientY: number;
  coreX: number;
  coreY: number;
  innerX: number;
  innerY: number;
  outerX: number;
  outerY: number;
  vx: number;
  vy: number;
  speed: number;
  state: CursorState;
  isPressed: boolean;
  isDragging3D: boolean;
  isVisible: boolean;
  isCubieHovered: boolean;
}

export interface CursorDOMRefs {
  root: HTMLDivElement | null;
  core: HTMLDivElement | null;
  innerRing: HTMLDivElement | null;
  outerRing: HTMLDivElement | null;
  ripple: HTMLDivElement | null;
  trails: (HTMLDivElement | null)[];
}

export interface CursorControllerConfig {
  coreLerp?: number;
  innerLerp?: number;
  outerLerp?: number;
  trailLerps?: [number, number, number];
  maxTiltDeg?: number;
}

import { prefersReducedMotion } from '../../lib/animation';
import {
  CursorControllerConfig,
  CursorDOMRefs,
  CursorState,
  CursorTelemetry,
} from './cursorTypes';

const DISABLED_SELECTOR =
  ':disabled, [aria-disabled="true"], [data-cursor="disabled"]';
const TEXT_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"], [data-cursor="text"]';
const CTA_SELECTOR = '[data-cursor="cta"]';
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-interactive], [data-cursor="interactive"]';
const NEXUS_3D_SELECTOR = 'canvas, [data-cursor="nexus-3d"]';

/**
 * Evaluates the target DOM element against the 7-state Rubik Nexus priority hierarchy.
 */
export function detectCursorState(target: EventTarget | null): CursorState {
  if (!target || !(target instanceof Element)) {
    return 'default';
  }

  if (target.closest(DISABLED_SELECTOR)) {
    return 'disabled';
  }

  if (target.closest(TEXT_SELECTOR)) {
    return 'text';
  }

  if (target.closest(CTA_SELECTOR)) {
    return 'cta';
  }

  if (target.closest(INTERACTIVE_SELECTOR)) {
    return 'interactive';
  }

  if (target.closest(NEXUS_3D_SELECTOR)) {
    return 'nexus-3d';
  }

  return 'default';
}

/**
 * Determines whether the current environment supports the desktop Nexus Cursor.
 */
export function canUseNexusCursor(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (prefersReducedMotion()) {
    return false;
  }
  const hasFinePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine) and (hover: hover)').matches;

  return hasFinePointer;
}

export class NexusCursorController {
  private refs: CursorDOMRefs;
  private config: Required<CursorControllerConfig>;
  private telemetry: CursorTelemetry;
  private trailPositions: Array<{ x: number; y: number }>;
  private rafId: number | null = null;
  private isDestroyed = false;

  constructor(refs: CursorDOMRefs, config?: CursorControllerConfig) {
    this.refs = refs;
    this.config = {
      coreLerp: config?.coreLerp ?? 0.42,
      innerLerp: config?.innerLerp ?? 0.24,
      outerLerp: config?.outerLerp ?? 0.15,
      trailLerps: config?.trailLerps ?? [0.22, 0.14, 0.09],
      maxTiltDeg: config?.maxTiltDeg ?? 18,
    };

    const startX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const startY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    this.telemetry = {
      clientX: startX,
      clientY: startY,
      coreX: startX,
      coreY: startY,
      innerX: startX,
      innerY: startY,
      outerX: startX,
      outerY: startY,
      vx: 0,
      vy: 0,
      speed: 0,
      state: 'default',
      isPressed: false,
      isDragging3D: false,
      isVisible: false,
      isCubieHovered: false,
    };

    this.trailPositions = [
      { x: startX, y: startY },
      { x: startX, y: startY },
      { x: startX, y: startY },
    ];
  }

  public mount(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.add('nexus-cursor-active');
    this.syncRootAttributes();

    window.addEventListener('pointermove', this.handlePointerMove, {
      passive: true,
    });
    window.addEventListener('mousedown', this.handleMouseDown, {
      passive: true,
    });
    window.addEventListener('mouseup', this.handleMouseUp, {
      passive: true,
    });
    window.addEventListener('scroll', this.handleScroll, {
      passive: true,
    });
    document.addEventListener('mouseleave', this.handleMouseLeaveWindow);
    window.addEventListener('blur', this.handleMouseLeaveWindow);
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.documentElement.classList.remove('nexus-cursor-active');
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('mousedown', this.handleMouseDown);
      window.removeEventListener('mouseup', this.handleMouseUp);
      window.removeEventListener('scroll', this.handleScroll);
      document.removeEventListener('mouseleave', this.handleMouseLeaveWindow);
      window.removeEventListener('blur', this.handleMouseLeaveWindow);
    }
  }

  private wakeLoop(): void {
    if (this.isDestroyed || this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private syncRootAttributes(): void {
    const root = this.refs.root;
    if (!root) return;

    root.dataset.state = this.telemetry.state;
    root.dataset.pressed = String(this.telemetry.isPressed);
    root.dataset.dragging3d = String(this.telemetry.isDragging3D);
    root.dataset.cubieHover = String(this.telemetry.isCubieHovered);
    root.dataset.visible = String(this.telemetry.isVisible);
  }

  private handlePointerMove = (e: PointerEvent): void => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
      return;
    }

    const firstReveal = !this.telemetry.isVisible;
    this.telemetry.clientX = e.clientX;
    this.telemetry.clientY = e.clientY;

    if (firstReveal) {
      this.telemetry.isVisible = true;
      this.telemetry.coreX = e.clientX;
      this.telemetry.coreY = e.clientY;
      this.telemetry.innerX = e.clientX;
      this.telemetry.innerY = e.clientY;
      this.telemetry.outerX = e.clientX;
      this.telemetry.outerY = e.clientY;
      for (const node of this.trailPositions) {
        node.x = e.clientX;
        node.y = e.clientY;
      }
    }

    const nextState = detectCursorState(e.target);
    const cubieHovered =
      document.documentElement.dataset.nexusCubieHover === 'true';

    if (
      nextState !== this.telemetry.state ||
      cubieHovered !== this.telemetry.isCubieHovered ||
      firstReveal
    ) {
      this.telemetry.state = nextState;
      this.telemetry.isCubieHovered = cubieHovered;
      this.syncRootAttributes();
    }

    this.wakeLoop();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    this.telemetry.isPressed = true;
    const currentState = detectCursorState(e.target);
    this.telemetry.state = currentState;
    if (currentState === 'nexus-3d') {
      this.telemetry.isDragging3D = true;
    }
    this.syncRootAttributes();
    this.triggerClickRipple(e.clientX, e.clientY);
    this.wakeLoop();
  };

  private handleMouseUp = (): void => {
    this.telemetry.isPressed = false;
    this.telemetry.isDragging3D = false;
    this.syncRootAttributes();
    this.wakeLoop();
  };

  private handleScroll = (): void => {
    if (!this.telemetry.isVisible || typeof document === 'undefined') return;
    const hoveredEl = document.elementFromPoint(
      this.telemetry.clientX,
      this.telemetry.clientY
    );
    const nextState = detectCursorState(hoveredEl);
    const cubieHovered =
      document.documentElement.dataset.nexusCubieHover === 'true';

    if (
      nextState !== this.telemetry.state ||
      cubieHovered !== this.telemetry.isCubieHovered
    ) {
      this.telemetry.state = nextState;
      this.telemetry.isCubieHovered = cubieHovered;
      this.syncRootAttributes();
    }
    this.wakeLoop();
  };

  private handleMouseLeaveWindow = (): void => {
    this.telemetry.isVisible = false;
    this.telemetry.isPressed = false;
    this.telemetry.isDragging3D = false;
    this.syncRootAttributes();
  };

  private triggerClickRipple(x: number, y: number): void {
    const ripple = this.refs.ripple;
    if (!ripple) return;
    ripple.style.left = `${x.toFixed(1)}px`;
    ripple.style.top = `${y.toFixed(1)}px`;
    ripple.classList.remove('nexus-ripple-active');
    // Force reflow to restart CSS keyframe cleanly
    void ripple.offsetWidth;
    ripple.classList.add('nexus-ripple-active');
  }

  private tick = (): void => {
    this.rafId = null;
    if (this.isDestroyed) return;

    const { coreLerp, innerLerp, outerLerp, trailLerps, maxTiltDeg } =
      this.config;
    const t = this.telemetry;

    const prevOuterX = t.outerX;
    const prevOuterY = t.outerY;

    t.coreX += (t.clientX - t.coreX) * coreLerp;
    t.coreY += (t.clientY - t.coreY) * coreLerp;

    t.innerX += (t.clientX - t.innerX) * innerLerp;
    t.innerY += (t.clientY - t.innerY) * innerLerp;

    t.outerX += (t.clientX - t.outerX) * outerLerp;
    t.outerY += (t.clientY - t.outerY) * outerLerp;

    t.vx = t.outerX - prevOuterX;
    t.vy = t.outerY - prevOuterY;
    t.speed = Math.hypot(t.vx, t.vy);

    // Check cubie hover state from 3D canvas dataset
    const cubieHovered =
      typeof document !== 'undefined' &&
      document.documentElement.dataset.nexusCubieHover === 'true';
    if (cubieHovered !== t.isCubieHovered) {
      t.isCubieHovered = cubieHovered;
      this.syncRootAttributes();
    }

    // Apply transforms to Central Crystalline Core
    if (this.refs.core) {
      this.refs.core.style.transform = `translate3d(${t.coreX.toFixed(
        2
      )}px, ${t.coreY.toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;
    }

    // Apply transforms to Inner Ring
    if (this.refs.innerRing) {
      this.refs.innerRing.style.transform = `translate3d(${t.innerX.toFixed(
        2
      )}px, ${t.innerY.toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;
    }

    // Apply transforms + velocity-driven 3D perspective tilt to Outer Orbital Ring
    if (this.refs.outerRing) {
      const tiltX = Math.max(
        -maxTiltDeg,
        Math.min(maxTiltDeg, -t.vy * 1.35)
      );
      const tiltY = Math.max(
        -maxTiltDeg,
        Math.min(maxTiltDeg, t.vx * 1.35)
      );
      this.refs.outerRing.style.transform = `translate3d(${t.outerX.toFixed(
        2
      )}px, ${t.outerY.toFixed(
        2
      )}px, 0) translate3d(-50%, -50%, 0) perspective(420px) rotateX(${tiltX.toFixed(
        1
      )}deg) rotateY(${tiltY.toFixed(1)}deg)`;
    }

    // Update 3 Crystalline Motion Trail Micro-Shards
    const hideTrail =
      !t.isVisible || t.state === 'text' || t.state === 'disabled';
    const normalizedSpeed = Math.min(1, t.speed / 14);

    for (let i = 0; i < 3; i++) {
      const pos = this.trailPositions[i];
      const lerpFactor = trailLerps[i];
      const targetX = i === 0 ? t.innerX : this.trailPositions[i - 1].x;
      const targetY = i === 0 ? t.innerY : this.trailPositions[i - 1].y;

      pos.x += (targetX - pos.x) * lerpFactor;
      pos.y += (targetY - pos.y) * lerpFactor;

      const trailEl = this.refs.trails[i];
      if (trailEl) {
        const trailOpacity = hideTrail
          ? 0
          : normalizedSpeed * (0.48 - i * 0.13);
        const trailScale = 1 - i * 0.22;
        trailEl.style.transform = `translate3d(${pos.x.toFixed(
          2
        )}px, ${pos.y.toFixed(
          2
        )}px, 0) translate3d(-50%, -50%, 0) rotate(45deg) scale(${trailScale.toFixed(
          2
        )})`;
        trailEl.style.opacity =
          trailOpacity > 0.015 ? trailOpacity.toFixed(3) : '0';
      }
    }

    // Determine if motion has settled so we can pause the RAF loop at zero CPU cost
    const remainingDist =
      Math.hypot(t.clientX - t.outerX, t.clientY - t.outerY) +
      Math.hypot(
        t.clientX - this.trailPositions[2].x,
        t.clientY - this.trailPositions[2].y
      );

    if (remainingDist > 0.18 || t.speed > 0.08) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };
}

export type LoadingMilestoneId =
  | 'app_boot'
  | 'dom_ready'
  | 'fonts_ready'
  | 'hero_ready'
  | 'webgl_3d_ready';

export type LoadingStatus = 'loading' | 'ready' | 'timeout' | 'error';

export interface LoadingProgressSnapshot {
  progress: number;
  status: LoadingStatus;
  message: string;
  overlayVisible: boolean;
  completedMilestones: LoadingMilestoneId[];
  errorMessage: string | null;
}

const MILESTONE_WEIGHTS: Record<LoadingMilestoneId, number> = {
  app_boot: 20,
  dom_ready: 20,
  fonts_ready: 15,
  hero_ready: 15,
  webgl_3d_ready: 30,
};

export function resolveLoadingMessage(
  progress: number,
  status: LoadingStatus
): string {
  if (status === 'error') return 'Unable to complete initialization';
  if (status === 'timeout') return 'Taking longer than expected';
  if (progress >= 100 || status === 'ready') return 'Experience Ready';
  if (progress >= 95) return 'Almost Ready';
  if (progress >= 70) return 'Initializing 3D Rubik Nexus';
  if (progress >= 35) return 'Loading Visual Elements';
  return 'Initializing Experience';
}

/**
 * Monotonic, milestone-driven progress tracker.
 * Guarantees each milestone is counted once, progress never decreases,
 * and 100% is reached only when all required milestones complete.
 */
export class LoadingProgressTracker {
  private completed = new Set<LoadingMilestoneId>();
  private progress = 0;
  private status: LoadingStatus = 'loading';
  private errorMessage: string | null = null;

  public completeMilestone(id: LoadingMilestoneId): LoadingProgressSnapshot {
    if (this.status === 'error' || this.completed.has(id)) {
      return this.getSnapshot(false);
    }

    this.completed.add(id);

    let total = 0;
    for (const milestone of this.completed) {
      total += MILESTONE_WEIGHTS[milestone];
    }

    this.progress = Math.max(this.progress, Math.min(100, total));

    if (this.progress >= 100) {
      this.progress = 100;
      this.status = 'ready';
    }

    return this.getSnapshot(false);
  }

  public markTimeout(): LoadingProgressSnapshot {
    if (this.status === 'ready' || this.status === 'error') {
      return this.getSnapshot(false);
    }
    this.status = 'timeout';
    this.errorMessage =
      'Some visual resources are taking longer than expected to load.';
    return this.getSnapshot(false);
  }

  public markError(message: string): LoadingProgressSnapshot {
    this.status = 'error';
    this.errorMessage = message;
    return this.getSnapshot(false);
  }

  public reset(): LoadingProgressSnapshot {
    this.completed.clear();
    this.progress = 0;
    this.status = 'loading';
    this.errorMessage = null;
    return this.getSnapshot(false);
  }

  public getSnapshot(overlayVisible: boolean): LoadingProgressSnapshot {
    return {
      progress: this.progress,
      status: this.status,
      message: resolveLoadingMessage(this.progress, this.status),
      overlayVisible,
      completedMilestones: Array.from(this.completed),
      errorMessage: this.errorMessage,
    };
  }
}

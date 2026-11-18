import { describe, it, expect } from 'vitest';
import { LoadingProgressTracker } from '../../src/lib/loadingProgress';

describe('LoadingProgressTracker (Real Milestones, Monotonicity & Recovery)', () => {
  it('advances monotonically across unique milestones and reaches 100% only when all complete', () => {
    const tracker = new LoadingProgressTracker();
    expect(tracker.getSnapshot(false).progress).toBe(0);

    const s1 = tracker.completeMilestone('app_boot');
    expect(s1.progress).toBe(20);
    expect(s1.status).toBe('loading');

    const s1Dup = tracker.completeMilestone('app_boot');
    expect(s1Dup.progress).toBe(20);

    const s2 = tracker.completeMilestone('dom_ready');
    const s3 = tracker.completeMilestone('fonts_ready');
    const s4 = tracker.completeMilestone('hero_ready');
    expect(s2.progress).toBe(40);
    expect(s3.progress).toBe(55);
    expect(s4.progress).toBe(70);
    expect(s4.status).toBe('loading');

    const s5 = tracker.completeMilestone('webgl_3d_ready');
    expect(s5.progress).toBe(100);
    expect(s5.status).toBe('ready');
    expect(s5.message).toBe('Experience Ready');
  });

  it('does not fake 100% on timeout or error and supports reset', () => {
    const tracker = new LoadingProgressTracker();
    tracker.completeMilestone('app_boot');
    tracker.completeMilestone('hero_ready');

    const timedOut = tracker.markTimeout();
    expect(timedOut.status).toBe('timeout');
    expect(timedOut.progress).toBe(35);
    expect(timedOut.errorMessage).toBeTruthy();

    const errored = tracker.markError('Critical failure');
    expect(errored.status).toBe('error');
    expect(errored.progress).toBe(35);

    const reset = tracker.reset();
    expect(reset.progress).toBe(0);
    expect(reset.status).toBe('loading');
    expect(reset.completedMilestones).toEqual([]);
  });
});

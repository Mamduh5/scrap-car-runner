import { describe, it, expect } from 'vitest';
import { computePixelViewport, readWindowViewport, VIEWPORT_LIMITS } from './pixelViewport';

const { SAFE_WIDTH, SAFE_HEIGHT, MAX_WIDTH, MAX_HEIGHT } = VIEWPORT_LIMITS;

describe('computePixelViewport', () => {
  it.each([
    // [label, cssW, cssH, dpr, scale, width, height]
    ['360x640 @2 (reference phone)',        360,  640, 2,     4, 180, 320],
    ['390x844 @3 (tall iPhone)',            390,  844, 3,     6, 195, 422],
    ['412x915 @2.625 (fractional DPR)',     412,  915, 2.625, 6, 180, 400],
    ['360x584 @2 (browser UI bars)',        360,  584, 2,     4, 180, 292],
    ['375x667 @2 (small iPhone)',           375,  667, 2,     4, 187, 333],
    ['768x1024 @2 (tablet portrait)',       768, 1024, 2,     7, 216, 292],
    ['1920x960 @1 (desktop window)',       1920,  960, 1,     3, 216, 320],
  ] as const)('%s', (_label, cssW, cssH, dpr, scale, width, height) => {
    const v = computePixelViewport({ innerWidth: cssW, innerHeight: cssH, devicePixelRatio: dpr });
    expect(v.pixelScale).toBe(scale);
    expect(v.width).toBe(width);
    expect(v.height).toBe(height);
    expect(v.cssZoom).toBeCloseTo(scale / dpr, 10);
  });

  it('fills a 390x844 @3 phone exactly with no letterboxing', () => {
    const v = computePixelViewport({ innerWidth: 390, innerHeight: 844, devicePixelRatio: 3 });
    expect(v.width * v.cssZoom).toBeCloseTo(390, 6);
    expect(v.height * v.cssZoom).toBeCloseTo(844, 6);
  });

  it('keeps invariants across a sweep of realistic viewports', () => {
    for (const dpr of [1, 1.5, 2, 2.625, 2.75, 3, 3.5]) {
      for (let w = 320; w <= 1100; w += 23) {
        for (let h = 480; h <= 1200; h += 37) {
          const v = computePixelViewport({ innerWidth: w, innerHeight: h, devicePixelRatio: dpr });
          expect(Number.isInteger(v.pixelScale)).toBe(true);
          expect(v.pixelScale).toBeGreaterThanOrEqual(1);
          expect(v.width).toBeGreaterThanOrEqual(SAFE_WIDTH);
          expect(v.width).toBeLessThanOrEqual(MAX_WIDTH);
          expect(v.height).toBeGreaterThanOrEqual(SAFE_HEIGHT);
          expect(v.height).toBeLessThanOrEqual(MAX_HEIGHT);
          // Canvas never exceeds the window once the safe rect fits at all.
          if (w * dpr >= SAFE_WIDTH && h * dpr >= SAFE_HEIGHT) {
            expect(v.width * v.cssZoom).toBeLessThanOrEqual(w + 1e-6);
            expect(v.height * v.cssZoom).toBeLessThanOrEqual(h + 1e-6);
          }
          // Device pixels per art pixel is exactly the integer scale.
          expect(v.cssZoom * dpr).toBeCloseTo(v.pixelScale, 9);
        }
      }
    }
  });

  it.each([NaN, Infinity, -5, 0])('falls back safely for invalid input %s', bad => {
    const v = computePixelViewport({ innerWidth: bad, innerHeight: bad, devicePixelRatio: bad });
    expect(v.pixelScale).toBe(1);
    expect(v.width).toBe(SAFE_WIDTH);
    expect(v.height).toBe(SAFE_HEIGHT);
  });

  it('reads a safe default outside the browser', () => {
    expect(readWindowViewport(undefined)).toEqual({ innerWidth: SAFE_WIDTH, innerHeight: SAFE_HEIGHT, devicePixelRatio: 1 });
  });
});

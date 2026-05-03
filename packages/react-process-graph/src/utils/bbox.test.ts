import { describe, it, expect } from 'vitest';
import { unionRects, fitTransform, rectsIntersect, pointsBbox, inflateRect, EMPTY_RECT } from './bbox';

describe('unionRects', () => {
  it('returns EMPTY_RECT for empty input', () => {
    expect(unionRects([])).toEqual(EMPTY_RECT);
  });

  it('returns the rect itself for a single rect', () => {
    const r = { x: 10, y: 20, width: 50, height: 30 };
    expect(unionRects([r])).toEqual(r);
  });

  it('unions two non-overlapping rects', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 20, y: 20, width: 10, height: 10 };
    expect(unionRects([a, b])).toEqual({ x: 0, y: 0, width: 30, height: 30 });
  });

  it('unions two overlapping rects', () => {
    const a = { x: 0, y: 0, width: 20, height: 20 };
    const b = { x: 10, y: 10, width: 20, height: 20 };
    expect(unionRects([a, b])).toEqual({ x: 0, y: 0, width: 30, height: 30 });
  });

  it('handles negative coordinates', () => {
    const a = { x: -10, y: -10, width: 5, height: 5 };
    const b = { x: 5, y: 5, width: 5, height: 5 };
    expect(unionRects([a, b])).toEqual({ x: -10, y: -10, width: 20, height: 20 });
  });
});

describe('fitTransform', () => {
  it('returns identity for zero-size bbox', () => {
    const t = fitTransform({ x: 0, y: 0, width: 0, height: 0 }, { width: 800, height: 600 });
    expect(t).toEqual({ translateX: 0, translateY: 0, scale: 1 });
  });

  it('scales down a large bbox to fit in the viewport', () => {
    const { scale } = fitTransform(
      { x: 0, y: 0, width: 2000, height: 1000 },
      { width: 800, height: 600 },
      0,
    );
    expect(scale).toBeLessThan(1);
    expect(scale).toBeCloseTo(Math.min(800 / 2000, 600 / 1000), 5);
  });

  it('does not scale up a small bbox beyond 1', () => {
    const { scale } = fitTransform(
      { x: 0, y: 0, width: 50, height: 50 },
      { width: 800, height: 600 },
    );
    expect(scale).toBe(1);
  });

  it('centers the bbox in the viewport', () => {
    const { translateX, translateY } = fitTransform(
      { x: 0, y: 0, width: 100, height: 100 },
      { width: 200, height: 200 },
      0,
    );
    expect(translateX).toBeCloseTo(50);
    expect(translateY).toBeCloseTo(50);
  });
});

describe('rectsIntersect', () => {
  it('returns true for overlapping rects', () => {
    expect(rectsIntersect(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 5, y: 5, width: 10, height: 10 },
    )).toBe(true);
  });

  it('returns true for touching edges', () => {
    expect(rectsIntersect(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 10, y: 0, width: 10, height: 10 },
    )).toBe(true);
  });

  it('returns false for non-overlapping rects', () => {
    expect(rectsIntersect(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 20, y: 20, width: 10, height: 10 },
    )).toBe(false);
  });
});

describe('pointsBbox', () => {
  it('returns EMPTY_RECT for empty input', () => {
    expect(pointsBbox([])).toEqual(EMPTY_RECT);
  });

  it('computes bbox for a set of points', () => {
    const result = pointsBbox([
      { x: 1, y: 2 }, { x: 5, y: 0 }, { x: 3, y: 8 },
    ]);
    expect(result).toEqual({ x: 1, y: 0, width: 4, height: 8 });
  });
});

describe('inflateRect', () => {
  it('expands the rect on all sides', () => {
    const r = { x: 10, y: 10, width: 20, height: 20 };
    expect(inflateRect(r, 5)).toEqual({ x: 5, y: 5, width: 30, height: 30 });
  });

  it('can deflate with a negative amount', () => {
    const r = { x: 0, y: 0, width: 20, height: 20 };
    expect(inflateRect(r, -5)).toEqual({ x: 5, y: 5, width: 10, height: 10 });
  });
});

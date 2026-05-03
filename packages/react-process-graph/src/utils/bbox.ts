import type { Rect, Point } from '../types';

export const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

/** Union of all provided rectangles */
export function unionRects(rects: Rect[]): Rect {
  if (rects.length === 0) return EMPTY_RECT;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export interface FitTransform {
  translateX: number;
  translateY: number;
  scale: number;
}

/**
 * Computes the CSS transform (translate + scale) to fit a bbox
 * into a viewport with optional padding.
 */
export function fitTransform(
  bbox: Rect,
  viewport: { width: number; height: number },
  padding = 32,
): FitTransform {
  if (bbox.width === 0 || bbox.height === 0) {
    return { translateX: 0, translateY: 0, scale: 1 };
  }

  const availW = viewport.width - padding * 2;
  const availH = viewport.height - padding * 2;
  const scale = Math.min(availW / bbox.width, availH / bbox.height, 1);

  const scaledW = bbox.width * scale;
  const scaledH = bbox.height * scale;
  const translateX = padding + (availW - scaledW) / 2 - bbox.x * scale;
  const translateY = padding + (availH - scaledH) / 2 - bbox.y * scale;

  return { translateX, translateY, scale };
}

/** True if two rectangles overlap (including touching edges) */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}

/** Bounding box of a set of points */
export function pointsBbox(points: Point[]): Rect {
  if (points.length === 0) return EMPTY_RECT;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** Inflates a rect by `amount` pixels on each side */
export function inflateRect(rect: Rect, amount: number): Rect {
  return {
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
  };
}

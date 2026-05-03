import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVirtualization, worldViewport } from './useVirtualization';
import type { PositionedNode, PositionedEdge, Rect } from '../types';

function makeNode(id: string, x: number, y: number, w = 100, h = 50): PositionedNode {
  return { id, x, y, width: w, height: h };
}

function makeEdge(id: string, source: string, target: string, points: { x: number; y: number }[] = []): PositionedEdge {
  return { id, source, target, points, isCycleEdge: false };
}

const VIEWPORT: Rect = { x: 0, y: 0, width: 800, height: 600 };

describe('worldViewport', () => {
  it('returns full world view at scale=1, no offset', () => {
    const vp = worldViewport({ width: 800, height: 600 }, { x: 0, y: 0, scale: 1 });
    expect(vp.width).toBe(800);
    expect(vp.height).toBe(600);
    expect(vp.x).toBeCloseTo(0);
    expect(vp.y).toBeCloseTo(0);
  });

  it('accounts for pan offset', () => {
    const vp = worldViewport({ width: 800, height: 600 }, { x: -100, y: -50, scale: 1 });
    expect(vp.x).toBeCloseTo(100);
    expect(vp.y).toBeCloseTo(50);
  });

  it('accounts for zoom (scale=2 means smaller world view)', () => {
    const vp = worldViewport({ width: 800, height: 600 }, { x: 0, y: 0, scale: 2 });
    expect(vp.width).toBeCloseTo(400);
    expect(vp.height).toBeCloseTo(300);
  });
});

describe('useVirtualization', () => {
  it('returns all nodes when viewport is null', () => {
    const nodes = [makeNode('a', 0, 0), makeNode('b', 1000, 1000)];
    const { result } = renderHook(() => useVirtualization(nodes, [], null));
    expect(result.current.visibleNodes).toHaveLength(2);
  });

  it('returns all nodes when list is empty', () => {
    const { result } = renderHook(() => useVirtualization([], [], VIEWPORT));
    expect(result.current.visibleNodes).toHaveLength(0);
  });

  it('filters out nodes outside the inflated viewport', () => {
    // margin=0 so inflated === VIEWPORT (800×600)
    const nodes = [
      makeNode('inside', 100, 100),
      makeNode('outside', 2000, 2000),
    ];
    const { result } = renderHook(() => useVirtualization(nodes, [], VIEWPORT, 0));
    expect(result.current.visibleNodes.map((n) => n.id)).toEqual(['inside']);
  });

  it('keeps nodes intersecting the inflated viewport even when partially outside', () => {
    const nodes = [
      makeNode('partial', 750, 550), // right/bottom edge — overlaps viewport
      makeNode('fully-out', 1000, 1000),
    ];
    const { result } = renderHook(() => useVirtualization(nodes, [], VIEWPORT, 0));
    expect(result.current.visibleNodes.map((n) => n.id)).toContain('partial');
    expect(result.current.visibleNodes.map((n) => n.id)).not.toContain('fully-out');
  });

  it('margin inflates the viewport so nodes just outside are included', () => {
    // node at x=900 (100px outside 800-wide viewport) — margin=0.25 extends by 200px
    const nodes = [makeNode('near-miss', 850, 0)];
    const { result } = renderHook(() => useVirtualization(nodes, [], VIEWPORT, 0.25));
    expect(result.current.visibleNodes).toHaveLength(1);
  });

  it('includes edges with visible endpoints', () => {
    const nodes = [makeNode('a', 100, 100), makeNode('b', 200, 200)];
    const edges = [makeEdge('e1', 'a', 'b')];
    const { result } = renderHook(() => useVirtualization(nodes, edges, VIEWPORT, 0));
    expect(result.current.visibleEdges).toHaveLength(1);
  });

  it('excludes edges with no visible endpoints and bbox outside viewport', () => {
    const nodes = [makeNode('a', 100, 100)];
    const farPoints = [{ x: 2000, y: 2000 }, { x: 2100, y: 2000 }];
    const edges = [makeEdge('e1', 'z', 'w', farPoints)]; // endpoints not in nodes
    const { result } = renderHook(() => useVirtualization(nodes, edges, VIEWPORT, 0));
    expect(result.current.visibleEdges).toHaveLength(0);
  });

  it('filters 1000 nodes to those within viewport without performance regression', () => {
    const nodes: PositionedNode[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `n${i}`,
      x: (i % 50) * 200,
      y: Math.floor(i / 50) * 100,
      width: 100,
      height: 50,
    }));
    const viewport: Rect = { x: 0, y: 0, width: 800, height: 600 };
    const { result } = renderHook(() => useVirtualization(nodes, [], viewport, 0));
    // At x<800, y<600 with 100×50 nodes: ~4 cols × 6 rows = 24 nodes visible
    expect(result.current.visibleNodes.length).toBeLessThan(100);
    expect(result.current.visibleNodes.length).toBeGreaterThan(0);
  });
});

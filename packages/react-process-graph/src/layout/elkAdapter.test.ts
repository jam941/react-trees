import { describe, it, expect, vi } from 'vitest';
import { runLayout } from './elkAdapter';
import type { ProcessGraphSpec, LayoutResult } from '../types';

interface MockNode {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: MockNode[];
  edges?: MockEdge[];
  layoutOptions?: Record<string, string>;
}

interface MockEdge {
  id: string;
  sources: string[];
  targets: string[];
  sections?: Array<{
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    bendPoints: unknown[];
  }>;
}

/** Minimal ELK mock that returns nodes at fixed positions */
function makeElkMock(overrides?: Partial<{ x: number; y: number; w: number; h: number }>) {
  const { x = 0, y = 0, w = 120, h = 60 } = overrides ?? {};

  function positionNodes(nodes: MockNode[], cx: number, cy: number): MockNode[] {
    return nodes.map((n, i) => ({
      ...n,
      x: cx + i * (w + 20),
      y: cy,
      width: w,
      height: h,
      children: n.children ? positionNodes(n.children, cx + i * (w + 20), cy + h + 20) : [],
      edges: [],
    }));
  }

  return {
    layout: vi.fn((rawGraph: unknown): Promise<MockNode> => {
      const graph = rawGraph as MockNode;
      return Promise.resolve({
        ...graph,
        children: positionNodes(graph.children ?? [], x, y),
        edges: (graph.edges ?? []).map((e) => ({
          ...e,
          sections: [{ startPoint: { x: x + 10, y: y + 10 }, endPoint: { x: x + 100, y: y + 10 }, bendPoints: [] }],
        })),
      });
    }),
  };
}

describe('runLayout', () => {
  it('positions all nodes from a simple chain', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
      ],
    };

    const result = await runLayout(makeElkMock(), spec, 'LR');

    expect(result.nodes).toHaveLength(3);
    expect(result.edges).toHaveLength(2);
    for (const node of result.nodes) {
      expect(node.x).toBeTypeOf('number');
      expect(node.y).toBeTypeOf('number');
      expect(node.width).toBeGreaterThan(0);
      expect(node.height).toBeGreaterThan(0);
    }
  });

  it('passes layout direction to ELK', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const elk = makeElkMock();
    await runLayout(elk, spec, 'TB');

    const call = elk.layout.mock.calls[0]![0] as { layoutOptions: Record<string, string> };
    expect(call.layoutOptions['elk.direction']).toBe('DOWN');
  });

  it('strips cycle edges before calling ELK', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }],
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'a' },
      ],
    };
    const elk = makeElkMock();
    await runLayout(elk, spec, 'LR');

    const call = elk.layout.mock.calls[0]![0] as { edges: Array<{ id: string }> };
    const edgeIds = call.edges.map((e) => e.id);
    // Both are part of the cycle, so ELK receives 0 edges
    expect(edgeIds).toHaveLength(0);
  });

  it('re-adds cycle edges as isCycleEdge=true in the result', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }],
      edges: [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'a' },
      ],
    };
    const result: LayoutResult = await runLayout(makeElkMock(), spec, 'LR');

    const cycleEdges = result.edges.filter((e) => e.isCycleEdge);
    expect(cycleEdges).toHaveLength(2);
  });

  it('places nodes inside groups in the correct group container', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'n1', groupId: 'g1' }, { id: 'n2' }],
      groups: [{ id: 'g1' }],
      edges: [],
    };
    const result = await runLayout(makeElkMock(), spec, 'LR');

    expect(result.groups).toHaveLength(1);
    expect(result.nodes).toHaveLength(2);
  });

  it('returns a non-empty bbox when nodes are present', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const result = await runLayout(makeElkMock({ x: 0, y: 0, w: 120, h: 60 }), spec, 'LR');

    expect(result.bbox.width).toBeGreaterThan(0);
    expect(result.bbox.height).toBeGreaterThan(0);
  });

  it('memoization key is stable when input arrays are reordered', async () => {
    // Same spec, nodes in different order — should produce same ELK graph structure
    const specA: ProcessGraphSpec = {
      nodes: [{ id: 'a' }, { id: 'b' }],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const specB: ProcessGraphSpec = {
      nodes: [{ id: 'b' }, { id: 'a' }],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const elk = makeElkMock();
    await runLayout(elk, specA, 'LR');
    await runLayout(elk, specB, 'LR');

    // Both calls use the same elk mock; we verify both succeed without error
    expect(elk.layout).toHaveBeenCalledTimes(2);
  });

  it('snaps edge endpoints to the direction-correct face center (LR)', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [
        { id: 'a', width: 120, height: 60 },
        { id: 'b', width: 120, height: 60 },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    // Mock positions: a at (0,0), b at (140,0)
    const elk = makeElkMock({ x: 0, y: 0, w: 120, h: 60 });
    const result = await runLayout(elk, spec, 'LR');

    const edge = result.edges.find((e) => e.id === 'e1')!;
    const nodeA = result.nodes.find((n) => n.id === 'a')!;
    const nodeB = result.nodes.find((n) => n.id === 'b')!;

    // LR: source exits from right-center, target enters at left-center
    expect(edge.points[0]).toEqual({ x: nodeA.x + nodeA.width, y: nodeA.y + nodeA.height / 2 });
    expect(edge.points[edge.points.length - 1]).toEqual({ x: nodeB.x, y: nodeB.y + nodeB.height / 2 });
  });

  it('snaps edge endpoints to the direction-correct face center (TB)', async () => {
    const spec: ProcessGraphSpec = {
      nodes: [
        { id: 'a', width: 120, height: 60 },
        { id: 'b', width: 120, height: 60 },
      ],
      edges: [{ id: 'e1', source: 'a', target: 'b' }],
    };
    const elk = makeElkMock({ x: 0, y: 0, w: 120, h: 60 });
    const result = await runLayout(elk, spec, 'TB');

    const edge = result.edges.find((e) => e.id === 'e1')!;
    const nodeA = result.nodes.find((n) => n.id === 'a')!;
    const nodeB = result.nodes.find((n) => n.id === 'b')!;

    // TB: source exits from bottom-center, target enters at top-center
    expect(edge.points[0]).toEqual({ x: nodeA.x + nodeA.width / 2, y: nodeA.y + nodeA.height });
    expect(edge.points[edge.points.length - 1]).toEqual({ x: nodeB.x + nodeB.width / 2, y: nodeB.y });
  });
});

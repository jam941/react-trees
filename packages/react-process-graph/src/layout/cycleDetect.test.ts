import { describe, it, expect } from 'vitest';
import { detectCycleEdges } from './cycleDetect';
import type { ProcessGraphSpec } from '../types';

function spec(
  nodes: string[],
  edges: Array<[string, string]>,
  groups: string[] = [],
): ProcessGraphSpec {
  return {
    nodes: nodes.map((id) => ({ id })),
    groups: groups.map((id) => ({ id })),
    edges: edges.map(([s, t], i) => ({ id: `e${i}`, source: s, target: t })),
  };
}

describe('detectCycleEdges', () => {
  it('returns empty for an empty graph', () => {
    expect(detectCycleEdges(spec([], []))).toEqual([]);
  });

  it('returns empty for a single node', () => {
    expect(detectCycleEdges(spec(['a'], []))).toEqual([]);
  });

  it('returns empty for a simple chain a→b→c', () => {
    expect(detectCycleEdges(spec(['a', 'b', 'c'], [['a', 'b'], ['b', 'c']]))).toEqual([]);
  });

  it('returns empty for a branching DAG', () => {
    const s = spec(['a', 'b', 'c', 'd'], [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd']]);
    expect(detectCycleEdges(s)).toEqual([]);
  });

  it('detects a self-loop', () => {
    const result = detectCycleEdges(spec(['a'], [['a', 'a']]));
    expect(result).toHaveLength(1);
    expect(result[0]!.source).toBe('a');
    expect(result[0]!.target).toBe('a');
  });

  it('detects a 2-node cycle a→b→a', () => {
    const result = detectCycleEdges(spec(['a', 'b'], [['a', 'b'], ['b', 'a']]));
    expect(result).toHaveLength(2);
  });

  it('detects a multi-node cycle a→b→c→a', () => {
    const result = detectCycleEdges(
      spec(['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]),
    );
    expect(result).toHaveLength(3);
  });

  it('returns only cyclic edges when mixed with acyclic edges', () => {
    // a→b is acyclic; b→c→b is a cycle
    const result = detectCycleEdges(
      spec(['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'b']]),
    );
    const cyclicIds = result.map((e) => `${e.source}-${e.target}`).sort();
    expect(cyclicIds).toEqual(['b-c', 'c-b']);
  });

  it('detects multiple disjoint cycles', () => {
    // cycle 1: a↔b, cycle 2: c↔d
    const result = detectCycleEdges(
      spec(['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'a'], ['c', 'd'], ['d', 'c']]),
    );
    expect(result).toHaveLength(4);
  });

  it('works when group ids are used as edge endpoints', () => {
    const s: ProcessGraphSpec = {
      nodes: [{ id: 'n1' }],
      groups: [{ id: 'g1' }],
      edges: [
        { id: 'e0', source: 'g1', target: 'n1' },
        { id: 'e1', source: 'n1', target: 'g1' },
      ],
    };
    const result = detectCycleEdges(s);
    expect(result).toHaveLength(2);
  });
});

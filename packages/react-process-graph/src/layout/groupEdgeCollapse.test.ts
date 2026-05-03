import { describe, it, expect } from 'vitest';
import { classifyEdges } from './groupEdgeCollapse';
import type { ProcessGraphSpec } from '../types';

describe('classifyEdges', () => {
  const baseSpec: ProcessGraphSpec = {
    nodes: [{ id: 'n1' }, { id: 'n2' }],
    groups: [{ id: 'g1' }, { id: 'g2' }],
    edges: [],
  };

  it('node→node edge is not a group edge', () => {
    const s = { ...baseSpec, edges: [{ id: 'e1', source: 'n1', target: 'n2' }] };
    const [r] = classifyEdges(s);
    expect(r!.sourceIsGroup).toBe(false);
    expect(r!.targetIsGroup).toBe(false);
  });

  it('node→group edge', () => {
    const s = { ...baseSpec, edges: [{ id: 'e1', source: 'n1', target: 'g1' }] };
    const [r] = classifyEdges(s);
    expect(r!.sourceIsGroup).toBe(false);
    expect(r!.targetIsGroup).toBe(true);
  });

  it('group→node edge', () => {
    const s = { ...baseSpec, edges: [{ id: 'e1', source: 'g1', target: 'n1' }] };
    const [r] = classifyEdges(s);
    expect(r!.sourceIsGroup).toBe(true);
    expect(r!.targetIsGroup).toBe(false);
  });

  it('group→group edge', () => {
    const s = { ...baseSpec, edges: [{ id: 'e1', source: 'g1', target: 'g2' }] };
    const [r] = classifyEdges(s);
    expect(r!.sourceIsGroup).toBe(true);
    expect(r!.targetIsGroup).toBe(true);
  });

  it('deduplicates edges with identical source+target', () => {
    const s = {
      ...baseSpec,
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n1', target: 'n2' },
      ],
    };
    expect(classifyEdges(s)).toHaveLength(1);
    expect(classifyEdges(s)[0]!.edge.id).toBe('e1');
  });

  it('uses sourceKind/targetKind override when provided', () => {
    // n1 id could be a node; with sourceKind='group' it's treated as group
    const s = {
      ...baseSpec,
      edges: [{ id: 'e1', source: 'n1', target: 'n2', sourceKind: 'group' as const }],
    };
    const [r] = classifyEdges(s);
    expect(r!.sourceIsGroup).toBe(true);
    expect(r!.targetIsGroup).toBe(false);
  });

  it('passes through all edges when none are duplicated', () => {
    const s = {
      ...baseSpec,
      edges: [
        { id: 'e1', source: 'n1', target: 'g1' },
        { id: 'e2', source: 'g2', target: 'n2' },
        { id: 'e3', source: 'g1', target: 'g2' },
      ],
    };
    expect(classifyEdges(s)).toHaveLength(3);
  });
});

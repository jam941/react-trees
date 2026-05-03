import type { ProcessEdge, ProcessGraphSpec } from '../types';

export interface ClassifiedEdge {
  edge: ProcessEdge;
  sourceIsGroup: boolean;
  targetIsGroup: boolean;
}

/**
 * Classifies each edge as node→node, node→group, group→node, or group→group.
 * Deduplicates edges with identical source+target (keeps the first occurrence).
 * Group semantics (all-in-A → all-in-B) are preserved as-is for rendering;
 * we never expand to N×M individual edges.
 */
export function classifyEdges(spec: ProcessGraphSpec): ClassifiedEdge[] {
  const groupIds = new Set<string>((spec.groups ?? []).map((g) => g.id));
  const nodeIds = new Set<string>(spec.nodes.map((n) => n.id));

  const seen = new Set<string>();
  const result: ClassifiedEdge[] = [];

  for (const edge of spec.edges) {
    const key = `${edge.source}→${edge.target}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const sourceIsGroup = edge.sourceKind
      ? edge.sourceKind === 'group'
      : groupIds.has(edge.source) && !nodeIds.has(edge.source);

    const targetIsGroup = edge.targetKind
      ? edge.targetKind === 'group'
      : groupIds.has(edge.target) && !nodeIds.has(edge.target);

    result.push({ edge, sourceIsGroup, targetIsGroup });
  }

  return result;
}

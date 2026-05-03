import type { ProcessEdge, ProcessGraphSpec } from '../types';

/**
 * Detects edges that form cycles using Kahn's algorithm (topological sort).
 * Returns the subset of edges that must be removed to make the graph a DAG.
 * Operates on the flat node/edge lists; groups are treated as opaque ids.
 */
export function detectCycleEdges(spec: ProcessGraphSpec): ProcessEdge[] {
  const nodeIds = new Set<string>([
    ...spec.nodes.map((n) => n.id),
    ...(spec.groups ?? []).map((g) => g.id),
  ]);

  // Build adjacency and in-degree maps
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adj.set(id, []);
  }

  // Only consider edges between known ids
  const validEdges = spec.edges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
  );

  for (const edge of validEdges) {
    adj.get(edge.source)!.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  // Kahn's BFS
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const visited = new Set<string>();
  while (queue.length > 0) {
    const node = queue.shift()!;
    visited.add(node);
    for (const neighbor of adj.get(node) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  // Cycle nodes are those that were never processed (non-zero in-degree remains)
  const cycleNodes = new Set<string>(
    [...nodeIds].filter((id) => !visited.has(id)),
  );

  // An edge is a cycle edge only when BOTH endpoints are in the cycle.
  // Edges that merely feed into a cycle (acyclic source → cycle node) are not cycle edges.
  return validEdges.filter(
    (e) => cycleNodes.has(e.source) && cycleNodes.has(e.target),
  );
}

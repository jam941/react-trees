import { useMemo } from 'react';
import type { PositionedNode, PositionedEdge, Rect } from '../types';
import { rectsIntersect, inflateRect, pointsBbox } from '../utils/bbox';
import type { Transform } from './usePanZoom';

/** Returns the visible world-space rect given container size and pan/zoom transform */
export function worldViewport(containerSize: { width: number; height: number }, transform: Transform): Rect {
  const { x, y, scale } = transform;
  return {
    x: -x / scale,
    y: -y / scale,
    width: containerSize.width / scale,
    height: containerSize.height / scale,
  };
}

export interface VirtualizationResult<TNode> {
  visibleNodes: PositionedNode<TNode>[];
  visibleEdges: PositionedEdge[];
}

/**
 * Filters nodes and edges to those intersecting the inflated viewport.
 * Groups are always rendered (handled outside this hook).
 */
export function useVirtualization<TNode>(
  nodes: PositionedNode<TNode>[],
  edges: PositionedEdge[],
  viewport: Rect | null,
  margin = 0.25,
): VirtualizationResult<TNode> {
  return useMemo(() => {
    if (!viewport || nodes.length === 0) {
      return { visibleNodes: nodes, visibleEdges: edges };
    }

    const inflateAmount = Math.max(viewport.width, viewport.height) * margin;
    const inflated = inflateRect(viewport, inflateAmount);

    const visibleNodes = nodes.filter((n) =>
      rectsIntersect({ x: n.x, y: n.y, width: n.width, height: n.height }, inflated),
    );

    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

    const visibleEdges = edges.filter((e) => {
      // Edge is visible if either endpoint is visible or its bbox intersects viewport
      if (visibleNodeIds.has(e.source) || visibleNodeIds.has(e.target)) return true;
      if (e.points.length > 0) {
        const bbox = pointsBbox(e.points);
        return rectsIntersect(bbox, inflated);
      }
      return false;
    });

    return { visibleNodes, visibleEdges };
  }, [nodes, edges, viewport, margin]);
}

type ElkInstance = { layout: (graph: unknown) => Promise<unknown> };
import type {
  ProcessGraphSpec,
  LayoutResult,
  PositionedNode,
  PositionedGroup,
  PositionedEdge,
  Direction,
  Point,
} from '../types';
import { directionToElkOptions } from './direction';
import { detectCycleEdges } from './cycleDetect';
import { classifyEdges } from './groupEdgeCollapse';
import { unionRects } from '../utils/bbox';

// elkjs types we need
interface ElkNode {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  layoutOptions?: Record<string, string>;
  children?: ElkNode[];
  edges?: ElkEdge[];
}

interface ElkEdge {
  id: string;
  sources: string[];
  targets: string[];
  sections?: Array<{
    startPoint: Point;
    endPoint: Point;
    bendPoints?: Point[];
  }>;
}

interface ElkGraph extends ElkNode {
  children: ElkNode[];
  edges: ElkEdge[];
}

const DEFAULT_NODE_SIZE = { width: 120, height: 60 };

function buildElkGraph(
  spec: ProcessGraphSpec,
  cycleEdgeIds: Set<string>,
  direction: Direction,
): ElkGraph {
  const layoutOptions = directionToElkOptions(direction);

  // Map groupId → child ElkNodes (nodes and nested groups)
  const groupChildren = new Map<string, ElkNode[]>();
  // Top-level children (no parent group)
  const topLevelChildren: ElkNode[] = [];

  // Register groups as containers
  const groupMap = new Map<string, ElkNode>();
  for (const group of spec.groups ?? []) {
    const elkGroup: ElkNode = {
      id: group.id,
      children: [],
      edges: [],
      layoutOptions: { 'elk.padding': '[left=16, top=32, right=16, bottom=16]' },
    };
    groupMap.set(group.id, elkGroup);
    groupChildren.set(group.id, elkGroup.children!);
  }

  // Place groups into their parent group or top-level
  for (const group of spec.groups ?? []) {
    const elkGroup = groupMap.get(group.id)!;
    if (group.parentGroupId && groupChildren.has(group.parentGroupId)) {
      groupChildren.get(group.parentGroupId)!.push(elkGroup);
    } else {
      topLevelChildren.push(elkGroup);
    }
  }

  // Place nodes into their group or top-level
  for (const node of spec.nodes) {
    const elkNode: ElkNode = {
      id: node.id,
      width: node.width ?? DEFAULT_NODE_SIZE.width,
      height: node.height ?? DEFAULT_NODE_SIZE.height,
    };

    if (node.groupId && groupChildren.has(node.groupId)) {
      groupChildren.get(node.groupId)!.push(elkNode);
    } else {
      topLevelChildren.push(elkNode);
    }
  }

  // Classify and build edges (skip cycle edges)
  const classified = classifyEdges(spec).filter((c) => !cycleEdgeIds.has(c.edge.id));
  const edges: ElkEdge[] = classified.map((c) => ({
    id: c.edge.id,
    sources: [c.edge.source],
    targets: [c.edge.target],
  }));

  const root: ElkGraph = {
    id: 'root',
    layoutOptions: layoutOptions as unknown as Record<string, string>,
    children: topLevelChildren,
    edges,
  };

  return root;
}

function extractResults(
  elkResult: ElkGraph,
  spec: ProcessGraphSpec,
  cycleEdgeIds: Set<string>,
): Omit<LayoutResult, 'bbox'> {
  const groupIds = new Set<string>((spec.groups ?? []).map((g) => g.id));

  // Flatten all positioned nodes and groups from the nested ELK result
  const positionedNodes: PositionedNode[] = [];
  const positionedGroups: PositionedGroup[] = [];

  function walk(nodes: ElkNode[], offsetX = 0, offsetY = 0) {
    for (const n of nodes) {
      const x = (n.x ?? 0) + offsetX;
      const y = (n.y ?? 0) + offsetY;
      const w = n.width ?? DEFAULT_NODE_SIZE.width;
      const h = n.height ?? DEFAULT_NODE_SIZE.height;

      if (groupIds.has(n.id)) {
        const group = spec.groups!.find((g) => g.id === n.id)!;
        positionedGroups.push({ ...group, x, y, width: w, height: h });
        if (n.children?.length) walk(n.children, x, y);
      } else {
        const node = spec.nodes.find((nd) => nd.id === n.id)!;
        positionedNodes.push({ ...node, x, y, width: w, height: h });
      }
    }
  }

  walk(elkResult.children ?? []);

  // Extract edge waypoints
  const positionedEdges: PositionedEdge[] = [];

  function collectEdges(graph: ElkNode, offsetX = 0, offsetY = 0) {
    for (const e of graph.edges ?? []) {
      const section = e.sections?.[0];
      const points: Point[] = [];

      if (section) {
        points.push({ x: section.startPoint.x + offsetX, y: section.startPoint.y + offsetY });
        for (const bp of section.bendPoints ?? []) {
          points.push({ x: bp.x + offsetX, y: bp.y + offsetY });
        }
        points.push({ x: section.endPoint.x + offsetX, y: section.endPoint.y + offsetY });
      }

      const originalEdge = spec.edges.find((ed) => ed.id === e.id);
      if (originalEdge) {
        positionedEdges.push({ ...originalEdge, points, isCycleEdge: false });
      }
    }

    for (const child of graph.children ?? []) {
      const childX = (child.x ?? 0) + offsetX;
      const childY = (child.y ?? 0) + offsetY;
      collectEdges(child, childX, childY);
    }
  }

  collectEdges(elkResult);

  // Re-add cycle edges with fallback straight routes
  for (const edge of spec.edges.filter((e) => cycleEdgeIds.has(e.id))) {
    const sourceNode = positionedNodes.find((n) => n.id === edge.source)
      ?? positionedGroups.find((g) => g.id === edge.source);
    const targetNode = positionedNodes.find((n) => n.id === edge.target)
      ?? positionedGroups.find((g) => g.id === edge.target);

    const points: Point[] =
      sourceNode && targetNode
        ? [
            { x: sourceNode.x + sourceNode.width / 2, y: sourceNode.y + sourceNode.height / 2 },
            { x: targetNode.x + targetNode.width / 2, y: targetNode.y + targetNode.height / 2 },
          ]
        : [];

    positionedEdges.push({ ...edge, points, isCycleEdge: true });
  }

  return { nodes: positionedNodes, groups: positionedGroups, edges: positionedEdges };
}

export async function runLayout(
  elk: ElkInstance,
  spec: ProcessGraphSpec,
  direction: Direction,
): Promise<LayoutResult> {
  const cycleEdges = detectCycleEdges(spec);
  const cycleEdgeIds = new Set(cycleEdges.map((e) => e.id));

  const elkGraph = buildElkGraph(spec, cycleEdgeIds, direction);
  const elkResult = (await elk.layout(elkGraph)) as ElkGraph;

  const { nodes, groups, edges } = extractResults(elkResult, spec, cycleEdgeIds);

  const allRects = [
    ...nodes.map((n) => ({ x: n.x, y: n.y, width: n.width, height: n.height })),
    ...groups.map((g) => ({ x: g.x, y: g.y, width: g.width, height: g.height })),
  ];
  const bbox = unionRects(allRects);

  return { nodes, groups, edges, bbox };
}

export { detectCycleEdges };

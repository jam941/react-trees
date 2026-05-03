export type NodeId = string;
export type GroupId = string;

export interface ProcessNode<TData = unknown> {
  id: NodeId;
  /** Node belongs to this group (optional) */
  groupId?: GroupId;
  /** Arbitrary payload forwarded to renderNode */
  data?: TData;
  /** Explicit width override — skips measurement pass when set */
  width?: number;
  /** Explicit height override — skips measurement pass when set */
  height?: number;
}

export interface ProcessGroup<TData = unknown> {
  id: GroupId;
  /** Parent group id for nested groups */
  parentGroupId?: GroupId;
  /** Arbitrary payload forwarded to renderGroup */
  data?: TData;
}

export interface ProcessEdge {
  id: string;
  /** ID of source node or group (both NodeId and GroupId are plain strings) */
  source: string;
  /** ID of target node or group (both NodeId and GroupId are plain strings) */
  target: string;
  /** Disambiguates when a node and group share the same id string */
  sourceKind?: 'node' | 'group';
  targetKind?: 'node' | 'group';
}

export interface ProcessGraphSpec<TNode = unknown, TGroup = unknown> {
  nodes: ProcessNode<TNode>[];
  groups?: ProcessGroup<TGroup>[];
  edges: ProcessEdge[];
}

// ── Layout result types (internal → rendered) ────────────────────────────────

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface PositionedNode<TData = unknown>
  extends Omit<ProcessNode<TData>, 'width' | 'height'>,
    Rect {}

export interface PositionedGroup<TData = unknown> extends ProcessGroup<TData>, Rect {}

export interface PositionedEdge extends ProcessEdge {
  /** Ordered waypoints: start → bends → end */
  points: Point[];
  /** True when this edge was part of a detected cycle */
  isCycleEdge: boolean;
}

export interface LayoutResult {
  nodes: PositionedNode[];
  groups: PositionedGroup[];
  edges: PositionedEdge[];
  /** Bounding box of the entire laid-out graph */
  bbox: Rect;
}

// ── Component prop types ─────────────────────────────────────────────────────

export type Direction = 'LR' | 'RL' | 'TB' | 'BT' | 'force';

export interface ProcessGraphProps<TNode = unknown, TGroup = unknown> {
  graph: ProcessGraphSpec<TNode, TGroup>;
  direction?: Direction;
  /** Required: render the content of each node */
  renderNode: (node: PositionedNode<TNode>) => React.ReactNode;
  /** Optional: render a group container; children are pre-rendered node/group contents */
  renderGroup?: (group: PositionedGroup<TGroup>, children: React.ReactNode) => React.ReactNode;
  /** Optional: render a custom edge path (receives SVG-space waypoints) */
  renderEdge?: (edge: PositionedEdge) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Initial zoom level (default 1) */
  defaultZoom?: number;
  /** Fit the entire graph into the viewport on first render */
  fitOnMount?: boolean;
  onLayoutComplete?: (result: LayoutResult) => void;
  onCycleDetected?: (cycleEdges: ProcessEdge[]) => void;
}

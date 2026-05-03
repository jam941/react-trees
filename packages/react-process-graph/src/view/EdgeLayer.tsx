import type { PositionedEdge, Rect, ProcessGraphProps } from '../types';

interface EdgeLayerProps {
  edges: PositionedEdge[];
  bbox: Rect;
  renderEdge?: ProcessGraphProps['renderEdge'];
}

function pointsToPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return [`M ${first!.x} ${first!.y}`, ...rest.map((p) => `L ${p.x} ${p.y}`)].join(' ');
}

function DefaultEdge({ edge }: { edge: PositionedEdge }) {
  const d = pointsToPath(edge.points);
  if (!d) return null;

  const lastPt = edge.points[edge.points.length - 1];
  const prevPt = edge.points[edge.points.length - 2] ?? edge.points[0];

  // Arrowhead direction
  let angle = 0;
  if (lastPt && prevPt) {
    angle = Math.atan2(lastPt.y - prevPt.y, lastPt.x - prevPt.x) * (180 / Math.PI);
  }

  const color = edge.isCycleEdge ? '#ef4444' : '#64748b';
  const strokeDash = edge.isCycleEdge ? '6 3' : undefined;

  return (
    <g data-rpg-edge={edge.id} data-cycle={edge.isCycleEdge || undefined} aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={strokeDash}
        markerEnd={`url(#arrow-${edge.isCycleEdge ? 'cycle' : 'normal'})`}
      />
      {lastPt && (
        <circle cx={lastPt.x} cy={lastPt.y} r={2} fill={color} opacity={0}
          transform={`rotate(${angle} ${lastPt.x} ${lastPt.y})`}
        />
      )}
    </g>
  );
}

export function EdgeLayer({ edges, bbox, renderEdge }: EdgeLayerProps) {
  if (edges.length === 0) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: bbox.width,
        height: bbox.height,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        <marker id="arrow-normal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
        </marker>
        <marker id="arrow-cycle" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
        </marker>
      </defs>
      {edges.map((edge) =>
        renderEdge ? (
          <g key={edge.id} aria-hidden="true">{renderEdge(edge)}</g>
        ) : (
          <DefaultEdge key={edge.id} edge={edge} />
        ),
      )}
    </svg>
  );
}

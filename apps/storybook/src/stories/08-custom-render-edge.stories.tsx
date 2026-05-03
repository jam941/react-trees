import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'input', width: 120, height: 52 },
    { id: 'transform', width: 120, height: 52 },
    { id: 'validate', width: 120, height: 52 },
    { id: 'output', width: 120, height: 52 },
  ],
  edges: [
    { id: 'e1', source: 'input', target: 'transform' },
    { id: 'e2', source: 'transform', target: 'validate' },
    { id: 'e3', source: 'validate', target: 'output' },
  ],
};

function AnimatedEdge({ points }: { points: { x: number; y: number }[] }) {
  if (points.length < 2) return null;
  const d = points.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '');
  return (
    <g>
      <path d={d} fill="none" stroke="#e2e8f0" strokeWidth={2} />
      <path
        d={d}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2.5}
        strokeDasharray="8 6"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-28"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

const meta: Meta = {
  title: 'Edges/08 Custom Edge Renderer',
  parameters: {
    docs: {
      description: {
        story: 'Custom renderEdge prop: animated dashed edges with a shadow underline. All waypoints are available in edge.points.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 600, height: 220 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#fff', border: '1px solid #bfdbfe',
            borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', color: '#1e40af',
            boxShadow: '0 1px 4px rgba(59,130,246,.15)',
          }}>
            {n.id}
          </div>
        )}
        renderEdge={(edge) => <AnimatedEdge points={edge.points} />}
      />
    </div>
  ),
};

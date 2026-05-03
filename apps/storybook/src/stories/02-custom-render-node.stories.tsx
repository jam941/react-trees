import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, PositionedNode } from 'react-process-graph';

type NodeData = { label: string; status: 'done' | 'running' | 'pending'; owner: string };

const graph: ProcessGraphSpec<NodeData> = {
  nodes: [
    { id: 'lint', width: 160, height: 72, data: { label: 'Lint', status: 'done', owner: 'CI' } },
    { id: 'test', width: 160, height: 72, data: { label: 'Unit Tests', status: 'running', owner: 'CI' } },
    { id: 'build', width: 160, height: 72, data: { label: 'Build', status: 'pending', owner: 'CI' } },
    { id: 'deploy', width: 160, height: 72, data: { label: 'Deploy', status: 'pending', owner: 'Ops' } },
  ],
  edges: [
    { id: 'e1', source: 'lint', target: 'build' },
    { id: 'e2', source: 'test', target: 'build' },
    { id: 'e3', source: 'build', target: 'deploy' },
  ],
};

const statusColors = { done: '#22c55e', running: '#f59e0b', pending: '#94a3b8' } as const;

function RichNode({ node }: { node: PositionedNode<NodeData> }) {
  const { label, status, owner } = node.data ?? { label: node.id, status: 'pending', owner: '—' };
  return (
    <div style={{
      width: '100%', height: '100%', padding: '8px 12px',
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,.08)', fontFamily: 'sans-serif',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status], flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
      </div>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{owner}</span>
    </div>
  );
}

const meta: Meta = {
  title: 'Basics/02 Custom Node Renderer',
  parameters: { docs: { description: { story: 'Nodes with rich React content — status badge and owner label.' } } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 700, height: 200 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => <RichNode node={n as PositionedNode<NodeData>} />}
      />
    </div>
  ),
};

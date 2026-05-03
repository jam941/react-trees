import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const ids = Array.from({ length: 12 }, (_, i) => `node${i + 1}`);
const graph: ProcessGraphSpec = {
  nodes: ids.map((id) => ({ id, width: 110, height: 50 })),
  edges: [
    { id: 'e1', source: 'node1', target: 'node2' },
    { id: 'e2', source: 'node1', target: 'node3' },
    { id: 'e3', source: 'node2', target: 'node4' },
    { id: 'e4', source: 'node2', target: 'node5' },
    { id: 'e5', source: 'node3', target: 'node6' },
    { id: 'e6', source: 'node4', target: 'node7' },
    { id: 'e7', source: 'node5', target: 'node7' },
    { id: 'e8', source: 'node5', target: 'node8' },
    { id: 'e9', source: 'node6', target: 'node8' },
    { id: 'e10', source: 'node7', target: 'node9' },
    { id: 'e11', source: 'node8', target: 'node9' },
    { id: 'e12', source: 'node9', target: 'node10' },
    { id: 'e13', source: 'node9', target: 'node11' },
    { id: 'e14', source: 'node10', target: 'node12' },
    { id: 'e15', source: 'node11', target: 'node12' },
  ],
};

function NodeChip({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0',
      borderRadius: 6, fontSize: 12, fontFamily: 'monospace',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Interaction/10 Pan and Zoom',
  parameters: {
    docs: {
      description: {
        story: 'Drag to pan, scroll to zoom toward cursor. Demonstrates the built-in pan/zoom behaviour on a mid-sized DAG.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 800, height: 500, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => <NodeChip label={n.id} />}
      />
    </div>
  ),
};

export const InitialZoom: StoryObj = {
  name: 'Initial zoom (0.75×)',
  render: () => (
    <div style={{ width: 800, height: 500, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ProcessGraph
        graph={graph}
        defaultZoom={0.75}
        fitOnMount={false}
        renderNode={(n) => <NodeChip label={n.id} />}
      />
    </div>
  ),
};

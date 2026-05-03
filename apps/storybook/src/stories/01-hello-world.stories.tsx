import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'start', width: 100, height: 48 },
    { id: 'process', width: 120, height: 48 },
    { id: 'end', width: 100, height: 48 },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'process' },
    { id: 'e2', source: 'process', target: 'end' },
  ],
};

function NodeBox({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1',
      borderRadius: 6, fontSize: 13, fontFamily: 'sans-serif',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Basics/01 Hello World',
  parameters: { docs: { description: { story: 'Minimal 3-node DAG with default styling.' } } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 600, height: 200 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => <NodeBox label={n.id} />}
      />
    </div>
  ),
};

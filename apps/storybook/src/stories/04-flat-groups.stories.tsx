import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'a', groupId: 'g1', width: 100, height: 48 },
    { id: 'b', groupId: 'g1', width: 100, height: 48 },
    { id: 'c', groupId: 'g2', width: 100, height: 48 },
    { id: 'd', groupId: 'g2', width: 100, height: 48 },
  ],
  groups: [
    { id: 'g1' },
    { id: 'g2' },
  ],
  edges: [
    { id: 'e1', source: 'g1', target: 'g2', sourceKind: 'group', targetKind: 'group' },
  ],
};

const meta: Meta = {
  title: 'Groups/04 Flat Groups',
  parameters: { docs: { description: { story: 'Two groups connected by a single group-to-group edge representing N×M dependency semantics.' } } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 700, height: 300 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 4, fontSize: 13, fontFamily: 'sans-serif',
          }}>
            {n.id}
          </div>
        )}
      />
    </div>
  ),
};

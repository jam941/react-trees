import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'n1', groupId: 'inner1', width: 90, height: 44 },
    { id: 'n2', groupId: 'inner1', width: 90, height: 44 },
    { id: 'n3', groupId: 'inner2', width: 90, height: 44 },
    { id: 'n4', groupId: 'outer', width: 90, height: 44 },
  ],
  groups: [
    { id: 'inner1', parentGroupId: 'outer' },
    { id: 'inner2', parentGroupId: 'outer' },
    { id: 'outer' },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n3' },
    { id: 'e2', source: 'n2', target: 'n4' },
    { id: 'e3', source: 'n3', target: 'n4' },
  ],
};

const meta: Meta = {
  title: 'Groups/05 Nested Groups',
  parameters: {
    docs: {
      description: {
        story: 'Group within a group: inner1 and inner2 are nested inside outer. ELK handles hierarchy natively.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 700, height: 380 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#f0f9ff', border: '1px solid #bae6fd',
            borderRadius: 4, fontSize: 13, fontFamily: 'monospace',
          }}>
            {n.id}
          </div>
        )}
      />
    </div>
  ),
};

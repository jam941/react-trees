import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'n1', width: 80, height: 48 },
    { id: 'n2', groupId: 'g1', width: 80, height: 48 },
    { id: 'n3', groupId: 'g2', width: 80, height: 48 },
    { id: 'n4', width: 80, height: 48 },
  ],
  groups: [{ id: 'g1' }, { id: 'g2' }],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2' },                                    // node → node
    { id: 'e2', source: 'n1', target: 'g1', targetKind: 'group' },                // node → group
    { id: 'e3', source: 'g1', target: 'g2', sourceKind: 'group', targetKind: 'group' }, // group → group
    { id: 'e4', source: 'g2', target: 'n4', sourceKind: 'group' },                // group → node
  ],
};

const meta: Meta = {
  title: 'Groups/06 Mixed Edge Types',
  parameters: { docs: { description: { story: 'All four edge combinations: node→node, node→group, group→group, group→node.' } } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 750, height: 320 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 4, fontSize: 13, fontFamily: 'sans-serif',
          }}>
            {n.id}
          </div>
        )}
      />
    </div>
  ),
};

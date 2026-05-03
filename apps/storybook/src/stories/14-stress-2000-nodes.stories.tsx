import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

function generateDag(nodeCount: number, edgesPerNode = 2): ProcessGraphSpec {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `n${i}`,
    width: 80,
    height: 36,
  }));

  const edges: ProcessGraphSpec['edges'] = [];
  let edgeId = 0;
  for (let i = 0; i < nodeCount - 1; i++) {
    const targetCount = Math.min(edgesPerNode, nodeCount - i - 1);
    for (let j = 1; j <= targetCount; j++) {
      edges.push({ id: `e${edgeId++}`, source: `n${i}`, target: `n${i + j}` });
    }
  }

  return { nodes, edges };
}

const graph2000 = generateDag(2000);

function MiniNode({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#fafafa', border: '1px solid #e5e7eb',
      borderRadius: 2, fontSize: 9, fontFamily: 'monospace', color: '#9ca3af',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Performance/14 Stress 2000 Nodes',
  parameters: {
    docs: {
      description: {
        story: '2000-node DAG demonstrating virtualization headroom. ELK layout may take a few seconds; only nodes near the viewport are mounted.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 1200, height: 600 }}>
      <ProcessGraph
        graph={graph2000}
        renderNode={(n) => <MiniNode label={n.id} />}
      />
    </div>
  ),
};

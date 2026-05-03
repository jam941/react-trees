import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

function generateDag(nodeCount: number, edgesPerNode = 2): ProcessGraphSpec {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `n${i}`,
    width: 90,
    height: 40,
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

const graph500 = generateDag(500);

function MiniNode({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0',
      borderRadius: 3, fontSize: 10, fontFamily: 'monospace', color: '#64748b',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Performance/13 Stress 500 Nodes',
  parameters: {
    docs: {
      description: {
        story: '500-node DAG. Used by the Playwright perf test. Virtualization keeps only ~120 nodes mounted at default zoom.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 1200, height: 600 }}>
      <ProcessGraph
        graph={graph500}
        renderNode={(n) => <MiniNode label={n.id} />}
      />
    </div>
  ),
};

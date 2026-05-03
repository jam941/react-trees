import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, ProcessEdge } from 'react-process-graph';

const cyclicGraph: ProcessGraphSpec = {
  nodes: [
    { id: 'a', width: 100, height: 48 },
    { id: 'b', width: 100, height: 48 },
    { id: 'c', width: 100, height: 48 },
    { id: 'd', width: 100, height: 48 },
  ],
  edges: [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
    { id: 'e3', source: 'c', target: 'b' }, // cycle: b → c → b
    { id: 'e4', source: 'c', target: 'd' },
  ],
};

function NodeBox({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#fff7ed', border: '1px solid #fed7aa',
      borderRadius: 6, fontSize: 13, fontFamily: 'sans-serif', fontWeight: 600, color: '#9a3412',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Edges/09 Cycle Handling',
  parameters: {
    docs: {
      description: {
        story: 'Graph with a deliberate b→c→b cycle. Cycle edges are drawn dashed red; onCycleDetected fires with the affected edges.',
      },
    },
  },
};
export default meta;

function CycleDemo() {
  const [detected, setDetected] = useState<ProcessEdge[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {detected.length > 0 && (
        <div style={{
          padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 6, fontFamily: 'sans-serif', fontSize: 13, color: '#991b1b',
        }}>
          ⚠ Cycle detected in edges: {detected.map((e) => e.id).join(', ')}
        </div>
      )}
      <div style={{ width: 700, height: 280, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={cyclicGraph}
          onCycleDetected={setDetected}
          renderNode={(n) => <NodeBox label={n.id} />}
        />
      </div>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => <CycleDemo />,
};

export const CustomCycleStyle: StoryObj = {
  name: 'Custom cycle edge style',
  render: () => (
    <div style={{ width: 700, height: 280, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ProcessGraph
        graph={cyclicGraph}
        renderNode={(n) => <NodeBox label={n.id} />}
        renderEdge={(edge) =>
          edge.points.length >= 2 ? (
            <path
              d={edge.points.reduce((d, p, i) => d + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '')}
              fill="none"
              stroke={edge.isCycleEdge ? '#a855f7' : '#94a3b8'}
              strokeWidth={edge.isCycleEdge ? 2.5 : 1.5}
              strokeDasharray={edge.isCycleEdge ? '8 4' : undefined}
              opacity={edge.isCycleEdge ? 0.9 : 0.7}
            />
          ) : null
        }
      />
    </div>
  ),
};

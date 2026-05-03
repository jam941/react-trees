import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'a', width: 120, height: 56 },
    { id: 'b', width: 120, height: 56 },
    { id: 'c', width: 120, height: 56 },
    { id: 'd', width: 120, height: 56 },
    { id: 'e', width: 120, height: 56 },
  ],
  edges: [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'a', target: 'c' },
    { id: 'e3', source: 'b', target: 'd' },
    { id: 'e4', source: 'c', target: 'd' },
    { id: 'e5', source: 'd', target: 'e' },
  ],
};

function NodeBox({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f0fdf4', border: '1px solid #86efac',
      borderRadius: 6, fontSize: 14, fontFamily: 'sans-serif', fontWeight: 600, color: '#166534',
    }}>
      {label}
    </div>
  );
}

const meta: Meta = {
  title: 'Interaction/11 Fit to View',
  parameters: {
    docs: {
      description: {
        story: 'fitOnMount=true (default) frames the whole graph on first render. Manually pan/zoom then click Refit to restore.',
      },
    },
  },
};
export default meta;

export const FitOnMount: StoryObj = {
  name: 'Fit on mount (default)',
  render: () => (
    <div style={{ width: 600, height: 300, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => <NodeBox label={n.id} />}
      />
    </div>
  ),
};

export const NoFitOnMount: StoryObj = {
  name: 'No fit on mount',
  render: () => (
    <div style={{ width: 600, height: 300, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <ProcessGraph
        graph={graph}
        fitOnMount={false}
        renderNode={(n) => <NodeBox label={n.id} />}
      />
    </div>
  ),
};

function RefitDemo() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            padding: '4px 12px', fontSize: 13, fontFamily: 'sans-serif',
            background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}
        >
          Refit (remount)
        </button>
      </div>
      <div key={key} style={{ width: 600, height: 300, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={graph}
          renderNode={(n) => <NodeBox label={n.id} />}
        />
      </div>
    </div>
  );
}

export const RefitButton: StoryObj = {
  name: 'Refit via remount',
  render: () => <RefitDemo />,
};

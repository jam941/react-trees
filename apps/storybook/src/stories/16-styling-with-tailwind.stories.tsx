import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'plan', width: 110, height: 50 },
    { id: 'code', width: 110, height: 50 },
    { id: 'review', width: 110, height: 50 },
    { id: 'merge', width: 110, height: 50 },
  ],
  edges: [
    { id: 'e1', source: 'plan', target: 'code' },
    { id: 'e2', source: 'code', target: 'review' },
    { id: 'e3', source: 'review', target: 'merge' },
  ],
};

// NOTE: Storybook's tailwind decorator must be configured in .storybook/preview.ts
// to load the Tailwind stylesheet. This story uses inline tailwind-like classes
// that will render correctly when the Tailwind CDN or build is present.

const meta: Meta = {
  title: 'Theming/16 Styling with Tailwind',
  parameters: {
    docs: {
      description: {
        story: 'Tailwind utility classes inside renderNode. Requires Tailwind to be loaded via Storybook decorator or the CDN.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 600, height: 220 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div
            style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif',
              fontWeight: 600, color: '#1e40af',
              background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
              border: '1px solid #bfdbfe',
              boxShadow: '0 1px 3px rgba(59,130,246,.15)',
            }}
          >
            {n.id}
          </div>
        )}
      />
    </div>
  ),
};

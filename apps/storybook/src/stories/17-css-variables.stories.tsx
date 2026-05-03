import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'source', width: 110, height: 50 },
    { id: 'process', width: 110, height: 50 },
    { id: 'output', width: 110, height: 50 },
  ],
  edges: [
    { id: 'e1', source: 'source', target: 'process' },
    { id: 'e2', source: 'process', target: 'output' },
  ],
};

const lightVars = `
  --rpg-node-bg: #ffffff;
  --rpg-node-border: #e2e8f0;
  --rpg-node-color: #1e293b;
  --rpg-canvas-bg: #f8fafc;
`;

const darkVars = `
  --rpg-node-bg: #1e293b;
  --rpg-node-border: #334155;
  --rpg-node-color: #f1f5f9;
  --rpg-canvas-bg: #0f172a;
`;

const css = `
  .rpg-themed {
    background: var(--rpg-canvas-bg, #fff);
  }
  .rpg-themed-node {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--rpg-node-bg, #fff);
    border: 1.5px solid var(--rpg-node-border, #e2e8f0);
    color: var(--rpg-node-color, #1e293b);
    border-radius: 6px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    font-weight: 500;
  }
`;

function ThemedDemo() {
  const [dark, setDark] = useState(false);

  return (
    <>
      <style>{css}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              padding: '4px 14px', borderRadius: 4, border: '1px solid #e2e8f0',
              cursor: 'pointer', fontSize: 13, fontFamily: 'sans-serif',
              background: dark ? '#1e293b' : '#fff', color: dark ? '#f1f5f9' : '#374151',
            }}
          >
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>
        <div style={{ width: 550, height: 220 }}>
          <ProcessGraph
            key={String(dark)}
            graph={graph}
            className="rpg-themed"
            style={{ ['--rpg-node-bg' as string]: dark ? '#1e293b' : '#ffffff',
                     ['--rpg-node-border' as string]: dark ? '#334155' : '#e2e8f0',
                     ['--rpg-node-color' as string]: dark ? '#f1f5f9' : '#1e293b',
                     ['--rpg-canvas-bg' as string]: dark ? '#0f172a' : '#f8fafc' }}
            renderNode={(n) => <div className="rpg-themed-node">{n.id}</div>}
          />
        </div>
        <pre style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>
          {dark ? darkVars : lightVars}
        </pre>
      </div>
    </>
  );
}

const meta: Meta = {
  title: 'Theming/17 CSS Variables',
  parameters: {
    docs: {
      description: {
        story: 'Theme the graph via CSS custom properties on the canvas container. Toggle dark/light mode without remounting.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <ThemedDemo />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'a', width: 110, height: 50 },
    { id: 'b', width: 110, height: 50 },
    { id: 'c', width: 110, height: 50 },
    { id: 'd', width: 110, height: 50 },
  ],
  edges: [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'a', target: 'c' },
    { id: 'e3', source: 'b', target: 'd' },
    { id: 'e4', source: 'c', target: 'd' },
  ],
};

// Inline <style> injected for demonstration (in a real app use CSS modules or a stylesheet)
const css = `
  .rpg-demo-container {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  }

  .rpg-demo-node {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border: 1.5px solid #94a3b8;
    border-radius: 6px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    color: #1e293b;
    font-weight: 500;
  }

  .rpg-demo-node:hover {
    background: #f1f5f9;
    border-color: #64748b;
  }
`;

const meta: Meta = {
  title: 'Theming/15 Styling with classNames',
  parameters: {
    docs: {
      description: {
        story: 'Apply className and style props to the canvas, then use plain CSS classes inside renderNode.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <>
      <style>{css}</style>
      <div style={{ width: 600, height: 280 }}>
        <ProcessGraph
          graph={graph}
          className="rpg-demo-container"
          renderNode={(n) => <div className="rpg-demo-node">{n.id}</div>}
        />
      </div>
    </>
  ),
};

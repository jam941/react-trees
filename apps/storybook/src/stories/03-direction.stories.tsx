import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, Direction } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: [
    { id: 'a', width: 100, height: 48 },
    { id: 'b', width: 100, height: 48 },
    { id: 'c', width: 100, height: 48 },
    { id: 'd', width: 100, height: 48 },
    { id: 'e', width: 100, height: 48 },
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
      justifyContent: 'center', background: '#fafafa', border: '1px solid #e2e8f0',
      borderRadius: 6, fontSize: 13, fontFamily: 'monospace',
    }}>
      {label}
    </div>
  );
}

const meta: Meta<{ direction: Direction }> = {
  title: 'Basics/03 Direction',
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['LR', 'RL', 'TB', 'BT', 'force'],
      description: 'Layout direction',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Same graph rendered in all five layout directions. Toggle via the Controls panel.',
      },
    },
  },
};
export default meta;

export const LeftRight: StoryObj<{ direction: Direction }> = {
  name: 'Left → Right (LR)',
  args: { direction: 'LR' },
  render: ({ direction }) => (
    <div style={{ width: 700, height: 300 }}>
      <ProcessGraph graph={graph} direction={direction} renderNode={(n) => <NodeBox label={n.id} />} />
    </div>
  ),
};

export const TopDown: StoryObj<{ direction: Direction }> = {
  name: 'Top → Down (TB)',
  args: { direction: 'TB' },
  render: ({ direction }) => (
    <div style={{ width: 400, height: 500 }}>
      <ProcessGraph graph={graph} direction={direction} renderNode={(n) => <NodeBox label={n.id} />} />
    </div>
  ),
};

export const RightLeft: StoryObj<{ direction: Direction }> = {
  name: 'Right → Left (RL)',
  args: { direction: 'RL' },
  render: ({ direction }) => (
    <div style={{ width: 700, height: 300 }}>
      <ProcessGraph graph={graph} direction={direction} renderNode={(n) => <NodeBox label={n.id} />} />
    </div>
  ),
};

export const BottomUp: StoryObj<{ direction: Direction }> = {
  name: 'Bottom → Up (BT)',
  args: { direction: 'BT' },
  render: ({ direction }) => (
    <div style={{ width: 400, height: 500 }}>
      <ProcessGraph graph={graph} direction={direction} renderNode={(n) => <NodeBox label={n.id} />} />
    </div>
  ),
};

export const Force: StoryObj<{ direction: Direction }> = {
  name: 'Force directed',
  args: { direction: 'force' },
  render: ({ direction }) => (
    <div style={{ width: 600, height: 400 }}>
      <ProcessGraph graph={graph} direction={direction} renderNode={(n) => <NodeBox label={n.id} />} />
    </div>
  ),
};

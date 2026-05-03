import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, Direction } from 'react-process-graph';

const graph: ProcessGraphSpec = {
  nodes: Array.from({ length: 8 }, (_, i) => ({ id: `step${i + 1}`, width: 110, height: 50 })),
  edges: [
    { id: 'e1', source: 'step1', target: 'step2' },
    { id: 'e2', source: 'step1', target: 'step3' },
    { id: 'e3', source: 'step2', target: 'step4' },
    { id: 'e4', source: 'step3', target: 'step4' },
    { id: 'e5', source: 'step4', target: 'step5' },
    { id: 'e6', source: 'step4', target: 'step6' },
    { id: 'e7', source: 'step5', target: 'step7' },
    { id: 'e8', source: 'step6', target: 'step7' },
    { id: 'e9', source: 'step7', target: 'step8' },
  ],
};

const DIRECTIONS: Direction[] = ['LR', 'TB', 'RL', 'BT'];

function StepNode({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#eff6ff', border: '1px solid #bfdbfe',
      borderRadius: 6, fontSize: 12, fontFamily: 'sans-serif', color: '#1e40af',
    }}>
      {label}
    </div>
  );
}

function DirectionSwitcher() {
  const [direction, setDirection] = useState<Direction>('LR');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {DIRECTIONS.map((d) => (
          <button
            key={d}
            onClick={() => setDirection(d)}
            style={{
              padding: '4px 12px', borderRadius: 4, border: '1px solid #e2e8f0',
              background: direction === d ? '#3b82f6' : '#fff',
              color: direction === d ? '#fff' : '#374151',
              cursor: 'pointer', fontSize: 13, fontFamily: 'sans-serif',
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <div style={{ width: 700, height: 380, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          key={direction}
          graph={graph}
          direction={direction}
          renderNode={(n) => <StepNode label={n.id} />}
        />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Interaction/12 Direction Switching',
  parameters: {
    docs: {
      description: {
        story: 'Switch layout direction at runtime. Each direction triggers a fresh layout.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => <DirectionSwitcher />,
};

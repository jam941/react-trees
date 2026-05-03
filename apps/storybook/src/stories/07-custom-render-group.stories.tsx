import type { Meta, StoryObj } from '@storybook/react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, PositionedGroup } from 'react-process-graph';

type GroupData = { label: string; color: string };

const graph: ProcessGraphSpec<unknown, GroupData> = {
  nodes: [
    { id: 'lint', groupId: 'validate', width: 110, height: 48 },
    { id: 'typecheck', groupId: 'validate', width: 110, height: 48 },
    { id: 'unit-test', groupId: 'verify', width: 110, height: 48 },
    { id: 'e2e', groupId: 'verify', width: 110, height: 48 },
    { id: 'deploy', width: 110, height: 48 },
  ],
  groups: [
    { id: 'validate', data: { label: 'Validate', color: '#dbeafe' } },
    { id: 'verify', data: { label: 'Verify', color: '#d1fae5' } },
  ],
  edges: [
    { id: 'e1', source: 'validate', target: 'verify', sourceKind: 'group', targetKind: 'group' },
    { id: 'e2', source: 'verify', target: 'deploy', targetKind: 'node' },
  ],
};

function GroupContainer({ group, children }: { group: PositionedGroup<GroupData>; children: React.ReactNode }) {
  const { label = group.id, color = '#f1f5f9' } = group.data ?? {};
  return (
    <div style={{
      width: '100%', height: '100%', background: color,
      border: `2px solid ${color.replace('fe', 'bd').replace('fa', 'd1')}`,
      borderRadius: 8, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'sans-serif',
        color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>{children}</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Groups/07 Custom Group Renderer',
  parameters: {
    docs: {
      description: {
        story: 'Custom renderGroup with a header bar and background fill. Data payload drives the label and colour.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: 750, height: 300 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(n) => (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 5, fontSize: 12, fontFamily: 'sans-serif',
          }}>
            {n.id}
          </div>
        )}
        renderGroup={(group, children) => (
          <GroupContainer group={group}>{children}</GroupContainer>
        )}
      />
    </div>
  ),
};

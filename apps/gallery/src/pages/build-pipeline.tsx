import { useState, useCallback } from 'react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

type NodeData = { label: string; status: 'pending' | 'running' | 'done' | 'failed' };

const graph: ProcessGraphSpec<NodeData> = {
  nodes: [
    { id: 'checkout', groupId: 'setup', width: 140, height: 56, data: { label: 'Checkout', status: 'done' } },
    { id: 'install', groupId: 'setup', width: 140, height: 56, data: { label: 'Install deps', status: 'done' } },
    { id: 'lint', groupId: 'validate', width: 140, height: 56, data: { label: 'Lint', status: 'done' } },
    { id: 'typecheck', groupId: 'validate', width: 140, height: 56, data: { label: 'Type check', status: 'running' } },
    { id: 'unit', groupId: 'test', width: 140, height: 56, data: { label: 'Unit tests', status: 'running' } },
    { id: 'e2e', groupId: 'test', width: 140, height: 56, data: { label: 'E2E tests', status: 'pending' } },
    { id: 'build', groupId: 'ship', width: 140, height: 56, data: { label: 'Build', status: 'pending' } },
    { id: 'deploy', groupId: 'ship', width: 140, height: 56, data: { label: 'Deploy', status: 'pending' } },
  ],
  groups: [
    { id: 'setup' },
    { id: 'validate' },
    { id: 'test' },
    { id: 'ship' },
  ],
  edges: [
    { id: 'e1', source: 'setup', target: 'validate', sourceKind: 'group', targetKind: 'group' },
    { id: 'e2', source: 'validate', target: 'test', sourceKind: 'group', targetKind: 'group' },
    { id: 'e3', source: 'test', target: 'ship', sourceKind: 'group', targetKind: 'group' },
  ],
};

const statusColor: Record<NodeData['status'], string> = {
  pending: '#94a3b8',
  running: '#f59e0b',
  done: '#22c55e',
  failed: '#ef4444',
};
const statusBg: Record<NodeData['status'], string> = {
  pending: '#f8fafc',
  running: '#fffbeb',
  done: '#f0fdf4',
  failed: '#fef2f2',
};

function PipelineNode({ data, id }: { data?: NodeData; id: string }) {
  const { label = id, status = 'pending' } = data ?? {};
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      gap: 10, padding: '0 12px', background: statusBg[status],
      border: `1.5px solid ${statusColor[status]}`, borderRadius: 8,
      fontFamily: 'system-ui', fontSize: 13,
    }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: statusColor[status], flexShrink: 0 }} />
      <span style={{ fontWeight: 600, color: '#1e293b' }}>{label}</span>
    </div>
  );
}

const groupLabels: Record<string, string> = { setup: 'Setup', validate: 'Validate', test: 'Test', ship: 'Ship' };

export default function BuildPipeline() {
  const [completed, setCompleted] = useState(false);

  const handleComplete = useCallback(() => setCompleted(true), []);

  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Build Pipeline</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        CI/CD pipeline with group-to-group edges representing stage dependencies.
        {completed && <span style={{ color: '#22c55e', marginLeft: 8 }}>✓ Layout complete</span>}
      </p>
      <div
        data-testid="build-pipeline"
        style={{ width: '100%', height: 360, border: '1px solid #e2e8f0', borderRadius: 8 }}
      >
        <ProcessGraph
          graph={graph}
          onLayoutComplete={handleComplete}
          renderNode={(n) => <PipelineNode data={n.data} id={n.id} />}
          renderGroup={(group, children) => (
            <div style={{
              width: '100%', height: '100%', background: '#f8fafc', border: '2px dashed #cbd5e1',
              borderRadius: 8, boxSizing: 'border-box', position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: 4, left: 10,
                fontSize: 10, fontWeight: 700, fontFamily: 'system-ui',
                color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {groupLabels[group.id] ?? group.id}
              </span>
              {children}
            </div>
          )}
        />
      </div>
    </div>
  );
}

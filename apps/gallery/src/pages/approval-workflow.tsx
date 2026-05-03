import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

type NodeData = { label: string; reviewer?: string; outcome?: 'approved' | 'rejected' | 'pending' };

const graph: ProcessGraphSpec<NodeData> = {
  nodes: [
    { id: 'submit', width: 140, height: 56, data: { label: 'Submit Request', outcome: 'approved' } },
    { id: 'manager', width: 140, height: 56, data: { label: 'Manager Review', reviewer: 'J. Smith', outcome: 'approved' } },
    { id: 'security', width: 140, height: 56, data: { label: 'Security Review', reviewer: 'A. Chen', outcome: 'pending' } },
    { id: 'legal', width: 140, height: 56, data: { label: 'Legal Review', reviewer: 'M. Davis', outcome: 'pending' } },
    { id: 'approved', width: 140, height: 56, data: { label: '✓ Approved', outcome: 'approved' } },
    { id: 'rejected', width: 140, height: 56, data: { label: '✗ Rejected', outcome: 'rejected' } },
  ],
  edges: [
    { id: 'e1', source: 'submit', target: 'manager' },
    { id: 'e2', source: 'manager', target: 'security' },
    { id: 'e3', source: 'manager', target: 'legal' },
    { id: 'e4', source: 'security', target: 'approved' },
    { id: 'e5', source: 'legal', target: 'approved' },
    { id: 'e6', source: 'manager', target: 'rejected' },
  ],
};

const outcomeStyle: Record<NodeData['outcome'] & string, { bg: string; border: string }> = {
  approved: { bg: '#f0fdf4', border: '#86efac' },
  rejected: { bg: '#fef2f2', border: '#fca5a5' },
  pending: { bg: '#fafafa', border: '#e2e8f0' },
};

function ApprovalNode({ data, id }: { data?: NodeData; id: string }) {
  const { label = id, reviewer, outcome = 'pending' } = data ?? {};
  const s = outcomeStyle[outcome] ?? outcomeStyle['pending'];
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 8,
      fontFamily: 'system-ui', padding: '4px 12px', boxSizing: 'border-box',
    }}>
      <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{label}</span>
      {reviewer && <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{reviewer}</span>}
    </div>
  );
}

export default function ApprovalWorkflow() {
  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Approval Workflow</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Multi-stage approval with parallel reviewer branches and conditional outcomes.
      </p>
      <div style={{ width: '100%', height: 360, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={graph}
          renderNode={(n) => <ApprovalNode data={n.data} id={n.id} />}
        />
      </div>
    </div>
  );
}

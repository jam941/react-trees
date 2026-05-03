import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

const ids = Array.from({ length: 10 }, (_, i) => `n${i + 1}`);
export const panZoomGraph: ProcessGraphSpec = {
  nodes: ids.map((id) => ({ id, width: 100, height: 44 })),
  edges: [
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e2', source: 'n1', target: 'n3' },
    { id: 'e3', source: 'n2', target: 'n4' },
    { id: 'e4', source: 'n3', target: 'n4' },
    { id: 'e5', source: 'n4', target: 'n5' },
    { id: 'e6', source: 'n4', target: 'n6' },
    { id: 'e7', source: 'n5', target: 'n7' },
    { id: 'e8', source: 'n6', target: 'n7' },
    { id: 'e9', source: 'n7', target: 'n8' },
    { id: 'e10', source: 'n8', target: 'n9' },
    { id: 'e11', source: 'n8', target: 'n10' },
  ],
};

function NodeChip({ label }: { label: string }) {
  return (
    <div
      data-testid={`node-${label}`}
      style={{
        width: '100%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fafc', border: '1px solid #cbd5e1',
        borderRadius: 6, fontSize: 13, fontFamily: 'monospace',
      }}
    >
      {label}
    </div>
  );
}

export default function PanZoomDemo() {
  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Pan + Zoom</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Drag to pan · scroll to zoom · graph fits to view on mount
      </p>
      <div
        data-testid="graph-container"
        style={{ width: '100%', height: 480, border: '1px solid #e2e8f0', borderRadius: 8 }}
      >
        <ProcessGraph
          graph={panZoomGraph}
          renderNode={(n) => <NodeChip label={n.id} />}
        />
      </div>
    </div>
  );
}

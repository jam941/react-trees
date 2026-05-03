import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

type NodeData = { label: string; rows?: string; kind: 'source' | 'transform' | 'sink' };

const graph: ProcessGraphSpec<NodeData> = {
  nodes: [
    { id: 'pg', width: 140, height: 56, data: { label: 'PostgreSQL', rows: '2.4M rows', kind: 'source' } },
    { id: 'api', width: 140, height: 56, data: { label: 'REST API', rows: 'live', kind: 'source' } },
    { id: 'dedupe', width: 140, height: 56, data: { label: 'Deduplicate', kind: 'transform' } },
    { id: 'enrich', width: 140, height: 56, data: { label: 'Enrich', kind: 'transform' } },
    { id: 'validate', width: 140, height: 56, data: { label: 'Validate', kind: 'transform' } },
    { id: 'warehouse', width: 140, height: 56, data: { label: 'Data Warehouse', kind: 'sink' } },
    { id: 'cache', width: 140, height: 56, data: { label: 'Redis Cache', kind: 'sink' } },
  ],
  edges: [
    { id: 'e1', source: 'pg', target: 'dedupe' },
    { id: 'e2', source: 'api', target: 'dedupe' },
    { id: 'e3', source: 'dedupe', target: 'enrich' },
    { id: 'e4', source: 'enrich', target: 'validate' },
    { id: 'e5', source: 'validate', target: 'warehouse' },
    { id: 'e6', source: 'validate', target: 'cache' },
  ],
};

const kindColor: Record<NodeData['kind'], { bg: string; border: string; dot: string }> = {
  source: { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  transform: { bg: '#f5f3ff', border: '#ddd6fe', dot: '#8b5cf6' },
  sink: { bg: '#ecfdf5', border: '#a7f3d0', dot: '#10b981' },
};

function ETLNode({ data, id }: { data?: NodeData; id: string }) {
  const { label = id, rows, kind = 'transform' } = data ?? {};
  const c = kindColor[kind];
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 8,
      fontFamily: 'system-ui', padding: '4px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{label}</span>
      </div>
      {rows && <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{rows}</span>}
    </div>
  );
}

export default function DataPipeline() {
  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Data Pipeline</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        ETL DAG: sources (blue) → transforms (purple) → sinks (green).
      </p>
      <div style={{ width: '100%', height: 340, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={graph}
          renderNode={(n) => <ETLNode data={n.data} id={n.id} />}
        />
      </div>
    </div>
  );
}

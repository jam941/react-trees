import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

type PkgData = { version: string; type: 'direct' | 'peer' | 'dev' };

const graph: ProcessGraphSpec<PkgData> = {
  nodes: [
    { id: 'my-app', width: 140, height: 56, data: { version: '1.0.0', type: 'direct' } },
    { id: 'react', width: 140, height: 56, data: { version: '18.3.0', type: 'peer' } },
    { id: 'react-dom', width: 140, height: 56, data: { version: '18.3.0', type: 'peer' } },
    { id: 'react-process-graph', width: 140, height: 56, data: { version: '0.1.0', type: 'direct' } },
    { id: 'elkjs', width: 140, height: 56, data: { version: '0.9.3', type: 'direct' } },
    { id: 'typescript', width: 140, height: 56, data: { version: '5.6.0', type: 'dev' } },
    { id: 'vite', width: 140, height: 56, data: { version: '5.0.0', type: 'dev' } },
    { id: 'vitest', width: 140, height: 56, data: { version: '3.0.0', type: 'dev' } },
  ],
  edges: [
    { id: 'e1', source: 'my-app', target: 'react' },
    { id: 'e2', source: 'my-app', target: 'react-dom' },
    { id: 'e3', source: 'my-app', target: 'react-process-graph' },
    { id: 'e4', source: 'my-app', target: 'typescript' },
    { id: 'e5', source: 'my-app', target: 'vite' },
    { id: 'e6', source: 'my-app', target: 'vitest' },
    { id: 'e7', source: 'react-process-graph', target: 'react' },
    { id: 'e8', source: 'react-process-graph', target: 'elkjs' },
  ],
};

const typeColor: Record<PkgData['type'], { bg: string; border: string; badge: string }> = {
  direct: { bg: '#eff6ff', border: '#bfdbfe', badge: '#3b82f6' },
  peer: { bg: '#f5f3ff', border: '#ddd6fe', badge: '#8b5cf6' },
  dev: { bg: '#f8fafc', border: '#e2e8f0', badge: '#94a3b8' },
};

function PkgNode({ id, data }: { id: string; data?: PkgData }) {
  const { version = '?', type = 'direct' } = data ?? {};
  const c = typeColor[type];
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 8,
      fontFamily: 'system-ui', padding: '4px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.badge, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: 12, color: '#1e293b' }}>{id}</span>
      </div>
      <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>v{version}</span>
    </div>
  );
}

export default function SoftwareDeps() {
  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Software Dependencies</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
        npm-style dependency tree.
        <span style={{ marginLeft: 12 }}>
          <span style={{ color: '#3b82f6' }}>● direct</span>
          <span style={{ color: '#8b5cf6', marginLeft: 8 }}>● peer</span>
          <span style={{ color: '#94a3b8', marginLeft: 8 }}>● dev</span>
        </span>
      </p>
      <div style={{ width: '100%', height: 380, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={graph}
          renderNode={(n) => <PkgNode id={n.id} data={n.data} />}
        />
      </div>
    </div>
  );
}

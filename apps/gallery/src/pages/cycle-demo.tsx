import { useState } from 'react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, ProcessEdge } from 'react-process-graph';

const cyclicGraph: ProcessGraphSpec = {
  nodes: [
    { id: 'checkout', width: 130, height: 52 },
    { id: 'install', width: 130, height: 52 },
    { id: 'build', width: 130, height: 52 },
    { id: 'test', width: 130, height: 52 },
    { id: 'lint', width: 130, height: 52 },
    { id: 'deploy', width: 130, height: 52 },
  ],
  edges: [
    { id: 'e1', source: 'checkout', target: 'install' },
    { id: 'e2', source: 'install', target: 'build' },
    { id: 'e3', source: 'install', target: 'lint' },
    { id: 'e4', source: 'build', target: 'test' },
    { id: 'e5', source: 'test', target: 'build' },   // cycle: build → test → build
    { id: 'e6', source: 'test', target: 'deploy' },
    { id: 'e7', source: 'lint', target: 'deploy' },
  ],
};

const statusColors: Record<string, string> = {
  checkout: '#10b981', install: '#3b82f6', build: '#f59e0b',
  test: '#8b5cf6', lint: '#06b6d4', deploy: '#ef4444',
};

function StepNode({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8,
      background: '#fff', border: `2px solid ${statusColors[label] ?? '#e2e8f0'}`,
      borderRadius: 8, fontSize: 13, fontFamily: 'system-ui', fontWeight: 600,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[label] ?? '#e2e8f0', flexShrink: 0 }} />
      {label}
    </div>
  );
}

export default function CycleDemo() {
  const [cycleEdges, setCycleEdges] = useState<ProcessEdge[]>([]);

  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Cycle Handling</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16, maxWidth: 560 }}>
        This pipeline graph contains a deliberate cycle (build → test → build). The package
        detects it, strips the cycle edges before layout, re-adds them as dashed red edges,
        and calls <code>onCycleDetected</code>.
      </p>

      {cycleEdges.length > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', marginBottom: 16,
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6,
          fontFamily: 'system-ui', fontSize: 13, color: '#991b1b',
        }}>
          <span>⚠</span>
          <span>Cycles detected in: <strong>{cycleEdges.map((e) => e.id).join(', ')}</strong></span>
        </div>
      )}

      <div
        data-testid="cycle-graph"
        style={{ width: '100%', height: 380, border: '1px solid #e2e8f0', borderRadius: 8 }}
      >
        <ProcessGraph
          graph={cyclicGraph}
          onCycleDetected={setCycleEdges}
          renderNode={(n) => <StepNode label={n.id} />}
        />
      </div>

      <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
        Cycle edges are drawn dashed red by default. Use the <code>renderEdge</code> prop to customise.
      </p>
    </div>
  );
}

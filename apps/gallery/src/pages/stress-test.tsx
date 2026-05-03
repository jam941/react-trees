import { useState } from 'react';
import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec, Direction } from 'react-process-graph';

function generateDag(nodeCount: number): ProcessGraphSpec {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `n${i}`,
    width: 90,
    height: 40,
  }));

  const edges: ProcessGraphSpec['edges'] = [];
  let edgeId = 0;
  for (let i = 0; i < nodeCount - 1; i++) {
    const targets = Math.min(2, nodeCount - i - 1);
    for (let j = 1; j <= targets; j++) {
      edges.push({ id: `e${edgeId++}`, source: `n${i}`, target: `n${i + j}` });
    }
  }

  return { nodes, edges };
}

const SIZES = [100, 500, 2000] as const;

function MiniNode({ label }: { label: string }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: 3, fontSize: 10, fontFamily: 'monospace',
      }}
    >
      {label}
    </div>
  );
}

export default function StressTest() {
  const [size, setSize] = useState<number>(500);
  const [direction, setDirection] = useState<Direction>('LR');
  const [graphKey, setGraphKey] = useState(0);
  const graph = generateDag(size);

  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 12 }}>Stress Test</h2>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', fontFamily: 'system-ui', fontSize: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Nodes:</span>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => { setSize(s); setGraphKey((k) => k + 1); }}
              style={{
                padding: '4px 10px', borderRadius: 4, border: '1px solid #e2e8f0',
                background: size === s ? '#3b82f6' : '#fff',
                color: size === s ? '#fff' : '#374151',
                cursor: 'pointer', fontSize: 13,
              }}
            >
              {s.toLocaleString()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Direction:</span>
          {(['LR', 'TB'] as const).map((d) => (
            <button
              key={d}
              onClick={() => { setDirection(d); setGraphKey((k) => k + 1); }}
              style={{
                padding: '4px 10px', borderRadius: 4, border: '1px solid #e2e8f0',
                background: direction === d ? '#8b5cf6' : '#fff',
                color: direction === d ? '#fff' : '#374151',
                cursor: 'pointer', fontSize: 13,
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() => setGraphKey((k) => k + 1)}
          style={{
            padding: '4px 12px', borderRadius: 4, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 13,
          }}
        >
          Regenerate
        </button>
      </div>

      <div
        key={graphKey}
        data-testid="stress-container"
        style={{ width: '100%', height: 520, border: '1px solid #e2e8f0', borderRadius: 8 }}
      >
        <ProcessGraph
          graph={graph}
          direction={direction}
          renderNode={(n) => <MiniNode label={n.id} />}
        />
      </div>

      <p style={{ fontFamily: 'system-ui', fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
        {size.toLocaleString()} nodes · virtualization keeps only visible nodes in the DOM
      </p>
    </div>
  );
}

import { ProcessGraph } from 'react-process-graph';
import type { ProcessGraphSpec } from 'react-process-graph';

type PersonData = { name: string; title: string; dept: string };

const graph: ProcessGraphSpec<PersonData> = {
  nodes: [
    { id: 'ceo', width: 140, height: 64, data: { name: 'Alex Morgan', title: 'CEO', dept: 'exec' } },
    { id: 'cto', width: 140, height: 64, data: { name: 'Sam Lee', title: 'CTO', dept: 'tech' } },
    { id: 'cfo', width: 140, height: 64, data: { name: 'Jordan Kim', title: 'CFO', dept: 'finance' } },
    { id: 'vpe', width: 140, height: 64, data: { name: 'Taylor Reyes', title: 'VP Eng', dept: 'tech' } },
    { id: 'vpd', width: 140, height: 64, data: { name: 'Casey Park', title: 'VP Design', dept: 'design' } },
    { id: 'eng1', width: 140, height: 64, data: { name: 'Robin Chen', title: 'Sr Engineer', dept: 'tech' } },
    { id: 'eng2', width: 140, height: 64, data: { name: 'Drew Patel', title: 'Engineer', dept: 'tech' } },
    { id: 'des1', width: 140, height: 64, data: { name: 'Quinn Walsh', title: 'Sr Designer', dept: 'design' } },
  ],
  groups: [
    { id: 'g-tech', data: undefined },
    { id: 'g-design', data: undefined },
  ],
  edges: [
    { id: 'e1', source: 'ceo', target: 'cto' },
    { id: 'e2', source: 'ceo', target: 'cfo' },
    { id: 'e3', source: 'cto', target: 'vpe' },
    { id: 'e4', source: 'cto', target: 'vpd' },
    { id: 'e5', source: 'vpe', target: 'eng1' },
    { id: 'e6', source: 'vpe', target: 'eng2' },
    { id: 'e7', source: 'vpd', target: 'des1' },
  ],
};

const deptColors: Record<string, string> = {
  exec: '#fef3c7',
  tech: '#eff6ff',
  design: '#fdf4ff',
  finance: '#ecfdf5',
};

function PersonCard({ data, id }: { data?: PersonData; id: string }) {
  const { name = id, title = '', dept = 'exec' } = data ?? {};
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: deptColors[dept] ?? '#fff', border: '1px solid #e2e8f0',
      borderRadius: 8, fontFamily: 'system-ui', padding: '4px 8px',
    }}>
      <span style={{ fontWeight: 700, fontSize: 12, color: '#1e293b' }}>{name}</span>
      <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{title}</span>
    </div>
  );
}

export default function OrgChart() {
  return (
    <div>
      <h2 style={{ fontFamily: 'system-ui', fontSize: 20, marginBottom: 8 }}>Org Chart</h2>
      <p style={{ fontFamily: 'system-ui', fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Top-down org chart using TB direction.
      </p>
      <div style={{ width: '100%', height: 440, border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <ProcessGraph
          graph={graph}
          direction="TB"
          renderNode={(n) => <PersonCard data={n.data} id={n.id} />}
        />
      </div>
    </div>
  );
}

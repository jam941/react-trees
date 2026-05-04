import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/landing';
import PanZoomDemo from './pages/pan-zoom-demo';
import StressTest from './pages/stress-test';
import CycleDemo from './pages/cycle-demo';
import BuildPipeline from './pages/build-pipeline';
import DataPipeline from './pages/data-pipeline';
import ApprovalWorkflow from './pages/approval-workflow';
import SoftwareDeps from './pages/software-deps';
import OrgChart from './pages/org-chart';

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '16px 12px',
  width: 200,
  borderRight: '1px solid #e5e7eb',
  minHeight: '100vh',
  flexShrink: 0,
};

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  padding: '6px 10px',
  borderRadius: 6,
  textDecoration: 'none',
  fontSize: 14,
  color: isActive ? '#1d4ed8' : '#374151',
  background: isActive ? '#eff6ff' : 'transparent',
  fontWeight: isActive ? 600 : 400,
});

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div style={{ display: 'flex' }}>
        <nav style={navStyle}>
          <span style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Examples</span>
          <NavLink to="/" end style={linkStyle}>Landing</NavLink>
          <NavLink to="/pan-zoom" style={linkStyle}>Pan + Zoom</NavLink>
          <NavLink to="/stress-test" style={linkStyle}>Stress Test</NavLink>
          <NavLink to="/cycle-demo" style={linkStyle}>Cycle Demo</NavLink>
          <NavLink to="/build-pipeline" style={linkStyle}>Build Pipeline</NavLink>
          <NavLink to="/data-pipeline" style={linkStyle}>Data Pipeline</NavLink>
          <NavLink to="/approval-workflow" style={linkStyle}>Approval Workflow</NavLink>
          <NavLink to="/software-deps" style={linkStyle}>Software Deps</NavLink>
          <NavLink to="/org-chart" style={linkStyle}>Org Chart</NavLink>
        </nav>
        <main style={{ flex: 1, padding: 32 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pan-zoom" element={<PanZoomDemo />} />
            <Route path="/stress-test" element={<StressTest />} />
            <Route path="/cycle-demo" element={<CycleDemo />} />
            <Route path="/build-pipeline" element={<BuildPipeline />} />
            <Route path="/data-pipeline" element={<DataPipeline />} />
            <Route path="/approval-workflow" element={<ApprovalWorkflow />} />
            <Route path="/software-deps" element={<SoftwareDeps />} />
            <Route path="/org-chart" element={<OrgChart />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

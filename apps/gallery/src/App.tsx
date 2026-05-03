import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/landing';

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
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <nav style={navStyle}>
          <span style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Examples</span>
          <NavLink to="/" end style={linkStyle}>Landing</NavLink>
          {/* More links added per step */}
        </nav>
        <main style={{ flex: 1, padding: 32 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

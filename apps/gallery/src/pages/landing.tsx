export default function Landing() {
  return (
    <div style={{ maxWidth: 680, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>react-process-graph</h1>
      <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 32 }}>
        Render DAG dependency and process diagrams in React — with full control over node content,
        group semantics, and layout direction.
      </p>
      <ul style={{ lineHeight: 2, paddingLeft: 20, color: '#374151' }}>
        <li>HTML nodes — any React component inside</li>
        <li>SVG edge overlay — clean, scalable arrows</li>
        <li>elkjs layout — layered DAG, left-to-right or top-down</li>
        <li>Group-to-group edges — N×M semantics, single visual edge</li>
        <li>Viewport virtualization — smooth at 500+ nodes</li>
        <li>Pan + zoom — mouse wheel, drag, fit-to-view</li>
        <li>Cycle detection — graceful fallback with callbacks</li>
        <li>Headless — bring your own styles</li>
      </ul>
      <p style={{ marginTop: 32, color: '#9ca3af', fontSize: 14 }}>
        Demos will appear in the sidebar as they are built.
      </p>
    </div>
  );
}

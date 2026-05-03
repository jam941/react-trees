# react-process-graph

Render DAG dependency and process diagrams in React — with full control over node content, group semantics, and layout direction.

[![CI](https://github.com/jarredmoyer/react-trees/actions/workflows/ci.yml/badge.svg)](https://github.com/jarredmoyer/react-trees/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-process-graph.svg)](https://www.npmjs.com/package/react-process-graph)

## Features

- **HTML nodes** — any React component inside each node
- **SVG edge overlay** — clean, scalable arrows with waypoints
- **elkjs layout** — layered DAG (LR / TB / RL / BT) or force-directed
- **Group-to-group edges** — N×M dependency semantics drawn as a single edge
- **Viewport virtualization** — smooth panning at 500+ nodes
- **Pan + zoom** — mouse wheel, drag-to-pan, fit-to-view
- **Cycle detection** — graceful fallback with `onCycleDetected` callback
- **Headless** — zero bundled CSS, bring your own styles

## Install

```bash
npm install react-process-graph
# or
pnpm add react-process-graph
```

**Peer dependencies:** `react` and `react-dom` ≥18.

## Quickstart

```tsx
import { ProcessGraph } from 'react-process-graph';

const graph = {
  nodes: [
    { id: 'checkout', width: 120, height: 48 },
    { id: 'build',    width: 120, height: 48 },
    { id: 'deploy',   width: 120, height: 48 },
  ],
  edges: [
    { id: 'e1', source: 'checkout', target: 'build' },
    { id: 'e2', source: 'build',    target: 'deploy' },
  ],
};

export function Pipeline() {
  return (
    <div style={{ width: 800, height: 400 }}>
      <ProcessGraph
        graph={graph}
        renderNode={(node) => (
          <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: 8 }}>
            {node.id}
          </div>
        )}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `graph` | `ProcessGraphSpec` | — | **Required.** Nodes, groups, and edges. |
| `renderNode` | `(node: PositionedNode) => ReactNode` | — | **Required.** Render each node's content. |
| `direction` | `'LR' \| 'TB' \| 'RL' \| 'BT' \| 'force'` | `'LR'` | Layout direction. |
| `renderGroup` | `(group, children) => ReactNode` | dashed border | Custom group container. |
| `renderEdge` | `(edge: PositionedEdge) => ReactNode` | SVG path+arrow | Custom edge renderer. |
| `className` | `string` | — | CSS class on the canvas container. |
| `style` | `CSSProperties` | — | Inline styles on the canvas container. |
| `defaultZoom` | `number` | `1` | Initial zoom scale (overrides `fitOnMount`). |
| `fitOnMount` | `boolean` | `true` | Fit the graph to the viewport on first render. |
| `onLayoutComplete` | `(result: LayoutResult) => void` | — | Fires after every layout run. |
| `onCycleDetected` | `(cycleEdges: ProcessEdge[]) => void` | — | Fires when cycles are found; layout still completes. |

## Group semantics

A `ProcessEdge` whose `source` or `target` is a group ID means *every node in the source group is a predecessor of every node in the target group*, but it is rendered as a **single visual edge** between the group containers.

```tsx
const graph = {
  nodes: [
    { id: 'a', groupId: 'g1', width: 100, height: 44 },
    { id: 'b', groupId: 'g2', width: 100, height: 44 },
  ],
  groups: [{ id: 'g1' }, { id: 'g2' }],
  edges: [
    // one edge drawn between the group containers
    { id: 'e1', source: 'g1', target: 'g2', sourceKind: 'group', targetKind: 'group' },
  ],
};
```

## Cycle handling

Cycles are detected before layout. Cycle edges are stripped from the ELK input so layered layout still runs, then re-added as straight fallback edges. By default they render dashed red; override via `renderEdge`.

```tsx
<ProcessGraph
  graph={cyclicGraph}
  onCycleDetected={(edges) => console.warn('Cycles:', edges)}
  renderEdge={(edge) =>
    edge.isCycleEdge ? <path ... stroke="orange" strokeDasharray="6 3" /> : null
  }
/>
```

## Styling

The package ships no CSS. Style nodes and groups via `className`, inline styles, CSS modules, or CSS variables:

```tsx
<ProcessGraph
  graph={graph}
  style={{ '--node-bg': '#f0fdf4', '--node-border': '#86efac' } as React.CSSProperties}
  renderNode={(n) => <div className={styles.node}>{n.id}</div>}
/>
```

## Data types

```ts
interface ProcessNode<TData = unknown> {
  id: string;
  groupId?: string;
  data?: TData;
  width?: number;   // explicit size skips measurement
  height?: number;
}

interface ProcessGroup<TData = unknown> {
  id: string;
  parentGroupId?: string;   // nested groups
  data?: TData;
}

interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  sourceKind?: 'node' | 'group';
  targetKind?: 'node' | 'group';
}

interface PositionedEdge extends ProcessEdge {
  points: Array<{ x: number; y: number }>;
  isCycleEdge: boolean;
}
```

## Development

```bash
pnpm install
pnpm build          # library ESM + CJS + .d.ts
pnpm test           # vitest unit tests
pnpm storybook      # Storybook dev server
pnpm gallery        # Vite gallery app
pnpm test:e2e       # Playwright e2e
pnpm test:perf      # Playwright perf budgets
pnpm test:a11y      # axe accessibility checks
```

## License

MIT

import { useEffect, useRef, useState, useCallback } from 'react';
import ELK from 'elkjs';

import type { ProcessGraphProps, LayoutResult, ProcessEdge } from './types';
import { runLayout } from './layout/elkAdapter';
import { Canvas } from './view/Canvas';
import { NodeLayer } from './view/NodeLayer';
import { EdgeLayer } from './view/EdgeLayer';
import { GroupLayer } from './view/GroupLayer';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const elk = new (ELK as new () => { layout: (g: unknown) => Promise<unknown> })();

export function ProcessGraph<TNode = unknown, TGroup = unknown>({
  graph,
  direction = 'LR',
  renderNode,
  renderGroup,
  renderEdge,
  className,
  style,
  onLayoutComplete,
  onCycleDetected,
}: ProcessGraphProps<TNode, TGroup>) {
  const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
  const prevSpecRef = useRef<string>('');

  const specKey = JSON.stringify({ nodes: graph.nodes, groups: graph.groups, edges: graph.edges, direction });

  const doLayout = useCallback(async () => {
    try {
      const result = await runLayout(elk as never, graph as never, direction);
      setLayoutResult(result);
      onLayoutComplete?.(result);

      const cycleEdges: ProcessEdge[] = result.edges
        .filter((e) => e.isCycleEdge)
        .map(({ isCycleEdge: _, points: __, ...rest }) => rest);
      if (cycleEdges.length > 0) {
        onCycleDetected?.(cycleEdges);
      }
    } catch (err) {
      console.error('[react-process-graph] Layout failed:', err);
    }
  }, [graph, direction, onLayoutComplete, onCycleDetected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (specKey === prevSpecRef.current) return;
    prevSpecRef.current = specKey;
    void doLayout();
  }, [specKey, doLayout]);

  if (!layoutResult) {
    return (
      <div
        className={className}
        style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
      />
    );
  }

  const { nodes, groups, edges, bbox } = layoutResult;

  return (
    <Canvas className={className} style={style}>
      <div style={{ position: 'relative', width: bbox.width, height: bbox.height }}>
        <GroupLayer
          groups={groups as never}
          renderGroup={renderGroup as never}
          nodeChildren={new Map()}
        />
        <NodeLayer nodes={nodes as never} renderNode={renderNode as never} />
        <EdgeLayer edges={edges} bbox={bbox} renderEdge={renderEdge} />
      </div>
    </Canvas>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import ELK from 'elkjs';
import type { ProcessGraphProps, LayoutResult, ProcessEdge, PositionedNode, PositionedGroup, Rect } from './types';
import { runLayout } from './layout/elkAdapter';
import { fitTransform } from './utils/bbox';
import { Canvas } from './view/Canvas';
import { NodeLayer } from './view/NodeLayer';
import { EdgeLayer } from './view/EdgeLayer';
import { GroupLayer } from './view/GroupLayer';
import { usePanZoom } from './view/usePanZoom';
import { ViewportTracker } from './view/Viewport';
import { useVirtualization } from './view/useVirtualization';

const elk = new (ELK as new () => { layout: (g: unknown) => Promise<unknown> })();

export function ProcessGraph<TNode = unknown, TGroup = unknown>({
  graph,
  direction = 'LR',
  renderNode,
  renderGroup,
  renderEdge,
  className,
  style,
  defaultZoom,
  fitOnMount = true,
  onLayoutComplete,
  onCycleDetected,
}: ProcessGraphProps<TNode, TGroup>) {
  const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
  const [viewport, setViewport] = useState<Rect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevSpecRef = useRef('');
  const hasFitted = useRef(false);

  const { worldStyle, handlers, applyFit, transform } = usePanZoom(
    defaultZoom ? { scale: defaultZoom } : undefined,
  );

  const specKey = JSON.stringify({
    nodes: graph.nodes,
    groups: graph.groups,
    edges: graph.edges,
    direction,
  });

  const doLayout = useCallback(async () => {
    try {
      const result = await runLayout(elk, graph, direction);
      setLayoutResult(result);
      onLayoutComplete?.(result);

      const cycleEdges: ProcessEdge[] = result.edges
        .filter((e) => e.isCycleEdge)
        .map(({ isCycleEdge: _i, points: _p, ...rest }) => rest);
      if (cycleEdges.length > 0) onCycleDetected?.(cycleEdges);
    } catch (err) {
      console.error('[react-process-graph] Layout failed:', err);
    }
  }, [graph, direction, onLayoutComplete, onCycleDetected]);

  useEffect(() => {
    if (specKey === prevSpecRef.current) return;
    prevSpecRef.current = specKey;
    hasFitted.current = false;
    void doLayout();
  }, [specKey, doLayout]);

  // Fit after first layout when fitOnMount is true
  useEffect(() => {
    if (!layoutResult || !fitOnMount || hasFitted.current) return;
    const container = containerRef.current;
    if (!container) return;
    hasFitted.current = true;
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    applyFit(fitTransform(layoutResult.bbox, { width, height }));
  }, [layoutResult, fitOnMount, applyFit]);

  const { visibleNodes, visibleEdges } = useVirtualization(
    layoutResult?.nodes ?? [],
    layoutResult?.edges ?? [],
    viewport,
  );

  if (!layoutResult) {
    return (
      <div
        className={className}
        style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
      />
    );
  }

  const { groups, bbox } = layoutResult;

  return (
    <Canvas
      ref={containerRef}
      className={className}
      style={style}
      worldStyle={worldStyle}
      {...handlers}
    >
      <ViewportTracker
        containerRef={containerRef}
        transform={transform}
        onViewportChange={setViewport}
      />
      <div
        style={{
          position: 'relative',
          width: bbox.width,
          height: bbox.height,
          cursor: transform.scale < 1 ? 'grab' : undefined,
        }}
      >
        <GroupLayer
          groups={groups as unknown as PositionedGroup<TGroup>[]}
          renderGroup={renderGroup}
          nodeChildren={new Map()}
        />
        <NodeLayer nodes={visibleNodes as unknown as PositionedNode<TNode>[]} renderNode={renderNode} />
        <EdgeLayer edges={visibleEdges} bbox={bbox} renderEdge={renderEdge} />
      </div>
    </Canvas>
  );
}

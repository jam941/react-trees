import { useState, useCallback, useRef } from 'react';
import type { FitTransform } from '../utils/bbox';

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface PanZoomHandlers {
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function usePanZoom(initialTransform?: Partial<Transform>) {
  const [transform, setTransform] = useState<Transform>({
    x: initialTransform?.x ?? 0,
    y: initialTransform?.y ?? 0,
    scale: initialTransform?.scale ?? 1,
  });

  // Track active pointer ids for drag
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const applyFit = useCallback((fit: FitTransform) => {
    setTransform({ x: fit.translateX, y: fit.translateY, scale: fit.scale });
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform((prev) => {
      const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newScale = clamp(prev.scale * zoomFactor, MIN_SCALE, MAX_SCALE);
      const scaleDelta = newScale / prev.scale;
      return {
        x: mouseX - (mouseX - prev.x) * scaleDelta,
        y: mouseY - (mouseY - prev.y) * scaleDelta,
        scale: newScale,
      };
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const worldStyle: React.CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  };

  const handlers: PanZoomHandlers = { onWheel, onPointerDown, onPointerMove, onPointerUp };

  return { transform, worldStyle, handlers, applyFit };
}

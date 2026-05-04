import { useState, useCallback, useRef, useEffect } from 'react';
import type { FitTransform } from '../utils/bbox';

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface PanZoomHandlers {
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function usePanZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  initialTransform?: Partial<Transform>,
) {
  const [transform, setTransform] = useState<Transform>({
    x: initialTransform?.x ?? 0,
    y: initialTransform?.y ?? 0,
    scale: initialTransform?.scale ?? 1,
  });

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const applyFit = useCallback((fit: FitTransform) => {
    setTransform({ x: fit.translateX, y: fit.translateY, scale: fit.scale });
  }, []);

  // Attach wheel listener imperatively so we can pass { passive: false }.
  // React's synthetic onWheel is passive since React 17 and cannot preventDefault.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
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
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef]);

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

  const handlers: PanZoomHandlers = { onPointerDown, onPointerMove, onPointerUp };

  return { transform, worldStyle, handlers, applyFit };
}

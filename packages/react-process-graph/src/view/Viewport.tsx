import { useState, useEffect, useRef } from 'react';
import type { Rect } from '../types';
import type { Transform } from './usePanZoom';
import { worldViewport } from './useVirtualization';

interface ViewportTrackerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: Transform;
  onViewportChange: (viewport: Rect) => void;
}

/** Tracks the container size and reports the current world-space viewport rect */
export function ViewportTracker({ containerRef, transform, onViewportChange }: ViewportTrackerProps) {
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
  const callbackRef = useRef(onViewportChange);
  callbackRef.current = onViewportChange;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(el);

    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) setContainerSize({ width, height });

    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!containerSize) return;
    callbackRef.current(worldViewport(containerSize, transform));
  }, [containerSize, transform]);

  return null;
}

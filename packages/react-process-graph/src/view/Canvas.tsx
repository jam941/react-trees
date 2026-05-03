import { forwardRef } from 'react';

interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  worldStyle?: React.CSSProperties;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ children, className, style, worldStyle, onWheel, onPointerDown, onPointerMove, onPointerUp }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        ...style,
      }}
      role="application"
      aria-label="Process dependency graph"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div style={{ position: 'absolute', transformOrigin: '0 0', ...worldStyle }}>
        {children}
      </div>
    </div>
  ),
);

Canvas.displayName = 'Canvas';

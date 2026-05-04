import { forwardRef } from 'react';

interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  worldStyle?: React.CSSProperties;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ children, className, style, worldStyle, onPointerDown, onPointerMove, onPointerUp }, ref) => (
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

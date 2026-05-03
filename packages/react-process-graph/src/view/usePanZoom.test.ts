import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePanZoom } from './usePanZoom';
import type { FitTransform } from '../utils/bbox';

describe('usePanZoom', () => {
  it('initializes with default transform', () => {
    const { result } = renderHook(() => usePanZoom());
    expect(result.current.transform).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it('respects initialTransform', () => {
    const { result } = renderHook(() => usePanZoom({ scale: 2, x: 10, y: 20 }));
    expect(result.current.transform).toEqual({ x: 10, y: 20, scale: 2 });
  });

  it('applyFit updates transform', () => {
    const { result } = renderHook(() => usePanZoom());
    const fit: FitTransform = { translateX: 40, translateY: 30, scale: 0.5 };
    act(() => result.current.applyFit(fit));
    expect(result.current.transform).toEqual({ x: 40, y: 30, scale: 0.5 });
  });

  it('onPointerDown + onPointerMove pans the view', () => {
    const { result } = renderHook(() => usePanZoom());

    const div = document.createElement('div');
    div.setPointerCapture = () => {};

    act(() => {
      result.current.handlers.onPointerDown({
        button: 0,
        clientX: 100,
        clientY: 100,
        currentTarget: div,
        pointerId: 1,
      } as never);
    });

    act(() => {
      result.current.handlers.onPointerMove({
        clientX: 130,
        clientY: 110,
      } as never);
    });

    expect(result.current.transform.x).toBe(30);
    expect(result.current.transform.y).toBe(10);
  });

  it('onPointerUp stops panning', () => {
    const { result } = renderHook(() => usePanZoom());
    const div = document.createElement('div');
    div.setPointerCapture = () => {};

    act(() => {
      result.current.handlers.onPointerDown({ button: 0, clientX: 0, clientY: 0, currentTarget: div, pointerId: 1 } as never);
      result.current.handlers.onPointerUp({} as never);
      result.current.handlers.onPointerMove({ clientX: 50, clientY: 50 } as never);
    });

    // No movement after pointerUp
    expect(result.current.transform.x).toBe(0);
    expect(result.current.transform.y).toBe(0);
  });

  it('worldStyle carries the CSS transform string', () => {
    const { result } = renderHook(() => usePanZoom({ x: 10, y: 20, scale: 1.5 }));
    expect(result.current.worldStyle.transform).toBe('translate(10px, 20px) scale(1.5)');
  });

  it('ignores non-primary mouse button for drag', () => {
    const { result } = renderHook(() => usePanZoom());
    const div = document.createElement('div');
    div.setPointerCapture = () => {};

    act(() => {
      result.current.handlers.onPointerDown({ button: 2, clientX: 0, clientY: 0, currentTarget: div, pointerId: 1 } as never);
      result.current.handlers.onPointerMove({ clientX: 50, clientY: 50 } as never);
    });

    expect(result.current.transform.x).toBe(0);
  });
});

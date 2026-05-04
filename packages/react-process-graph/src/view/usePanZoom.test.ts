import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePanZoom } from './usePanZoom';
import type { FitTransform } from '../utils/bbox';

function makeRef() {
  const div = document.createElement('div');
  div.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 }) as DOMRect;
  document.body.appendChild(div);
  return { ref: { current: div }, cleanup: () => document.body.removeChild(div) };
}

describe('usePanZoom', () => {
  it('initializes with default transform', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));
    expect(result.current.transform).toEqual({ x: 0, y: 0, scale: 1 });
    cleanup();
  });

  it('respects initialTransform', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref, { scale: 2, x: 10, y: 20 }));
    expect(result.current.transform).toEqual({ x: 10, y: 20, scale: 2 });
    cleanup();
  });

  it('applyFit updates transform', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));
    const fit: FitTransform = { translateX: 40, translateY: 30, scale: 0.5 };
    act(() => result.current.applyFit(fit));
    expect(result.current.transform).toEqual({ x: 40, y: 30, scale: 0.5 });
    cleanup();
  });

  it('wheel event zooms toward cursor', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));

    act(() => {
      ref.current.dispatchEvent(
        new WheelEvent('wheel', { deltaY: -100, clientX: 400, clientY: 300, bubbles: true }),
      );
    });

    expect(result.current.transform.scale).toBeGreaterThan(1);
    cleanup();
  });

  it('onPointerDown + onPointerMove pans the view', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));

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
    cleanup();
  });

  it('onPointerUp stops panning', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));
    const div = document.createElement('div');
    div.setPointerCapture = () => {};

    act(() => {
      result.current.handlers.onPointerDown({ button: 0, clientX: 0, clientY: 0, currentTarget: div, pointerId: 1 } as never);
      result.current.handlers.onPointerUp({} as never);
      result.current.handlers.onPointerMove({ clientX: 50, clientY: 50 } as never);
    });

    expect(result.current.transform.x).toBe(0);
    expect(result.current.transform.y).toBe(0);
    cleanup();
  });

  it('worldStyle carries the CSS transform string', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref, { x: 10, y: 20, scale: 1.5 }));
    expect(result.current.worldStyle.transform).toBe('translate(10px, 20px) scale(1.5)');
    cleanup();
  });

  it('ignores non-primary mouse button for drag', () => {
    const { ref, cleanup } = makeRef();
    const { result } = renderHook(() => usePanZoom(ref));
    const div = document.createElement('div');
    div.setPointerCapture = () => {};

    act(() => {
      result.current.handlers.onPointerDown({ button: 2, clientX: 0, clientY: 0, currentTarget: div, pointerId: 1 } as never);
      result.current.handlers.onPointerMove({ clientX: 50, clientY: 50 } as never);
    });

    expect(result.current.transform.x).toBe(0);
    cleanup();
  });
});

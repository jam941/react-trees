import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders children inside the world div', () => {
    const { getByText } = render(
      <Canvas><span>hello</span></Canvas>,
    );
    expect(getByText('hello')).toBeTruthy();
  });

  it('applies className and style to the outer container', () => {
    const { container } = render(
      <Canvas className="my-canvas" style={{ background: 'red' }}>
        <span />
      </Canvas>,
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer.classList.contains('my-canvas')).toBe(true);
    expect(outer.style.background).toBe('red');
  });

  it('applies worldStyle to the inner world div', () => {
    const { container } = render(
      <Canvas worldStyle={{ transform: 'translate(10px, 20px) scale(2)' }}>
        <span />
      </Canvas>,
    );
    const inner = (container.firstChild as HTMLElement).firstChild as HTMLElement;
    expect(inner.style.transform).toBe('translate(10px, 20px) scale(2)');
  });

  it('calls onPointerDown / onPointerMove / onPointerUp handlers', () => {
    const onPointerDown = vi.fn();
    const onPointerMove = vi.fn();
    const onPointerUp = vi.fn();
    const { container } = render(
      <Canvas onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <span />
      </Canvas>,
    );
    const el = container.firstChild as Element;
    fireEvent.pointerDown(el);
    fireEvent.pointerMove(el);
    fireEvent.pointerUp(el);
    expect(onPointerDown).toHaveBeenCalledOnce();
    expect(onPointerMove).toHaveBeenCalledOnce();
    expect(onPointerUp).toHaveBeenCalledOnce();
  });

  it('has role=application for accessibility', () => {
    const { container } = render(<Canvas><span /></Canvas>);
    expect((container.firstChild as HTMLElement).getAttribute('role')).toBe('application');
  });

  it('forwards ref to the outer container', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Canvas ref={ref}><span /></Canvas>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

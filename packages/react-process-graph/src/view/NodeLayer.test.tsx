import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeLayer } from './NodeLayer';
import type { PositionedNode } from '../types';

const nodes: PositionedNode[] = [
  { id: 'a', x: 10, y: 20, width: 120, height: 60 },
  { id: 'b', x: 200, y: 20, width: 120, height: 60 },
];

describe('NodeLayer', () => {
  it('calls renderNode for each visible node', () => {
    const renderNode = vi.fn((n: PositionedNode) => <div>{n.id}</div>);
    render(<NodeLayer nodes={nodes} renderNode={renderNode} />);
    expect(renderNode).toHaveBeenCalledTimes(2);
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.getByText('b')).toBeTruthy();
  });

  it('positions each node with absolute coordinates', () => {
    render(
      <NodeLayer nodes={nodes} renderNode={(n) => <span>{n.id}</span>} />,
    );
    const wrappers = document.querySelectorAll('[data-rpg-node]');
    expect(wrappers).toHaveLength(2);

    const a = wrappers[0] as HTMLElement;
    expect(a.style.left).toBe('10px');
    expect(a.style.top).toBe('20px');
    expect(a.style.width).toBe('120px');
    expect(a.style.height).toBe('60px');
  });

  it('respects width/height from PositionedNode', () => {
    const customNodes: PositionedNode[] = [{ id: 'c', x: 0, y: 0, width: 200, height: 100 }];
    render(<NodeLayer nodes={customNodes} renderNode={(n) => <div>{n.id}</div>} />);
    const wrapper = document.querySelector('[data-rpg-node="c"]') as HTMLElement;
    expect(wrapper.style.width).toBe('200px');
    expect(wrapper.style.height).toBe('100px');
  });

  it('renders nothing for an empty node list', () => {
    const { container } = render(
      <NodeLayer nodes={[]} renderNode={() => <div />} />,
    );
    expect(container.childElementCount).toBe(0);
  });
});

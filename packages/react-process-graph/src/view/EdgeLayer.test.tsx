import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EdgeLayer } from './EdgeLayer';
import type { PositionedEdge, Rect } from '../types';

const bbox: Rect = { x: 0, y: 0, width: 400, height: 300 };

const edges: PositionedEdge[] = [
  {
    id: 'e1', source: 'a', target: 'b', isCycleEdge: false,
    points: [{ x: 10, y: 30 }, { x: 200, y: 30 }],
  },
  {
    id: 'e2', source: 'b', target: 'a', isCycleEdge: true,
    points: [{ x: 200, y: 60 }, { x: 10, y: 60 }],
  },
];

describe('EdgeLayer', () => {
  it('renders one <g> per edge', () => {
    const { container } = render(<EdgeLayer edges={edges} bbox={bbox} />);
    const edgeGroups = container.querySelectorAll('[data-rpg-edge]');
    expect(edgeGroups).toHaveLength(2);
  });

  it('renders nothing when edges list is empty', () => {
    const { container } = render(<EdgeLayer edges={[]} bbox={bbox} />);
    expect(container.firstChild).toBeNull();
  });

  it('marks cycle edge with data-cycle attribute', () => {
    const { container } = render(<EdgeLayer edges={edges} bbox={bbox} />);
    const cycleEdge = container.querySelector('[data-rpg-edge="e2"]');
    expect(cycleEdge?.getAttribute('data-cycle')).toBe('true');
  });

  it('normal edge does not have data-cycle attribute', () => {
    const { container } = render(<EdgeLayer edges={edges} bbox={bbox} />);
    const normalEdge = container.querySelector('[data-rpg-edge="e1"]');
    expect(normalEdge?.hasAttribute('data-cycle')).toBe(false);
  });

  it('calls renderEdge for each edge when provided', () => {
    const renderEdge = vi.fn(() => <path />);
    render(<EdgeLayer edges={edges} bbox={bbox} renderEdge={renderEdge} />);
    expect(renderEdge).toHaveBeenCalledTimes(2);
  });
});

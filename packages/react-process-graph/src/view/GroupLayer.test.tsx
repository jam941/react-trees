import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GroupLayer } from './GroupLayer';
import type { PositionedGroup } from '../types';

const groups: PositionedGroup[] = [
  { id: 'g1', x: 0, y: 0, width: 200, height: 150 },
  { id: 'g2', x: 250, y: 0, width: 200, height: 150 },
];

describe('GroupLayer', () => {
  it('renders a container for each group', () => {
    const { container } = render(
      <GroupLayer groups={groups} nodeChildren={new Map()} />,
    );
    expect(container.querySelectorAll('[data-rpg-group]')).toHaveLength(2);
  });

  it('uses custom renderGroup when provided', () => {
    const renderGroup = vi.fn((g: PositionedGroup, children: React.ReactNode) => (
      <div data-testid={`custom-${g.id}`}>{children}</div>
    ));
    render(<GroupLayer groups={groups} renderGroup={renderGroup} nodeChildren={new Map()} />);
    expect(renderGroup).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('custom-g1')).toBeTruthy();
  });

  it('passes nodeChildren into renderGroup', () => {
    const children = new Map<string, React.ReactNode>([['g1', <span key="c">child</span>]]);
    render(
      <GroupLayer
        groups={groups}
        renderGroup={(_g, c) => <div>{c}</div>}
        nodeChildren={children}
      />,
    );
    expect(screen.getByText('child')).toBeTruthy();
  });
});

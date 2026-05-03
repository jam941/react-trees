import { expectTypeOf, describe, it } from 'vitest';
import type {
  ProcessNode,
  ProcessGroup,
  ProcessEdge,
  ProcessGraphSpec,
  PositionedNode,
  PositionedEdge,
  LayoutResult,
  Direction,
  ProcessGraphProps,
} from './types';

describe('ProcessNode', () => {
  it('defaults TData to unknown', () => {
    expectTypeOf<ProcessNode>().toHaveProperty('data').toEqualTypeOf<unknown>();
  });

  it('accepts a typed data payload', () => {
    expectTypeOf<ProcessNode<{ label: string }>>()
      .toHaveProperty('data')
      .toEqualTypeOf<{ label: string } | undefined>();
  });

  it('has required id and optional fields', () => {
    expectTypeOf<ProcessNode>().toHaveProperty('id').toEqualTypeOf<string>();
    expectTypeOf<ProcessNode>().toHaveProperty('groupId').toEqualTypeOf<string | undefined>();
    expectTypeOf<ProcessNode>().toHaveProperty('width').toEqualTypeOf<number | undefined>();
  });
});

describe('ProcessEdge', () => {
  it('source and target are strings (NodeId | GroupId)', () => {
    expectTypeOf<ProcessEdge>().toHaveProperty('source').toEqualTypeOf<string>();
    expectTypeOf<ProcessEdge>().toHaveProperty('target').toEqualTypeOf<string>();
  });

  it('sourceKind and targetKind are optional literals', () => {
    expectTypeOf<ProcessEdge>()
      .toHaveProperty('sourceKind')
      .toEqualTypeOf<'node' | 'group' | undefined>();
  });
});

describe('Direction', () => {
  it('is a union of 5 string literals', () => {
    expectTypeOf<Direction>().toEqualTypeOf<'LR' | 'RL' | 'TB' | 'BT' | 'force'>();
  });
});

describe('PositionedNode', () => {
  it('extends ProcessNode with Rect fields', () => {
    expectTypeOf<PositionedNode>().toHaveProperty('x').toEqualTypeOf<number>();
    expectTypeOf<PositionedNode>().toHaveProperty('y').toEqualTypeOf<number>();
    // width/height are required on PositionedNode (from Rect) even though they're optional on ProcessNode
    expectTypeOf<PositionedNode>().toHaveProperty('width').toEqualTypeOf<number>();
    expectTypeOf<PositionedNode>().toHaveProperty('height').toEqualTypeOf<number>();
  });
});

describe('PositionedEdge', () => {
  it('has points array and isCycleEdge flag', () => {
    expectTypeOf<PositionedEdge>()
      .toHaveProperty('points')
      .toEqualTypeOf<Array<{ x: number; y: number }>>();
    expectTypeOf<PositionedEdge>().toHaveProperty('isCycleEdge').toEqualTypeOf<boolean>();
  });
});

describe('LayoutResult', () => {
  it('contains arrays and a bbox', () => {
    expectTypeOf<LayoutResult>().toHaveProperty('nodes').toEqualTypeOf<PositionedNode[]>();
    expectTypeOf<LayoutResult>().toHaveProperty('edges').toEqualTypeOf<PositionedEdge[]>();
    expectTypeOf<LayoutResult>()
      .toHaveProperty('bbox')
      .toHaveProperty('width')
      .toEqualTypeOf<number>();
  });
});

describe('ProcessGraphSpec', () => {
  it('groups is optional', () => {
    expectTypeOf<ProcessGraphSpec>()
      .toHaveProperty('groups')
      .toEqualTypeOf<ProcessGroup[] | undefined>();
  });
});

describe('ProcessGraphProps', () => {
  it('renderNode is required', () => {
    expectTypeOf<ProcessGraphProps>()
      .toHaveProperty('renderNode')
      .toBeFunction();
  });

  it('renderGroup and renderEdge are optional', () => {
    type RG = ProcessGraphProps['renderGroup'];
    type RE = ProcessGraphProps['renderEdge'];
    expectTypeOf<RG>().toEqualTypeOf<
      | ((group: import('./types').PositionedGroup, children: import('react').ReactNode) => import('react').ReactNode)
      | undefined
    >();
    expectTypeOf<RE>().toEqualTypeOf<
      ((edge: PositionedEdge) => import('react').ReactNode) | undefined
    >();
  });
});

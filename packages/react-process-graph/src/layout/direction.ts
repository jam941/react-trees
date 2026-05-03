import type { Direction } from '../types';

export interface ElkLayoutOptions {
  'elk.algorithm': string;
  'elk.direction'?: string;
  'elk.hierarchyHandling': string;
  'elk.layered.spacing.nodeNodeBetweenLayers': string;
  'elk.spacing.nodeNode': string;
  'elk.padding': string;
}

export function directionToElkOptions(direction: Direction): ElkLayoutOptions {
  const base: ElkLayoutOptions = {
    'elk.algorithm': 'layered',
    'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    'elk.layered.spacing.nodeNodeBetweenLayers': '60',
    'elk.spacing.nodeNode': '30',
    'elk.padding': '[left=20, top=20, right=20, bottom=20]',
  };

  if (direction === 'force') {
    return { ...base, 'elk.algorithm': 'force' };
  }

  const elkDirectionMap: Record<Exclude<Direction, 'force'>, string> = {
    LR: 'RIGHT',
    RL: 'LEFT',
    TB: 'DOWN',
    BT: 'UP',
  };

  return { ...base, 'elk.direction': elkDirectionMap[direction] };
}

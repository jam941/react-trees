import { describe, it, expect } from 'vitest';
import { directionToElkOptions } from './direction';

describe('directionToElkOptions', () => {
  it.each([
    ['LR', 'RIGHT'],
    ['RL', 'LEFT'],
    ['TB', 'DOWN'],
    ['BT', 'UP'],
  ] as const)('%s maps to elk.direction=%s with layered algorithm', (dir, elkDir) => {
    const opts = directionToElkOptions(dir);
    expect(opts['elk.algorithm']).toBe('layered');
    expect(opts['elk.direction']).toBe(elkDir);
    expect(opts['elk.hierarchyHandling']).toBe('INCLUDE_CHILDREN');
  });

  it('force direction uses force algorithm and omits elk.direction', () => {
    const opts = directionToElkOptions('force');
    expect(opts['elk.algorithm']).toBe('force');
    expect('elk.direction' in opts).toBe(false);
  });

  it('all directions include spacing and padding options', () => {
    for (const dir of ['LR', 'RL', 'TB', 'BT', 'force'] as const) {
      const opts = directionToElkOptions(dir);
      expect(opts['elk.spacing.nodeNode']).toBeDefined();
      expect(opts['elk.padding']).toBeDefined();
    }
  });
});

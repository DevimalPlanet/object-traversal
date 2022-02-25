import { TraversalOpts } from './types';

export const DEFAULT_SEPARATOR = '.';

export const DEFAULT_TRAVERSAL_OPTS: Required<TraversalOpts> = {
  traversalType: 'depth-first',
  maxNodes: Number.MAX_SAFE_INTEGER,
  cycleHandling: true,
  maxDepth: Number.MAX_SAFE_INTEGER,
  haltOnTruthy: false,
  pathSeparator: DEFAULT_SEPARATOR,
};

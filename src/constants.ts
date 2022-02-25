import { TraversalOpts } from './types';

export const DEFAULT_SEPARATOR = '.';

export const DEFAULT_TRAVERSAL_OPTS: Required<TraversalOpts> = {
  traversalType: 'depth-first',
  maxNodes: Number.POSITIVE_INFINITY,
  cycleHandling: true,
  maxDepth: Number.POSITIVE_INFINITY,
  haltOnTruthy: false,
  pathSeparator: DEFAULT_SEPARATOR,
};

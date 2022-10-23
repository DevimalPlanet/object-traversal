import { DEFAULT_TRAVERSAL_OPTS } from './constants';
import { _Queue, _QueueToStackAdapter } from './queue';
import { _Stack } from './stack';
import {
  ArbitraryObject,
  FullTraversalOpts,
  TraversalCallback,
  TraversalCallbackContext,
  TraversalMeta,
  TraversalOpts,
} from './types';

/** Applies a given callback function to all properties of an object and its children */
export const traverse = (
  root: ArbitraryObject,
  callback: TraversalCallback,
  opts?: TraversalOpts
): void => {
  if (!(root instanceof Object)) {
    throw new Error('First argument must be an object');
  }

  const fullOpts = Object.assign(
    {},
    DEFAULT_TRAVERSAL_OPTS,
    opts
  ) as FullTraversalOpts;
  fullOpts.disablePathTracking = typeof fullOpts.pathSeparator !== 'string';

  let stackOrQueue: _Stack<TraversalCallbackContext>;
  if (fullOpts.traversalType === 'depth-first') {
    stackOrQueue = new _Stack();
  } else {
    stackOrQueue = new _QueueToStackAdapter(new _Queue());
  }

  const traversalMeta: TraversalMeta = {
    visitedNodes: new WeakSet(),
    depth: 0,
  };
  if (!fullOpts.disablePathTracking) {
    traversalMeta.nodePath = null;
  }

  stackOrQueue.push({
    parent: null,
    key: null,
    value: root,
    meta: traversalMeta,
  });

  _traverse(callback, stackOrQueue, fullOpts);
};

const _traverse = (
  callback: TraversalCallback,
  stackOrQueue: _Stack<TraversalCallbackContext>,
  opts: FullTraversalOpts
) => {
  /**
   * Using a stack instead of a queue to preserve the natural depth-first traversal order. Using a queue or traversing an array
   *   in order would lead the depth-first to traverse the value.properties in reverse order.
   * Breadth-first traversal uses queues as usual.
   */
  let newNodesToVisit: _Stack<TraversalCallbackContext>;
  if (opts.traversalType === 'depth-first') {
    newNodesToVisit = new _Stack();
  } else {
    newNodesToVisit = new _QueueToStackAdapter(new _Queue());
  }

  const {
    maxNodes,
    cycleHandling,
    maxDepth,
    haltOnTruthy,
    pathSeparator,
  } = opts;
  let visitedNodeCount = 0;
  while (!stackOrQueue.isEmpty() && maxNodes > visitedNodeCount) {
    const callbackContext = stackOrQueue.pop()!;
    const { value, meta } = callbackContext;
    const { visitedNodes } = meta;
    const nodeIsObject = value instanceof Object;

    const skipNode = cycleHandling && nodeIsObject && visitedNodes.has(value);
    if (skipNode) {
      continue;
    }

    if (callback(callbackContext) && haltOnTruthy) {
      break;
    }
    visitedNodeCount++;

    if (nodeIsObject) {
      visitedNodes.add(value);
      const { depth, nodePath } = meta;
      const newDepth = depth + 1;
      if (newDepth > maxDepth) {
        continue;
      }

      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        const property = keys[i];

        const traversalMeta: TraversalMeta = {
          visitedNodes,
          depth: newDepth,
        };

        let newPath: string;
        if (!opts.disablePathTracking) {
          if (!nodePath) {
            newPath = property;
          } else {
            newPath = `${nodePath}${pathSeparator}${property}`;
          }

          traversalMeta.nodePath = newPath;
        }

        newNodesToVisit.push({
          value: value[property],
          meta: traversalMeta,
          key: property,
          parent: value,
        });
      }

      while (!newNodesToVisit.isEmpty()) {
        stackOrQueue.push(newNodesToVisit.pop());
      }
    }
  }
};

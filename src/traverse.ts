import { _Queue, _QueueToStackAdapter } from './queue';
import { TraversalMeta, TraversalOpts } from './types';
import { DEFAULT_TRAVERSAL_OPTS } from './constants';
import { _Stack } from './stack';
import {
  ArbitraryObject,
  TraversalCallback,
  TraversalCallbackContext,
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

  opts = Object.assign({}, DEFAULT_TRAVERSAL_OPTS, opts);

  let stackOrQueue: _Stack<TraversalCallbackContext>;
  if (opts.traversalType === 'depth-first') {
    stackOrQueue = new _Stack();
  } else {
    stackOrQueue = new _QueueToStackAdapter(new _Queue());
  }

  const traversalMeta: TraversalMeta = {
    visitedNodes: new WeakSet(),
    depth: 0,
  };
  if (typeof opts.pathSeparator !== 'string') {
    traversalMeta.nodePath = null;
  }

  stackOrQueue.push({
    parent: null,
    key: null,
    value: root,
    meta: traversalMeta,
  });

  _traverse(callback, stackOrQueue, opts as Required<TraversalOpts>);
};

const _traverse = (
  callback: TraversalCallback,
  stackOrQueue: _Stack<TraversalCallbackContext>,
  opts: Required<TraversalOpts>
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
    maxNodeCount,
    cycleHandling,
    maxDepth,
    haltOnTruthy,
    pathSeparator,
  } = opts;
  const disablePathTracking = typeof pathSeparator !== 'string';
  const allowCycles = !cycleHandling;
  let visitedNodeCount = 0;
  while (!stackOrQueue.isEmpty() && maxNodeCount > visitedNodeCount) {
    const callbackContext = stackOrQueue.pop()!;
    const { value, meta } = callbackContext;
    const { visitedNodes } = meta;
    const valueIsObject = value instanceof Object;
    if (!valueIsObject || allowCycles || !visitedNodes.has(value)) {
      if (callback(callbackContext) && haltOnTruthy) {
        break;
      }
      visitedNodeCount++;
    } else {
      continue;
    }

    if (valueIsObject) {
      visitedNodes.add(value); // only add if valueIsObject
      const { depth, nodePath } = meta;
      const newDepth = depth + 1;
      if (newDepth > maxDepth) {
        continue;
      }

      newNodesToVisit.reset();
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        const property = keys[i];

        const traversalMeta: TraversalMeta = {
          visitedNodes,
          depth: newDepth,
        };

        let newPath: string;
        if (!disablePathTracking) {
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

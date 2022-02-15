import { TraversalOpts, _Queue, _QueueToStackAdapter } from '.';
import { _Stack } from './stack';
import {
  ArbitraryObject,
  TraversalCallback,
  TraversalCallbackContext,
} from './types';

const DEFAULT_TRAVERSAL_OPTS: Required<TraversalOpts> = {
  traversalType: 'depth-first',
  maxNodeCount: Number.MAX_SAFE_INTEGER,
  cycleHandling: true,
};

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

  let stackOrQueue: _Stack<TraversalCallbackContext> =
    opts.traversalType === 'depth-first'
      ? new _Stack()
      : new _QueueToStackAdapter(new _Queue());
  stackOrQueue.push({
    parent: null,
    key: null,
    value: root,
    meta: {
      visitedNodes: new WeakSet(),
      currentPath: null,
      depth: 0,
    },
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
  let newNodesToVisit: _Stack<TraversalCallbackContext> =
    opts.traversalType === 'depth-first'
      ? new _Stack()
      : new _QueueToStackAdapter(new _Queue());

  const { maxNodeCount, cycleHandling } = opts;
  const allowCycles = !cycleHandling;
  let visitedNodeCount = 0;
  while (!stackOrQueue.isEmpty() && maxNodeCount > visitedNodeCount) {
    const callbackContext = stackOrQueue.pop()!;
    const { value, meta } = callbackContext;
    const { visitedNodes } = meta;
    const valueIsObject = value instanceof Object;
    if (!valueIsObject || allowCycles || !visitedNodes.has(value)) {
      callback(callbackContext);
      visitedNodeCount++;
    } else {
      continue;
    }

    if (valueIsObject) {
      const { depth, currentPath } = meta;
      visitedNodes.add(value);
      newNodesToVisit.reset();

      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        const property = keys[i];
        newNodesToVisit.push({
          value: value[property],
          meta: {
            currentPath: !currentPath ? property : `${currentPath}.${property}`,
            visitedNodes: visitedNodes,
            depth: depth + 1,
          },
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
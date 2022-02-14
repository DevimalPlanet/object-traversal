import { _Stack } from './stack';
import {
  ArbitraryObject,
  TraversalCallback,
  TraversalCallbackContext,
} from './types';

/** Applies a given callback function to all properties of an object and its children */
export const traverse = (
  root: ArbitraryObject,
  callback: TraversalCallback
): void => {
  if (!(root instanceof Object)) {
    throw new Error('First argument must be an object');
  }

  let stack: _Stack<TraversalCallbackContext> = new _Stack();
  stack.push({
    parent: null,
    key: null,
    value: root,
    meta: {
      visitedNodes: new WeakSet(),
      currentPath: null,
      depth: 0,
    },
  });

  _traverse(callback, stack);
};

const _traverse = (
  callback: TraversalCallback,
  stack: _Stack<TraversalCallbackContext>
) => {
  /**
   * Using a stack instead of a queue to preserve the natural depth-first traversal order.
   * Using a queue or traversing an array in order would lead the depth-first to traverse the value.properties in reverse order.
   */
  let newNodesToVisit: _Stack<TraversalCallbackContext> = new _Stack();
  while (!stack.isEmpty()) {
    const { value, meta, parent, key } = stack.pop()!;
    const { depth, currentPath, visitedNodes } = meta;
    const valueIsObject = value instanceof Object;
    if (!valueIsObject || !visitedNodes.has(value)) {
      callback({ value, meta, parent, key });
    } else {
      continue;
    }

    if (valueIsObject) {
      meta.visitedNodes.add(value);
      newNodesToVisit.reset();

      for (const property in value) {
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
        stack.push(newNodesToVisit.pop());
      }
    }
  }
};
